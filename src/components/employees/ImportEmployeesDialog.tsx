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
  DialogDescription,
  DialogClose
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
import { EmployeeInsertData } from '@/types/employeeTypes';

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
        if (!employee.email || !employee.full_name) {
          console.error("Missing required fields:", employee);
          continue;
        }

        const employeeData: EmployeeInsertData = {
          user_id: safeUserId,
          email: employee.email,
          full_name: employee.full_name,
        };
        
        Object.entries(employee).forEach(([key, value]) => {
          if (key === 'user_id' || key === 'email' || key === 'full_name' || key === 'id' || value === undefined || value === null) {
            return;
          }

          if (['gross_salary', 'allowances', 'basic_salary', 'work_hours', 'notice_period'].includes(key)) {
            if (typeof value === 'string') {
              if (['yes', 'no', 'true', 'false'].includes(value.toLowerCase())) {
                employeeData[key] = null;
              } else if (!isNaN(Number(value))) {
                employeeData[key] = Number(value);
              } else {
                employeeData[key] = null;
              }
            } else if (typeof value === 'number') {
              employeeData[key] = value;
            } else {
              employeeData[key] = null;
            }
            return;
          }
          
          if (['cpf_contribution', 'disciplinary_flags', 'must_clock', 'all_work_day', 
                'freeze_payment', 'paid_medical_examination_fee', 'new_graduate', 
                'rehire', 'contract_signed', 'thirteenth_month_entitlement'].includes(key)) {
            employeeData[key] = stringToBoolean(value);
            return;
          }

          if (key === 'annual_bonus_eligible') {
            if (typeof value === 'string') {
              if (!isNaN(Number(value))) {
                employeeData[key] = Number(value);
              } 
              else if (['yes', 'no'].includes(value.toLowerCase())) {
                employeeData[key] = value.toLowerCase() === 'yes' ? 1 : 0;
              } 
              else {
                employeeData[key] = null;
              }
            } else if (typeof value === 'number') {
              employeeData[key] = value;
            } else {
              employeeData[key] = null;
            }
            return;
          }
          
          employeeData[key] = value;
        });

        const { error } = await supabase
          .from('employees')
          .insert(employeeData as any); // Type assertion to bypass TypeScript error
        
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">Import Employees</DialogTitle>
            <DialogDescription className="text-sm">
              Upload an Excel file. Use the template for correct formatting.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-2">
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

          <DialogFooter className="flex flex-row justify-between sm:justify-between pt-4">
  <Button variant="outline" onClick={downloadTemplate} disabled={isImporting}>
    <Download className="mr-2 h-4 w-4" /> Download Template
  </Button>
  <div className="flex gap-2">
    <DialogClose asChild>
      <Button variant="outline" disabled={isImporting}>Cancel</Button>
    </DialogClose>
    <Button
      variant="primary"
      onClick={processImport}
      disabled={!file || isImporting}
      className={`${!file || isImporting ? "opacity-60 bg-hrflow-primary text-white" : "text-white bg-hrflow-primary hover:bg-hrflow-dark"}`}
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
