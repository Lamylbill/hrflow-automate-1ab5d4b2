
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui-custom/Button";
import { useForm, FormProvider } from "react-hook-form";
import { Upload, Save } from 'lucide-react';
import { EmployeeFormData, Employee } from '@/types/employee';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Import the new restructured tabs
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { JobDetailsTab } from './tabs/JobDetailsTab';
import { CompensationTab } from './tabs/CompensationTab';
import { ComplianceTab } from './tabs/ComplianceTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { OthersTab } from './tabs/OthersTab';

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
  defaultTab = "basic-info"
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Form setup
  const methods = useForm<EmployeeFormData>({
    defaultValues: initialData || {
      employee: {
        id: '',
        user_id: user?.id || '',
        email: '',
        full_name: '',
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
      }
      
      toast({
        title: mode === 'create' ? 'Employee Created' : 'Employee Updated',
        description: `${data.employee.full_name || data.employee.first_name + ' ' + data.employee.last_name} has been ${mode === 'create' ? 'added to' : 'updated in'} the system.`,
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
  
  // Toggle to show more fields
  const toggleAdvancedFields = (value: boolean) => {
    setShowAdvancedFields(value);
  };
  
  // Document upload button that appears on all tabs except the documents tab
  const DocumentUploadButton = () => (
    <Button
      variant="outline"
      className="fixed bottom-20 right-4 z-20 flex items-center gap-2 shadow-md"
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
          <div className="border-b overflow-x-auto pb-1 -mx-2 px-2">
            <TabsList className="w-full flex justify-start h-auto flex-nowrap min-w-max py-1">
              <TabsTrigger value="basic-info" className="px-3 py-1.5 text-sm whitespace-nowrap">Basic Info</TabsTrigger>
              <TabsTrigger value="job-details" className="px-3 py-1.5 text-sm whitespace-nowrap">Job Details</TabsTrigger>
              <TabsTrigger value="compensation" className="px-3 py-1.5 text-sm whitespace-nowrap">Compensation</TabsTrigger>
              <TabsTrigger value="compliance" className="px-3 py-1.5 text-sm whitespace-nowrap">Compliance</TabsTrigger>
              <TabsTrigger value="documents" className="px-3 py-1.5 text-sm whitespace-nowrap">Documents</TabsTrigger>
              <TabsTrigger value="others" className="px-3 py-1.5 text-sm whitespace-nowrap">Others</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-auto py-6">
            <TabsContent value="basic-info" className="p-4">
              <BasicInfoTab 
                isViewOnly={isViewOnly} 
                showAdvancedFields={showAdvancedFields}
                onToggleAdvanced={toggleAdvancedFields}
              />
            </TabsContent>
            
            <TabsContent value="job-details" className="p-4">
              <JobDetailsTab 
                isViewOnly={isViewOnly} 
                showAdvancedFields={showAdvancedFields}
                onToggleAdvanced={toggleAdvancedFields}
              />
            </TabsContent>
            
            <TabsContent value="compensation" className="p-4">
              <CompensationTab 
                isViewOnly={isViewOnly} 
                showAdvancedFields={showAdvancedFields}
                onToggleAdvanced={toggleAdvancedFields}
              />
            </TabsContent>
            
            <TabsContent value="compliance" className="p-4">
              <ComplianceTab 
                isViewOnly={isViewOnly} 
                showAdvancedFields={showAdvancedFields}
                onToggleAdvanced={toggleAdvancedFields}
              />
            </TabsContent>
            
            <TabsContent value="documents" className="p-4">
              <DocumentsTab 
                isViewOnly={isViewOnly} 
                employeeId={employeeData?.id} 
                onSaveRequested={!employeeData?.id ? handleSubmit(onSubmit) : undefined}
              />
            </TabsContent>
            
            <TabsContent value="others" className="p-4">
              <OthersTab 
                isViewOnly={isViewOnly} 
                showAdvancedFields={showAdvancedFields}
                onToggleAdvanced={toggleAdvancedFields}
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
