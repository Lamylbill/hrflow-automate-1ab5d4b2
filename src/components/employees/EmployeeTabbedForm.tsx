import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Employee, EmployeeFormData } from '@/types/employee';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui-custom/Button';
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
  defaultTab = 'basic-info'
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<EmployeeFormData>({
    defaultValues: initialData || {
      employee: {
        email: '',
        full_name: '',
        user_id: user?.id || '',
      }
    }
  });

  const { handleSubmit, watch, setValue } = methods;
  const employee = watch('employee');

  useEffect(() => {
    if (user?.id) {
      setValue('employee.user_id', user.id);
    }
  }, [user, setValue]);

  const onSubmit = async (data: EmployeeFormData) => {
    const safeUserId = user?.id || data.employee.user_id;
    if (!safeUserId) {
      toast({
        title: 'User not authenticated',
        description: 'Please log in again.',
        variant: 'destructive'
      });
      return;
    }

    const payload: Employee = {
      ...data.employee,
      user_id: safeUserId,
      full_name: data.employee.full_name || `${data.employee.first_name || ''} ${data.employee.last_name || ''}`.trim(),
    };

    if (!payload.email || !payload.full_name) {
      toast({
        title: 'Validation Error',
        description: 'Full name and email are required.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      if (mode === 'create') {
        const { data: inserted, error } = await supabase
          .from('employees')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        if (inserted?.id) {
          data.employee.id = inserted.id;
        }
      } else if (mode === 'edit') {
        const { error } = await supabase
          .from('employees')
          .update(payload)
          .eq('id', payload.id)
          .eq('user_id', safeUserId);

        if (error) throw error;
      }

      toast({
        title: mode === 'create' ? 'Employee Created' : 'Employee Updated',
        description: `${payload.full_name} saved successfully.`
      });

      onSuccess(data);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Save Error',
        description: error.message || 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center space-x-4">
          <ProfilePhotoUploader
            employeeId={employee?.id}
            currentPhotoUrl={employee?.profile_picture}
            disabled={isViewOnly}
          />
          <div>
            <h2 className="text-lg font-semibold">
              {mode === 'create' ? 'New Employee' : employee?.full_name || 'Employee'}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === 'create' ? 'Fill in details to create new employee' : 'View or update employee details'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full min-w-[600px] flex-nowrap overflow-x-auto">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="job-details">Job Details</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="others">Others</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info"><BasicInfoTab isViewOnly={isViewOnly} /></TabsContent>
            <TabsContent value="job-details"><JobDetailsTab isViewOnly={isViewOnly} /></TabsContent>
            <TabsContent value="compensation"><CompensationTab isViewOnly={isViewOnly} /></TabsContent>
            <TabsContent value="compliance"><ComplianceTab isViewOnly={isViewOnly} /></TabsContent>
            <TabsContent value="documents"><DocumentsTab isViewOnly={isViewOnly} employeeId={employee?.id} /></TabsContent>
            <TabsContent value="others"><OthersTab isViewOnly={isViewOnly} /></TabsContent>
          </Tabs>
        </div>

        {!isViewOnly && (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};
