
import React, { useState } from 'react';
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui-custom/Button';
import { Employee, EmployeeFormData } from '@/types/employee';
import { Save, Trash } from 'lucide-react';
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
    
    // Since onEdit expects an Employee object, we need to combine the employee from formData
    const updatedEmployee: Employee = {
      ...employee, // Keep fields not modified
      ...formData.employee, // Update with new values
      id: employee.id, // Ensure ID is preserved
      user_id: employee.user_id // Ensure user_id is preserved
    };
    
    setViewMode('view');
    onEdit(updatedEmployee);
  };

  const initialFormData: EmployeeFormData = {
    employee: employee
  };

  return (
    <>
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

      {viewMode === 'view' ? (
        <>
          <div className="mt-2 max-h-[calc(90vh-12rem)] overflow-hidden">
            <EmployeeTabbedForm
              initialData={initialFormData}
              mode="view"
              onSuccess={() => {}}
              onCancel={() => {}}
              isViewOnly={true}
            />
          </div>
          
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Employee
            </Button>
            <Button 
              variant="primary" 
              onClick={() => setViewMode('edit')}
            >
              Edit Employee
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-2 max-h-[calc(90vh-6rem)] overflow-hidden">
          <EmployeeTabbedForm
            initialData={initialFormData}
            mode="edit"
            onSuccess={handleEmployeeUpdate}
            onCancel={() => setViewMode('view')}
          />
        </div>
      )}
    </>
  );
};
