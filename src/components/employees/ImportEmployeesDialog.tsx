
import React, { useState } from 'react';
import { Upload, FileUp, Download } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateEmployeeTemplate, processEmployeeImport } from '@/utils/excelUtils';
import { Employee } from '@/types/employee';
import { stringToBoolean } from '@/utils/formatters';

interface ImportEmployeesDialogProps {
  onImportSuccess?: () => void;
}

const checkForDuplicates = async (employees: Partial<Employee>[]) => {
  try {
    const emails = employees
      .map(emp => typeof emp.email === 'string' ? emp.email.trim().toLowerCase() : null)
      .filter((email): email is string => !!email);

    if (emails.length === 0) return { duplicates: [], newEmployees: employees };

    const { data, error } = await supabase
      .from('employees')
      .select('email')
      .in('email', emails);

    if (error) throw error;

    const existingEmails = new Set(
      (data || [])
        .map(emp => typeof emp.email === 'string' ? emp.email.trim().toLowerCase() : null)
        .filter((email): email is string => !!email)
    );

    const duplicates = employees.filter(emp =>
      typeof emp.email === 'string' &&
      existingEmails.has(emp.email.trim().toLowerCase())
    );

    const newEmployees = employees.filter(emp =>
      !emp.email ||
      (typeof emp.email === 'string' && !existingEmails.has(emp.email.trim().toLowerCase()))
    );

    return { duplicates, newEmployees };

  } catch (error: any) {
    console.error("Error checking for duplicates:", error);
    throw error;
  }
};

export const ImportEmployeesDialog: React.FC<ImportEmployeesDialogProps> = ({ onImportSuccess }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [newEmployeesCount, setNewEmployeesCount] = useState(0);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [pendingEmployees, setPendingEmployees] = useState<Partial<Employee>[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportError(null);
    }
  };

  const downloadTemplate = () => {
    generateEmployeeTemplate();
    toast({
      title: "Template Downloaded",
      description: "Complete employee import template has been downloaded.",
    });
  };

  const importEmployeesToDatabase = async (employees: Partial<Employee>[]) => {
    try {
      if (employees.length === 0) {
        toast({
          title: "No Employees to Import",
          description: "No valid employees were found to import.",
          variant: "destructive",
        });
        setIsImporting(false);
        return;
      }

      const safeUserId = user?.id?.trim();
      if (!safeUserId) throw new Error("Invalid user session. Please log in again.");

      for (const employee of employees) {
        // Extract related entities that should be stored separately
        const {
          created_at, updated_at, id,
          ...baseEmployee
        } = employee;

        // Process the base employee data, carefully handling numeric/boolean fields
        const processedEmployee: Record<string, any> = {
          user_id: safeUserId,
          email: employee.email,
          full_name: employee.full_name
        };
        
        // Add all string and simple fields
        Object.entries(baseEmployee).forEach(([key, value]) => {
          // Skip undefined values and nested objects
          if (value === undefined || value === null) return;
          
          // Handle special cases for fields that need to be numeric in DB
          if (['gross_salary', 'allowances', 'work_hours', 'notice_period'].includes(key)) {
            if (typeof value === 'string' && !isNaN(Number(value))) {
              processedEmployee[key] = Number(value);
            } else if (typeof value === 'number') {
              processedEmployee[key] = value;
            }
            return;
          }
          
          // Handle booleans
          if (['cpf_contribution', 'disciplinary_flags', 'must_clock', 'all_work_day', 
                'freeze_payment', 'paid_medical_examination_fee', 'new_graduate', 
                'rehire', 'contract_signed', 'thirteenth_month_entitlement'].includes(key)) {
            processedEmployee[key] = stringToBoolean(value);
            return;
          }
          
          // Add the value as is for other fields
          processedEmployee[key] = value;
        });
        
        // Check if email and full_name are present
        if (!processedEmployee.email) {
          console.error("Employee missing email:", processedEmployee);
          continue; // Skip this employee
        }
        
        if (!processedEmployee.full_name) {
          console.error("Employee missing full name:", processedEmployee);
          continue; // Skip this employee
        }

        // Ensure the employee has the required properties
        if (!processedEmployee.user_id || !processedEmployee.email || !processedEmployee.full_name) {
          console.error("Missing required fields for employee:", processedEmployee);
          continue; // Skip this employee
        }

        // Insert the employee record with required fields
        const { error } = await supabase
          .from('employees')
          .insert({
            user_id: processedEmployee.user_id,
            email: processedEmployee.email,
            full_name: processedEmployee.full_name,
            ...processedEmployee
          });
        
        if (error) {
          console.error("Error inserting employee:", error);
          throw error;
        }
      }

      toast({
        title: "Import Successful",
        description: `Successfully imported ${employees.length} employees.`,
      });

      if (onImportSuccess) onImportSuccess();

      setFile(null);
      setPendingEmployees([]);
      setDuplicateCount(0);
      setNewEmployeesCount(0);
      setIsImporting(false);

    } catch (error: any) {
      console.error("Error importing employees to database:", error);
      setImportError(error.message || "An error occurred while importing employees.");
      toast({
        title: "Import Failed",
        description: error.message || "An error occurred while importing employees.",
        variant: "destructive",
      });
      setIsImporting(false);
    }
  };

  const processImport = async () => {
    if (!file || !user) return;
    setIsImporting(true);
    setImportError(null);

    try {
      const employeeForms = await processEmployeeImport(file);
      if (employeeForms.length === 0) throw new Error("No valid employees found (e.g. missing full_name or email)");

      // Extract just the employee data from the form data
      const employees = employeeForms.map(form => form.employee || {});
      
      const { duplicates, newEmployees } = await checkForDuplicates(employees);

      if (duplicates.length > 0) {
        setDuplicateCount(duplicates.length);
        setNewEmployeesCount(newEmployees.length);
        setPendingEmployees(newEmployees);
        setShowDuplicateAlert(true);
        setIsImporting(false);
        return;
      }

      await importEmployeesToDatabase(newEmployees);

    } catch (error: any) {
      console.error("Error during import:", error);
      setImportError(error.message || "An error occurred.");
      toast({
        title: "Import Failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
      setIsImporting(false);
    }
  };

  const handleProceedWithNewOnly = async () => {
    setShowDuplicateAlert(false);
    await importEmployeesToDatabase(pendingEmployees);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Employees</DialogTitle>
            <DialogDescription>
              Upload an Excel file. Use the template for correct formatting.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="flex flex-col items-center justify-center py-4 gap-4">
              <div className="border rounded-md p-6 w-full">
                <div className="flex flex-col items-center gap-2">
                  <FileUp className="h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {file ? file.name : "Upload your employee data Excel file"}
                  </p>
                  <Input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="max-w-xs"
                  />
                </div>
              </div>
            </div>
            
            {importError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                <p className="font-medium">Import Failed</p>
                <p className="text-sm mt-1">{importError}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            <Button variant="outline" onClick={downloadTemplate} disabled={isImporting}>
              <Download className="mr-2 h-4 w-4" /> Download Template
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" disabled={isImporting}>Cancel</Button>
              <Button
                variant="primary"
                onClick={processImport}
                disabled={!file || isImporting}
              >
                {isImporting ? "Importing..." : "Import Employees"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDuplicateAlert} onOpenChange={setShowDuplicateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Employees Detected</AlertDialogTitle>
            <AlertDialogDescription>
              {duplicateCount} duplicate(s) detected. Proceed with {newEmployeesCount} new?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleProceedWithNewOnly}>
              Import New Only
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
