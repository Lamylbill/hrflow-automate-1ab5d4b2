import React, { useState } from 'react';
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EmployeeDetailsTabs } from './EmployeeDetailsTabs';
import { Button } from '@/components/ui-custom/Button';
import { Employee } from '@/types/employee';
import { formatPhoneNumber, formatSalary } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DocumentManager } from './documents/DocumentManager';

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

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
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
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="info">Personal Info</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{employee.full_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{employee.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{formatPhoneNumber(employee.phone_number) || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">{formatDate(employee.date_of_birth)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nationality</p>
                        <p className="font-medium">{employee.nationality || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Address</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Street Address</p>
                        <p className="font-medium">{employee.address_street || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">City</p>
                        <p className="font-medium">{employee.address_city || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">State/Province</p>
                        <p className="font-medium">{employee.address_state || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Postal Code</p>
                        <p className="font-medium">{employee.address_postal || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Country</p>
                        <p className="font-medium">{employee.address_country || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="employment">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-4">Employment Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Job Title</p>
                        <p className="font-medium">{employee.job_title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">{employee.department || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Employment Type</p>
                        <p className="font-medium">{employee.employment_type || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Employment Status</p>
                        <p className="font-medium">{employee.employment_status || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date of Hire</p>
                        <p className="font-medium">{formatDate(employee.date_of_hire)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Compensation & Benefits</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-medium">{formatSalary(employee.salary) || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CPF Contribution</p>
                        <p className="font-medium">{employee.cpf_contribution ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Leave Entitlement</p>
                        <p className="font-medium">{employee.leave_entitlement || 0} days/year</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Leave Balance</p>
                        <p className="font-medium">{employee.leave_balance || 0} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Benefits Enrolled</p>
                        <p className="font-medium">
                          {employee.benefits_enrolled && employee.benefits_enrolled.length > 0
                            ? employee.benefits_enrolled.join(', ')
                            : 'None'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
                <div className="py-2">
                  <DocumentManager employeeId={employee.id || ''} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
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
        <div className="mt-4">
          <EmployeeDetailsTabs
            employee={employee}
            onSuccess={() => {
              setViewMode('view');
              onEdit(employee);
            }}
            onCancel={() => setViewMode('view')}
          />
        </div>
      )}
    </>
  );
};
