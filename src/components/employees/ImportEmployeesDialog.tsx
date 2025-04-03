
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

interface ImportEmployeesDialogProps {
  onImportSuccess?: () => void
}

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
        .in('email', emails);
      
      if (error) throw error;
      
      const existingEmails = new Set(data.map(emp => emp.email.toLowerCase()));
      
      const duplicates = employees.filter(emp => 
        emp.email && existingEmails.has(emp.email.toLowerCase())
      );
      
      const newEmployees = employees.filter(emp => 
        !emp.email || !existingEmails.has(emp.email.toLowerCase())
      );
      
      return { duplicates, newEmployees };
    } catch (error: any) {
      console.error("Error checking for duplicates:", error);
      throw error;
    }
  };
  
  const processImport = async () => {
    if (!file || !user) return;
    
    setIsImporting(true);
    
    try {
      // Process the Excel file to extract employee data
      const employees = await processEmployeeImport(file);
      
      console.log("Parsed employee data:", employees);
      
      if (employees.length === 0) {
        throw new Error("No valid employees found with required fields (full_name and email)");
      }
      
      // Check for duplicates
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
      
      // Add user_id to each employee record and ensure correct types
      const employeesWithUserId = employees.map(employee => {
        // Convert string 'Yes'/'No' values to boolean for boolean fields
        const typedEmployee: Partial<Employee> = {
          ...employee,
          user_id: safeUserId,
          // Ensure boolean fields are properly typed
          cpf_contribution: typeof employee.cpf_contribution === 'string'
            ? employee.cpf_contribution.toLowerCase() === 'yes' || employee.cpf_contribution.toLowerCase() === 'true'
            : !!employee.cpf_contribution,
          disciplinary_flags: typeof employee.disciplinary_flags === 'string'
            ? employee.disciplinary_flags.toLowerCase() === 'yes' || employee.disciplinary_flags.toLowerCase() === 'true'
            : !!employee.disciplinary_flags,
          must_clock: typeof employee.must_clock === 'string'
            ? employee.must_clock.toLowerCase() === 'yes' || employee.must_clock.toLowerCase() === 'true'
            : !!employee.must_clock,
          all_work_day: typeof employee.all_work_day === 'string'
            ? employee.all_work_day.toLowerCase() === 'yes' || employee.all_work_day.toLowerCase() === 'true'
            : !!employee.all_work_day,
          freeze_payment: typeof employee.freeze_payment === 'string'
            ? employee.freeze_payment.toLowerCase() === 'yes' || employee.freeze_payment.toLowerCase() === 'true'
            : !!employee.freeze_payment,
          paid_medical_examination_fee: typeof employee.paid_medical_examination_fee === 'string'
            ? employee.paid_medical_examination_fee.toLowerCase() === 'yes' || employee.paid_medical_examination_fee.toLowerCase() === 'true'
            : !!employee.paid_medical_examination_fee,
          new_graduate: typeof employee.new_graduate === 'string'
            ? employee.new_graduate.toLowerCase() === 'yes' || employee.new_graduate.toLowerCase() === 'true'
            : !!employee.new_graduate,
          rehire: typeof employee.rehire === 'string'
            ? employee.rehire.toLowerCase() === 'yes' || employee.rehire.toLowerCase() === 'true'
            : !!employee.rehire,
          contract_signed: typeof employee.contract_signed === 'string'
            ? employee.contract_signed.toLowerCase() === 'yes' || employee.contract_signed.toLowerCase() === 'true'
            : !!employee.contract_signed,
          thirteenth_month_entitlement: typeof employee.thirteenth_month_entitlement === 'string'
            ? employee.thirteenth_month_entitlement.toLowerCase() === 'yes' || employee.thirteenth_month_entitlement.toLowerCase() === 'true'
            : !!employee.thirteenth_month_entitlement,
        };
        
        return typedEmployee;
      });
      
      // Insert employees in batches
      for (const employee of employeesWithUserId) {
        const { error } = await supabase
          .from('employees')
          .insert(employee);
          
        if (error) throw error;
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
  
  const handleImportEmployees = async () => {
    await processImport();
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
                onClick={handleImportEmployees} 
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
