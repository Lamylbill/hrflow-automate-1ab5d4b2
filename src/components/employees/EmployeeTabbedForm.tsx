
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui-custom/Button";
import { useForm, FormProvider } from "react-hook-form";
import { Upload, Save, AlertCircle } from 'lucide-react';
import { EmployeeFormData, Employee } from '@/types/employee';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import the new restructured tabs
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { JobDetailsTab } from './tabs/JobDetailsTab';
import { CompensationTab } from './tabs/CompensationTab';
import { ComplianceTab } from './tabs/ComplianceTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { OthersTab } from './tabs/OthersTab';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';

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
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Form setup with validation for required user_id
  const methods = useForm<EmployeeFormData>({
    defaultValues: initialData || {
      employee: {
        id: '',
        user_id: '',
        email: '',
        full_name: '',
      }
    }
  });
  
  // Check if user is loaded and set the user_id
  useEffect(() => {
    const checkUserStatus = async () => {
      setAuthError(null);
      
      // If user is available from context, use it
      if (user?.id) {
        console.log("User found in context:", user.id);
        methods.setValue('employee.user_id', user.id);
        setIsUserLoaded(true);
        return;
      }
      
      // If not available, try to get session from Supabase
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setAuthError("Failed to retrieve your user session. Please log in again.");
          return;
        }
        
        if (session?.user?.id) {
          console.log("User found in session:", session.user.id);
          methods.setValue('employee.user_id', session.user.id);
          setIsUserLoaded(true);
        } else {
          console.error("No user found in session");
          setAuthError("You must be logged in to create or update an employee. Please log in.");
        }
      } catch (err) {
        console.error("Unexpected error checking auth:", err);
        setAuthError("Authentication error. Please log in again to continue.");
      }
    };
    
    checkUserStatus();
  }, [user, methods]);
  
  const { handleSubmit, formState: { errors }, watch } = methods;
  const employeeData = watch('employee');
  
  const onSubmit = async (data: EmployeeFormData) => {
    // Ensure user_id is set
    const userId = data.employee.user_id || user?.id;
    
    if (!userId) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create or update an employee.',
        variant: 'destructive',
      });
      setAuthError("You must be logged in to create or update an employee. Please log in.");
      return;
    }

    // Ensure user_id is set and valid
    if (!userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      toast({
        title: 'Invalid User ID',
        description: 'Your session appears to be invalid. Please log out and log in again.',
        variant: 'destructive',
      });
      setAuthError("Invalid user ID format. Please log out and log in again.");
      return;
    }

    // Set the user_id again just to be sure
    data.employee.user_id = userId;
    
    // Validate required fields
    if (!data.employee.email || !data.employee.full_name) {
      toast({
        title: 'Missing Required Fields',
        description: 'Email and full name are required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting employee with user_id:", data.employee.user_id);
      
      // If editing, update the employee
      if (mode === 'edit' && data.employee.id) {
        const { error } = await supabase
          .from('employees')
          .update(data.employee)
          .eq('id', data.employee.id)
          .eq('user_id', userId);
          
        if (error) throw error;
      }
      // If creating, insert the new employee
      else if (mode === 'create') {
        // Set required fields to null if they are empty strings
        // This prevents "invalid input syntax for type uuid" errors
        const employeeData = Object.keys(data.employee).reduce((acc, key) => {
          const value = data.employee[key as keyof typeof data.employee];
          // For UUID fields, convert empty strings to null
          const isEmptyUUID = typeof value === 'string' && value === '' && key.includes('_id') && key !== 'user_id';
          acc[key as keyof typeof data.employee] = isEmptyUUID ? null : value;
          return acc;
        }, {} as Record<string, any>);
        
        // Make sure required fields are included
        const employeeInsertData = {
          ...employeeData,
          email: data.employee.email,
          full_name: data.employee.full_name,
          user_id: userId
        };
        
        const { data: newEmployee, error } = await supabase
          .from('employees')
          .insert(employeeInsertData)
          .select()
          .single();
          
        if (error) throw error;
        
        // Set the ID so it's available for document uploads
        if (newEmployee) {
          data.employee.id = newEmployee.id;
        }
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
        <div className="flex items-center mb-4">
          <ProfilePhotoUploader 
            employeeId={employeeData?.id} 
            currentPhotoUrl={employeeData?.profile_picture}
            disabled={isViewOnly} 
          />
          <div className="ml-4">
            <h2 className="text-lg font-medium">
              {mode === 'create' ? 'New Employee' : employeeData?.full_name || 'Employee Details'}
            </h2>
            {mode !== 'create' && !isViewOnly && (
              <p className="text-sm text-gray-500">
                Update employee information
              </p>
            )}
            {mode === 'create' && (
              <p className="text-sm text-gray-500">
                Add a new employee to your organization
              </p>
            )}
            {isViewOnly && (
              <p className="text-sm text-gray-500">
                Viewing employee details
              </p>
            )}
          </div>
        </div>
        
        {authError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b overflow-x-auto pb-1 -mx-1 px-1">
            <TabsList className="flex justify-between h-auto w-full">
              <TabsTrigger value="basic-info" className="px-2 text-sm flex-1">Basic Info</TabsTrigger>
              <TabsTrigger value="job-details" className="px-2 text-sm flex-1">Job Details</TabsTrigger>
              <TabsTrigger value="compensation" className="px-2 text-sm flex-1">Compensation</TabsTrigger>
              <TabsTrigger value="compliance" className="px-2 text-sm flex-1">Compliance</TabsTrigger>
              <TabsTrigger value="documents" className="px-2 text-sm flex-1">Documents</TabsTrigger>
              <TabsTrigger value="others" className="px-2 text-sm flex-1">Others</TabsTrigger>
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
            <Button 
              type="submit" 
              disabled={isSubmitting || !isUserLoaded || !!authError}
            >
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
