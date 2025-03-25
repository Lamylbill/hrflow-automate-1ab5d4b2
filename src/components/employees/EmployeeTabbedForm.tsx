
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

interface EmployeeTabbedFormProps {
  initialData?: Partial<EmployeeFormData>;
  onSuccess: (data: EmployeeFormData) => void;
  onCancel: () => void;
  isViewOnly?: boolean;
  mode: 'create' | 'edit' | 'view';
}

export const EmployeeTabbedForm: React.FC<EmployeeTabbedFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isViewOnly = false,
  mode
}) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Form setup
  const methods = useForm<EmployeeFormData>({
    defaultValues: initialData || {
      employee: {
        full_name: '',
        email: '',
        // All other fields with default values
      }
    }
  });
  
  const { handleSubmit, formState: { errors } } = methods;
  
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
      if (mode === 'edit' && initialData?.employee?.id) {
        const { error } = await supabase
          .from('employees')
          .update(data.employee)
          .eq('id', initialData.employee.id);
          
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
        
        // Insert related records (simplified)
        // This is where you would handle inserting data into all related tables
      }
      
      toast({
        title: mode === 'create' ? 'Employee Created' : 'Employee Updated',
        description: `${data.employee.full_name} has been ${mode === 'create' ? 'added to' : 'updated in'} the system.`,
      });
      
      // Call the success callback with the form data
      onSuccess(data);
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
  
  // Document upload button that appears on all tabs
  const DocumentUploadButton = () => (
    <Button
      variant="outline"
      className="fixed bottom-4 right-4 z-10 flex items-center gap-2 shadow-md"
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
          <div className="border-b">
            <TabsList className="overflow-x-auto w-full flex justify-start">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="assignment">Assignment</TabsTrigger>
              <TabsTrigger value="contract">Contract</TabsTrigger>
              <TabsTrigger value="statutory">Statutory</TabsTrigger>
              <TabsTrigger value="salary">Salary</TabsTrigger>
              <TabsTrigger value="allowance">Allowance</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="workExperience">Work Experience</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
              <TabsTrigger value="appraisal">Appraisal Rating</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
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
              <DocumentsTab isViewOnly={isViewOnly} employeeId={initialData?.employee?.id} />
            </TabsContent>
          </div>
        </Tabs>

        {!isViewOnly && (
          <div className="flex justify-end gap-2 border-t pt-4 bg-white sticky bottom-0">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Employee' : 'Save Changes'}
            </Button>
          </div>
        )}
        
        {activeTab !== "documents" && <DocumentUploadButton />}
      </form>
    </FormProvider>
  );
};
