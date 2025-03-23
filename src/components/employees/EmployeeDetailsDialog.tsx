
import React, { useState } from 'react';
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { EmployeeDetailsTabs } from './EmployeeDetailsTabs';
import { Button } from '@/components/ui-custom/Button';
import { Employee } from '@/types/employee';
import { Save, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const handleSaveChanges = (updatedEmployee: Employee) => {
    toast({
      title: "Changes Saved",
      description: `Employee details for ${updatedEmployee.full_name} have been updated.`
    });
    setViewMode('view');
    onEdit(updatedEmployee);
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
          <div className="mt-6">
            <EmployeeDetailsTabs 
              employee={employee}
              onSuccess={(updatedEmployee) => onEdit(updatedEmployee)}
              onCancel={() => {}}
              isViewOnly={true}
            />
          </div>
          
          <div className="flex justify-between mt-8">
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
        <div className="mt-4 max-h-[calc(90vh-12rem)] overflow-y-auto">
          <EmployeeDetailsTabs
            employee={employee}
            onSuccess={handleSaveChanges}
            onCancel={() => setViewMode('view')}
            isViewOnly={false}
          />
        </div>
      )}
    </>
  );
};
