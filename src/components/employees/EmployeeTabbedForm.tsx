
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui-custom/Button";
import { useForm, FormProvider } from "react-hook-form";
import { PersonalInfoTab } from './tabs/PersonalInfoTab';
import { EmploymentTab } from './tabs/EmploymentTab';
import { AssignmentTab } from './tabs/AssignmentTab';
import { ContractTab } from './tabs/ContractTab';
import { StatutoryTab } from './tabs/StatutoryTab';
import { SalaryTab } from './tabs/SalaryTab';
import { AllowanceTab } from './tabs/AllowanceTab';
import { AttendanceTab } from './tabs/AttendanceTab';
import { AddressTab } from './tabs/AddressTab';
import { FamilyTab } from './tabs/FamilyTab';
import { EmergencyContactTab } from './tabs/EmergencyContactTab';
import { EducationTab } from './tabs/EducationTab';
import { WorkExperienceTab } from './tabs/WorkExperienceTab';
import { OtherInfoTab } from './tabs/OtherInfoTab';
import { AppraisalRatingTab } from './tabs/AppraisalRatingTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { Upload } from 'lucide-react';
import { EmployeeFormData, Employee } from '@/types/employee';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface EmployeeTabbedFormProps {
  initialData?: Partial<EmployeeFormData>;
  onSuccess: (data: EmployeeFormData) => void;
  onCancel: () => void;
  isViewOnly?: boolean;
  mode: 'create' | 'edit' | 'view';
  defaultTab?: string;
}

export const EmployeeTabbedForm: React.FC<EmployeeTabbedFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isViewOnly = false,
  mode,
  defaultTab = "personal"
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Form setup with updated type handling
  const methods = useForm<EmployeeFormData>({
    defaultValues: initialData || {
      employee: {
        id: '',
        user_id: user?.id || '',
        full_name: '',
        email: '',
        // All other fields with default values
      }
    }
  });
  
  const { handleSubmit, formState: { errors }, watch } = methods;
  const employeeData = watch('employee');
  
  const onSubmit = async (data: EmployeeFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create or update an employee.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // If editing, update the employee
      if (mode === 'edit' && data.employee.id) {
        const { error } = await supabase
          .from('employees')
          .update(data.employee)
          .eq('id', data.employee.id);
          
        if (error) throw error;
        
        // Update related records (this would need to be expanded for all related tables)
        // This is a simplified example - in a real application, you would handle all related tables
      }
      // If creating, insert the new employee
      else if (mode === 'create') {
        const { data: employeeData, error } = await supabase
          .from('employees')
          .insert({
            ...data.employee,
            user_id: user.id
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Set the ID so it's available for document uploads
        if (employeeData) {
          data.employee.id = employeeData.id;
        }
        
        // Insert related records (simplified)
        // This is where you would handle inserting data into all related tables
      }
      
      toast({
        title: mode === 'create' ? 'Employee Created' : 'Employee Updated',
        description: `${data.employee.full_name} has been ${mode === 'create' ? 'added to' : 'updated in'} the system.`,
      });
      
      // Call the success callback with the form data
      onSuccess(data);
      
      // If we just created the employee, switch to the documents tab to encourage document upload
      if (mode === 'create') {
        setTimeout(() => setActiveTab("documents"), 500);
      }
    } catch (error: any) {
      console.error('Error saving employee:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while saving the employee.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle tab navigation
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Document upload button that appears on all tabs except the documents tab
  const DocumentUploadButton = () => (
    <Button
      variant="outline"
      className="fixed bottom-4 right-4 z-20 flex items-center gap-2 shadow-md"
      onClick={() => setActiveTab("documents")}
    >
      <Upload className="h-4 w-4" />
      Upload Documents
    </Button>
  );
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-full overflow-hidden flex flex-col">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b overflow-x-auto">
            <TabsList className="w-full flex justify-start px-2 h-auto flex-nowrap min-w-max py-1">
              <TabsTrigger value="personal" className="whitespace-nowrap">Personal</TabsTrigger>
              <TabsTrigger value="employment" className="whitespace-nowrap">Employment</TabsTrigger>
              <TabsTrigger value="assignment" className="whitespace-nowrap">Assignment</TabsTrigger>
              <TabsTrigger value="contract" className="whitespace-nowrap">Contract</TabsTrigger>
              <TabsTrigger value="statutory" className="whitespace-nowrap">Statutory</TabsTrigger>
              <TabsTrigger value="salary" className="whitespace-nowrap">Salary</TabsTrigger>
              <TabsTrigger value="allowance" className="whitespace-nowrap">Allowance</TabsTrigger>
              <TabsTrigger value="attendance" className="whitespace-nowrap">Attendance</TabsTrigger>
              <TabsTrigger value="address" className="whitespace-nowrap">Address</TabsTrigger>
              <TabsTrigger value="family" className="whitespace-nowrap">Family</TabsTrigger>
              <TabsTrigger value="emergency" className="whitespace-nowrap">Emergency</TabsTrigger>
              <TabsTrigger value="education" className="whitespace-nowrap">Education</TabsTrigger>
              <TabsTrigger value="workExperience" className="whitespace-nowrap">Work Experience</TabsTrigger>
              <TabsTrigger value="other" className="whitespace-nowrap">Other</TabsTrigger>
              <TabsTrigger value="appraisal" className="whitespace-nowrap">Appraisal Rating</TabsTrigger>
              <TabsTrigger value="documents" className="whitespace-nowrap">Documents</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-auto py-6">
            <TabsContent value="personal" className="p-4">
              <PersonalInfoTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="employment" className="p-4">
              <EmploymentTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="assignment" className="p-4">
              <AssignmentTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="contract" className="p-4">
              <ContractTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="statutory" className="p-4">
              <StatutoryTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="salary" className="p-4">
              <SalaryTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="allowance" className="p-4">
              <AllowanceTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="attendance" className="p-4">
              <AttendanceTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="address" className="p-4">
              <AddressTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="family" className="p-4">
              <FamilyTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="emergency" className="p-4">
              <EmergencyContactTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="education" className="p-4">
              <EducationTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="workExperience" className="p-4">
              <WorkExperienceTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="other" className="p-4">
              <OtherInfoTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="appraisal" className="p-4">
              <AppraisalRatingTab isViewOnly={isViewOnly} />
            </TabsContent>
            
            <TabsContent value="documents" className="p-4">
              <DocumentsTab 
                isViewOnly={isViewOnly} 
                employeeId={employeeData?.id} 
                onSaveRequested={!employeeData?.id ? handleSubmit(onSubmit) : undefined}
              />
            </TabsContent>
          </div>
        </Tabs>

        {!isViewOnly && (
          <div className="flex justify-end gap-2 border-t pt-4 bg-white sticky bottom-0 z-30 px-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Employee' : 'Save Changes'}
            </Button>
          </div>
        )}
        
        {activeTab !== "documents" && employeeData?.id && !isViewOnly && !isMobile && (
          <DocumentUploadButton />
        )}
        
        {activeTab !== "documents" && employeeData?.id && !isViewOnly && isMobile && (
          <Button
            variant="primary"
            className="fixed bottom-20 right-4 z-20 rounded-full w-14 h-14 p-0 shadow-lg flex items-center justify-center"
            onClick={() => setActiveTab("documents")}
          >
            <Upload className="h-6 w-6" />
          </Button>
        )}
      </form>
    </FormProvider>
  );
};
