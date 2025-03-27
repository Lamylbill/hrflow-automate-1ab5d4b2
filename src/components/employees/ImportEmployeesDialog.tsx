
import React, { useState } from 'react';
import { Download, Upload, FileUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateEmployeeTemplate } from '@/utils/excelUtils';

interface ImportEmployeesDialogProps {
  onImportSuccess?: () => void
}

export const ImportEmployeesDialog: React.FC<ImportEmployeesDialogProps> = ({ onImportSuccess }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
      description: "The employee template has been downloaded to your device.",
    });
  };
  
  const importEmployees = async () => {
    if (!file || !user) return;
    
    setIsImporting(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const worksheetName = workbook.SheetNames[1];
          const worksheet = workbook.Sheets[worksheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            range: 2
          }) as any[][];
          
          const filteredData = jsonData.filter(row => 
            row.length > 0 && row.some(cell => cell !== undefined && cell !== '')
          );
          
          if (filteredData.length === 0) {
            throw new Error("No valid data found in the import file");
          }
          
          const headers = workbook.Sheets[worksheetName] ? 
            XLSX.utils.sheet_to_json(workbook.Sheets[worksheetName], { 
              header: 1, 
              range: 0, 
              blankrows: false 
            })[0] as string[] : [];
          
          const safeUserId = user.id?.trim();
          if (!safeUserId) throw new Error("Invalid user session. Please log in again.");
          
          const employees = filteredData.map(row => {
            const employee: any = { user_id: safeUserId };
            
            headers.forEach((header, index) => {
              if (header && row[index] !== undefined) {
                if (header === 'benefits_enrolled' && row[index]) {
                  employee[header] = row[index].toString().split(',').map((s: string) => s.trim());
                } else if (header === 'cpf_contribution' || header === 'contract_signed') {
                  const value = row[index].toString().toLowerCase();
                  employee[header] = value === 'true' || value === 'yes';
                } else if (['salary', 'leave_entitlement', 'leave_balance', 'medical_entitlement', 'performance_score'].includes(header) && row[index]) {
                  employee[header] = Number(row[index]);
                } else {
                  employee[header] = row[index];
                }
              }
            });
            
            if (!employee.full_name || !employee.email) {
              throw new Error("All employees must have a full name and email");
            }
            
            return employee;
          });
          
          for (const employee of employees) {
            const { error } = await supabase.from('employees').insert(employee);
            if (error) throw error;
          }
          
          toast({
            title: "Import Successful",
            description: `Successfully imported ${employees.length} employees.`,
          });
          
          if (onImportSuccess) onImportSuccess();
        } catch (error: any) {
          console.error("Error importing employees:", error);
          toast({
            title: "Import Failed",
            description: error.message || "An error occurred while importing employees.",
            variant: "destructive",
          });
        } finally {
          setIsImporting(false);
          setFile(null);
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      console.error("Error reading file:", error);
      toast({
        title: "Import Failed",
        description: error.message || "An error occurred while reading the file.",
        variant: "destructive",
      });
      setIsImporting(false);
    }
  };
  
  return (
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
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex flex-col items-center justify-center py-4 gap-4">
            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            
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
        <DialogFooter>
          <Button variant="outline" disabled={isImporting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={importEmployees} 
            disabled={!file || isImporting}
          >
            {isImporting ? "Importing..." : "Import Employees"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
