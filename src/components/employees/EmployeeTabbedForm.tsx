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

  useEffect(() => {
    const checkUserStatus = async () => {
      setAuthError(null);
      if (user?.id) {
        methods.setValue('employee.user_id', user.id);
        setIsUserLoaded(true);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setAuthError("Failed to retrieve user session.");
          return;
        }

        if (session?.user?.id) {
          methods.setValue('employee.user_id', session.user.id);
          setIsUserLoaded(true);
        } else {
          setAuthError("You must be logged in.");
        }
      } catch {
        setAuthError("Authentication error.");
      }
    };

    checkUserStatus();
  }, [user, methods]);

  const { handleSubmit, watch } = methods;
  const employeeData = watch('employee');

  const onSubmit = async (data: EmployeeFormData) => {
    const userId = data.employee.user_id?.trim() || user?.id;

  const onSubmit = async (data: EmployeeFormData) => {
    const userId = data.employee.user_id?.trim() || user?.id;

  if (!userId) {
    toast({
      title: 'Authentication Error',
      description: 'You must be logged in to create or update an employee.',
      variant: 'destructive',
    });
    return;
  }

  // Destructure and exclude nationality_other from DB insert
  const {
    nationality_other,
    ...rest
  } = data.employee;

  const employeeDataForDb: Employee = {
    ...rest,
    user_id: userId,
    email: rest.email || '',
    full_name: rest.full_name || `${rest.first_name || ''} ${rest.last_name || ''}`.trim(),
  };

  // Replace nationality with custom input if "Other"
  if (
    employeeDataForDb.nationality === 'Other' &&
    nationality_other?.trim()
  ) {
    employeeDataForDb.nationality = nationality_other.trim();
  }

  if (!employeeDataForDb.email || !employeeDataForDb.full_name) {
    toast({
      title: 'Validation Error',
      description: 'Email and Full Name are required.',
      variant: 'destructive',
    });
    return;
  }
    try {
      setIsSubmitting(true);

      if (mode === 'edit' && employeeDataForDb.id) {
        const { error } = await supabase
          .from('employees')
          .update(employeeDataForDb)
          .eq('id', employeeDataForDb.id)
          .eq('user_id', userId);

        if (error) throw error;
      } else if (mode === 'create') {
        const { data: newEmployee, error } = await supabase
          .from('employees')
          .insert({
            ...employeeDataForDb,
            user_id: userId,
          })
          .select()
          .single();

        if (error) throw error;
        if (newEmployee) {
          data.employee.id = newEmployee.id;
        }
      }

      toast({
        title: mode === 'create' ? 'Employee Created' : 'Employee Updated',
        description: `${employeeDataForDb.full_name} has been saved.`,
      });

      onSuccess(data);
      if (mode === 'create') setTimeout(() => setActiveTab("documents"), 500);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error saving employee.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => setActiveTab(value);
  const toggleAdvancedFields = (value: boolean) => setShowAdvancedFields(value);

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
            <p className="text-sm text-gray-500">
              {isViewOnly
                ? 'Viewing employee details'
                : mode === 'create'
                ? 'Add a new employee'
                : 'Update employee information'}
            </p>
          </div>
        </div>

        {authError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto border-b -mx-2 px-2">
            <TabsList className="flex flex-nowrap gap-1 min-w-max">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="job-details">Job Details</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="others">Others</TabsTrigger>
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
            <Button type="submit" disabled={isSubmitting || !isUserLoaded || !!authError}>
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Employee' : 'Save Changes'}
            </Button>
          </div>
        )}

        {!isViewOnly && employeeData?.id && activeTab !== 'documents' && (
          <Button
            variant="primary"
            className={`fixed bottom-20 right-4 z-20 ${isMobile ? 'rounded-full w-14 h-14 p-0' : ''}`}
            onClick={() => setActiveTab("documents")}
          >
            <Upload className={`h-${isMobile ? '6' : '4'} w-${isMobile ? '6' : '4'} ${isMobile ? '' : 'mr-2'}`} />
            {!isMobile && "Manage Documents"}
          </Button>
        )}
      </form>
    </FormProvider>
  );
};
