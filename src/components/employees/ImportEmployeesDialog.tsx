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
  onImportSuccess?: () => void
}

const cleanObject = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== ''));

export const ImportEmployeesDialog: React.FC<ImportEmployeesDialogProps> = ({ onImportSuccess }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [newEmployeesCount, setNewEmployeesCount] = useState(0);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [pendingEmployees, setPendingEmployees] = useState<Partial<Employee>[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    generateEmployeeTemplate();
    toast({
      title: "Template Downloaded",
      description: "Complete employee import template has been downloaded with all fields organized by category.",
    });
  };

  const checkForDuplicates = async (employees: Partial<Employee>[]) => {
    try {
      const emails = employees.map(emp => emp.email).filter(Boolean);

      if (emails.length === 0) return { duplicates: [], newEmployees: employees };

      const { data, error } = await supabase
        .from('employees')
        .select('email')
        .in('email', emails as string[]);

      if (error) throw error;

      const existingEmails = new Set(
  data
    .map(emp => typeof emp.email === 'string' ? emp.email.toLowerCase() : null)
    .filter((email): email is string => !!email)
);

      const duplicates = employees.filter(emp => 
        emp.email && existingEmails.has(emp.email.toLowerCase())
      );

      const newEmployees = employees.filter(emp => 
        !emp.email || !existingEmails.has(emp.email?.toLowerCase() || '')
      );

      return { duplicates, newEmployees };
    } catch (error: any) {
      console.error("Error checking for duplicates:", error);
      throw error;
    }
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

      console.log(`Importing ${employees.length} employees to database`);

      const safeUserId = user?.id?.trim();
      if (!safeUserId) throw new Error("Invalid user session. Please log in again.");

      for (const employee of employees) {
        const {
          allowances, familyMembers, education, workExperience, appraisalRatings, documents,
          created_at, updated_at, id,
          ...baseEmployee
        } = employee;

        const typedEmployee: Partial<Employee> = cleanObject({
          ...baseEmployee,
          user_id: safeUserId,
          cpf_contribution: stringToBoolean(baseEmployee.cpf_contribution),
          disciplinary_flags: stringToBoolean(baseEmployee.disciplinary_flags),
          must_clock: stringToBoolean(baseEmployee.must_clock),
          all_work_day: stringToBoolean(baseEmployee.all_work_day),
          freeze_payment: stringToBoolean(baseEmployee.freeze_payment),
          paid_medical_examination_fee: stringToBoolean(baseEmployee.paid_medical_examination_fee),
          new_graduate: stringToBoolean(baseEmployee.new_graduate),
          rehire: stringToBoolean(baseEmployee.rehire),
          contract_signed: stringToBoolean(baseEmployee.contract_signed),
          thirteenth_month_entitlement: stringToBoolean(baseEmployee.thirteenth_month_entitlement),
        });

        const { error } = await supabase
          .from('employees')
          .insert(typedEmployee);

        if (error) {
          console.error("Insert failed for:", typedEmployee.email || typedEmployee.full_name, error.message);
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
      toast({
        title: "Import Failed",
        description: error.message || "An error occurred while importing employees to the database.",
        variant: "destructive",
      });
      setIsImporting(false);
    }
  };

  const processImport = async () => {
    if (!file || !user) return;

    setIsImporting(true);

    try {
      const employees = await processEmployeeImport(file);

      if (employees.length === 0) {
        throw new Error("No valid employees found with required fields (full_name and email)");
      }

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
      console.error("Error importing employees:", error);
      toast({
        title: "Import Failed",
        description: error.message || "An error occurred while importing employees.",
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
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Employees</DialogTitle>
            <DialogDescription>
              Upload an Excel file with employee data. 
              Download the template file to ensure proper formatting with all required and optional fields.
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
          </div>
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              disabled={isImporting}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" disabled={isImporting}>
                Cancel
              </Button>
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
              {duplicateCount} duplicate {duplicateCount === 1 ? 'employee' : 'employees'} detected. 
              Proceed with import of remaining {newEmployeesCount} new {newEmployeesCount === 1 ? 'employee' : 'employees'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDuplicateAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleProceedWithNewOnly}>
              Import New Employees Only
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
