import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Employee, EmployeeFormData } from '@/types/employee';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui-custom/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';
import { PersonalInfoTab } from './tabs/PersonalInfoTab';
import { EmploymentInfoTab } from './tabs/EmploymentInfoTab';
import { ContractLifecycleTab } from './tabs/ContractLifecycleTab';
import { CompensationBenefitsTab } from './tabs/CompensationBenefitsTab';
import { ComplianceTab } from './tabs/ComplianceTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { TabNav } from './tabs/TabNav';

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
  defaultTab = 'personal-info',
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const methods = useForm<EmployeeFormData>({
    defaultValues: initialData || {
      employee: {
        id: '',
        user_id: '',
        email: '',
        full_name: '',
      },
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const employeeData = watch('employee');

  useEffect(() => {
    const checkUser = async () => {
      setAuthError(null);
      if (user?.id) {
        setValue('employee.user_id', user.id);
        setIsUserLoaded(true);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setAuthError('Unable to verify session. Please log in again.');
          return;
        }
        if (session?.user?.id) {
          setValue('employee.user_id', session.user.id);
          setIsUserLoaded(true);
        } else {
          setAuthError('No user session found. Please log in.');
        }
      } catch {
        setAuthError('Authentication error. Please try again.');
      }
    };

    checkUser();
  }, [user, setValue]);

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

    const { nationality_other, ...rest } = data.employee;
    if (rest.nationality === 'Other' && nationality_other?.trim()) {
      rest.nationality = nationality_other.trim();
    }

    const cleanupData = (obj: any) => {
      const cleanedObj = { ...obj };
      Object.keys(cleanedObj).forEach(key => {
        if (typeof cleanedObj[key] === 'string' && cleanedObj[key] === '' &&
            (key.endsWith('_id') || key === 'id' || key === 'related_id')) {
          cleanedObj[key] = null;
        } else if (cleanedObj[key] && typeof cleanedObj[key] === 'object' && !Array.isArray(cleanedObj[key])) {
          cleanedObj[key] = cleanupData(cleanedObj[key]);
        }
      });
      return cleanedObj;
    };

    const cleanedRest = cleanupData(rest);

    const employeeDataForDb: Employee = {
      ...cleanedRest,
      user_id: userId,
      email: cleanedRest.email || '',
      full_name:
        cleanedRest.full_name ||
        `${cleanedRest.first_name || ''} ${cleanedRest.last_name || ''}`.trim(),
    };

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
        const { id, ...createData } = employeeDataForDb;

        const { data: newEmployee, error } = await supabase
          .from('employees')
          .insert({
            ...createData,
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
      if (mode === 'create') {
        setTimeout(() => setActiveTab('documents'), 500);
      }
    } catch (error: any) {
      console.error('Error saving employee:', error);
      toast({
        title: 'Save Error',
        description: error.message || 'An error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal-info':
        return (
          <PersonalInfoTab 
            isViewOnly={isViewOnly} 
            showAdvancedFields={showAdvancedFields} 
            onToggleAdvanced={setShowAdvancedFields} 
          />
        );
      case 'employment-info':
        return (
          <EmploymentInfoTab 
            isViewOnly={isViewOnly} 
            showAdvancedFields={showAdvancedFields} 
            onToggleAdvanced={setShowAdvancedFields} 
          />
        );
      case 'contract-lifecycle':
        return (
          <ContractLifecycleTab 
            isViewOnly={isViewOnly} 
            showAdvancedFields={showAdvancedFields} 
            onToggleAdvanced={setShowAdvancedFields} 
          />
        );
      case 'compensation-benefits':
        return (
          <CompensationBenefitsTab 
            isViewOnly={isViewOnly} 
            showAdvancedFields={showAdvancedFields} 
            onToggleAdvanced={setShowAdvancedFields} 
          />
        );
      case 'compliance':
        return (
          <ComplianceTab 
            isViewOnly={isViewOnly} 
            showAdvancedFields={showAdvancedFields} 
            onToggleAdvanced={setShowAdvancedFields} 
          />
        );
      case 'documents':
        return (
          <DocumentsTab 
            isViewOnly={isViewOnly} 
            employeeId={employeeData?.id} 
            onSaveRequested={!employeeData?.id ? handleSubmit(onSubmit) : undefined} 
          />
        );
      default:
        return <div>Select a tab to view employee information</div>;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        id="employee-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-h-full overflow-hidden flex flex-col"
      >
        <div className="p-4 flex items-center border-b">
          <ProfilePhotoUploader
            employeeId={employeeData?.id}
            currentPhotoUrl={employeeData?.profile_picture}
            disabled={isViewOnly}
          />
          <div className="ml-4">
            <h2 className="text-lg font-medium">
              {mode === 'create'
                ? 'New Employee'
                : employeeData?.full_name || 'Employee Details'}
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
          <Alert variant="destructive" className="mx-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <TabNav 
            activeTab={activeTab}
            onChange={setActiveTab}
            className="px-4 sm:px-6 md:px-8"
          />

          <div className="flex-1 overflow-auto">
            {renderTabContent()}
          </div>
        </div>

        {!isViewOnly && (
          <div className="px-4 py-4 border-t bg-white flex justify-end gap-2">
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
      </form>
    </FormProvider>
  );
};
