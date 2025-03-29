
import React, { useState } from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui-custom/Button';
import { Employee, EmployeeFormData } from '@/types/employee';
import { Trash, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeTabbedForm } from './EmployeeTabbedForm';

interface EmployeeDetailsDialogProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: () => void;
}

export const EmployeeDetailsDialog: React.FC<EmployeeDetailsDialogProps> = ({
  employee,
  onEdit,
  onDelete
}) => {
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employee.id);

      if (error) throw error;

      toast({
        title: "Employee Deleted",
        description: `${employee.full_name} has been removed from the system.`
      });

      onDelete();
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee",
        variant: "destructive"
      });
    }
  };

  const handleEmployeeUpdate = (formData: EmployeeFormData) => {
    toast({
      title: "Changes Saved",
      description: `Employee details for ${formData.employee.full_name} have been updated.`
    });

    const updatedEmployee: Employee = {
      ...employee,
      ...formData.employee,
      id: employee.id,
      user_id: employee.user_id
    };

    setViewMode('view');
    onEdit(updatedEmployee);
  };

  const initialFormData: EmployeeFormData = {
    employee: employee
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
      <div className="px-4 py-4 border-b flex-shrink-0">
        <DialogHeader>
          <DialogTitle>
            {viewMode === 'view' ? 'Employee Details' : 'Edit Employee'}
          </DialogTitle>
          {viewMode === 'view' && (
            <DialogDescription>
              View and manage employee information
            </DialogDescription>
          )}
        </DialogHeader>
      </div>

      <div className="flex-1 overflow-auto">
        <EmployeeTabbedForm
          initialData={initialFormData}
          mode={viewMode === 'edit' ? 'edit' : 'view'}
          onSuccess={handleEmployeeUpdate}
          onCancel={() => setViewMode('view')}
          isViewOnly={viewMode === 'view'}
        />
      </div>

      {viewMode === 'view' && (
        <div className="bg-white border-t px-4 py-4 flex justify-between items-center sticky bottom-0 w-full">
          <Button
            variant="destructive"
            className="w-[160px]"
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 h-10 text-sm font-medium"
          >
            <Trash className="h-4 w-4" />
            Delete Employee
          </Button>
          <Button
            onClick={() => setViewMode('edit')
            className="w-[160px]"}
            className="flex items-center gap-2 px-6 h-10 text-sm font-medium"
          >
            <Pencil className="h-4 w-4" />
            Edit Employee
          </Button>
        </div>
      )}
    </div>
  );
};
