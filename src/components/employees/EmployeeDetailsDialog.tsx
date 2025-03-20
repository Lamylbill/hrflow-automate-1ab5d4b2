import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui-custom/Button';
import { Employee } from '@/types/employee';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

interface DetailsItemProps {
  label: string;
  value: React.ReactNode;
}

const DetailsItem = ({ label, value }: DetailsItemProps) => (
  <div className="space-y-1">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p>{value}</p>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div className="mb-6">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
    <Separator className="mt-6" />
  </div>
);

interface EmployeeDetailsDialogProps {
  employee: Employee;
  trigger?: React.ReactNode;
  onEdit?: (employee: Employee) => void;
  onDelete?: () => void;
}

export const EmployeeDetailsDialog = ({ 
  employee, 
  trigger,
  onEdit,
  onDelete
}: EmployeeDetailsDialogProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(employee);
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employee.id);
      
      if (error) throw error;
      
      toast({
        title: "Employee Deleted",
        description: `${employee.full_name} has been removed from the system.`,
      });
      
      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <>
      {trigger}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={employee.profile_picture || undefined} />
              <AvatarFallback className="bg-hrflow-blue text-white">
                {employee.full_name?.split(' ').map(n => n?.[0]).join('') || '?'}
              </AvatarFallback>
            </Avatar>
            <span>{employee.full_name}</span>
            <Badge className="ml-2" variant={
              employee.employment_status === 'Active' ? 'success' :
              employee.employment_status === 'On Leave' ? 'warning' :
              employee.employment_status === 'Resigned' ? 'destructive' : 'outline'
            }>
              {employee.employment_status || 'Unknown'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="personal" className="flex-1 overflow-hidden">
          <TabsList className="grid grid-cols-5 mt-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 p-4 mt-4">
            <TabsContent value="personal" className="mt-0">
              <Section title="Personal Information">
                <DetailsItem label="Full Name" value={employee.full_name || 'Not available'} />
                <DetailsItem label="Gender" value={employee.gender || 'Not available'} />
                <DetailsItem label="Date of Birth" value={formatDate(employee.date_of_birth)} />
                <DetailsItem label="Nationality" value={employee.nationality || 'Not available'} />
                <DetailsItem label="Email" value={employee.email || 'Not available'} />
                <DetailsItem label="Phone Number" value={employee.phone_number || 'Not available'} />
              </Section>
            </TabsContent>
            
            <TabsContent value="employment" className="mt-0">
              <Section title="Employment Details">
                <DetailsItem label="Job Title" value={employee.job_title || 'Not available'} />
                <DetailsItem label="Department" value={employee.department || 'Not available'} />
                <DetailsItem label="Employee Code" value={employee.employee_code || 'Not available'} />
                <DetailsItem label="Employment Type" value={employee.employment_type || 'Not available'} />
                <DetailsItem label="Employment Status" value={employee.employment_status || 'Not available'} />
                <DetailsItem label="Date of Hire" value={formatDate(employee.date_of_hire)} />
                <DetailsItem label="Date of Exit" value={formatDate(employee.date_of_exit)} />
                <DetailsItem label="Reporting Manager" value={employee.reporting_manager || 'Not available'} />
                <DetailsItem label="Probation Status" value={employee.probation_status || 'Not available'} />
              </Section>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-0">
              <Section title="Contact Information">
                <DetailsItem label="Email" value={employee.email || 'Not available'} />
                <DetailsItem label="Phone Number" value={employee.phone_number || 'Not available'} />
                <DetailsItem label="Home Address" value={employee.home_address || 'Not available'} />
                <DetailsItem label="Postal Code" value={employee.postal_code || 'Not available'} />
                <DetailsItem label="Emergency Contact" value={employee.emergency_contact_name || 'Not available'} />
                <DetailsItem 
                  label="Emergency Contact Phone" 
                  value={employee.emergency_contact_phone || 'Not available'} 
                />
              </Section>
            </TabsContent>

            <TabsContent value="financial" className="mt-0">
              <Section title="Payroll & Financial Information">
                <DetailsItem 
                  label="Salary" 
                  value={employee.salary ? `$${employee.salary.toLocaleString()}` : 'Not available'} 
                />
                <DetailsItem label="Bank Name" value={employee.bank_name || 'Not available'} />
                <DetailsItem 
                  label="Bank Account Number" 
                  value={employee.bank_account_number || 'Not available'} 
                />
                <DetailsItem 
                  label="CPF Contribution" 
                  value={employee.cpf_contribution !== undefined ? 
                    (employee.cpf_contribution ? 'Yes' : 'No') : 'Not available'} 
                />
                <DetailsItem 
                  label="CPF Account Number" 
                  value={employee.cpf_account_number || 'Not available'} 
                />
                <DetailsItem 
                  label="Tax Identification Number" 
                  value={employee.tax_identification_number || 'Not available'} 
                />
                <DetailsItem 
                  label="Leave Entitlement" 
                  value={employee.leave_entitlement !== undefined ? 
                    `${employee.leave_entitlement} days` : 'Not available'} 
                />
                <DetailsItem 
                  label="Leave Balance" 
                  value={employee.leave_balance !== undefined ? 
                    `${employee.leave_balance} days` : 'Not available'} 
                />
                <DetailsItem 
                  label="Medical Entitlement" 
                  value={employee.medical_entitlement !== undefined ? 
                    `${employee.medical_entitlement} days` : 'Not available'} 
                />
                <DetailsItem 
                  label="Benefits Enrolled" 
                  value={employee.benefits_enrolled?.length ? 
                    employee.benefits_enrolled.join(', ') : 'None'} 
                />
              </Section>
            </TabsContent>

            <TabsContent value="compliance" className="mt-0">
              <Section title="Compliance & HR">
                <DetailsItem 
                  label="Work Permit Number" 
                  value={employee.work_permit_number || 'Not available'} 
                />
                <DetailsItem 
                  label="Work Pass Expiry Date" 
                  value={formatDate(employee.work_pass_expiry_date)} 
                />
                <DetailsItem 
                  label="Contract Signed" 
                  value={employee.contract_signed !== undefined ? 
                    (employee.contract_signed ? 'Yes' : 'No') : 'Not available'} 
                />
                <DetailsItem
                  label="Last Performance Review"
                  value={formatDate(employee.last_performance_review)}
                />
                <DetailsItem
                  label="Performance Score"
                  value={employee.performance_score !== undefined ?
                    employee.performance_score : 'Not available'}
                />
                <DetailsItem
                  label="Notes"
                  value={employee.notes || 'Not available'}
                />
              </Section>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this employee?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove {employee.full_name} from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                      I'm sure
                    </AlertDialogAction>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>This action is irreversible</AlertDialogTitle>
                      <AlertDialogDescription>
                        All employee data will be permanently deleted. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete Permanently"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </>
  );
};

