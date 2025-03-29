
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Employee, EmployeeFormData } from '@/types/employee';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Upload, AlertCircle, UserCircle, Briefcase, DollarSign, Shield, FileText, Calendar, Grid3X3 } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui-custom/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';
import { PersonalInfoTab } from './tabs/PersonalInfoTab';
import { EmploymentInfoTab } from './tabs/EmploymentInfoTab';
import { ContractLifecycleTab } from './tabs/ContractLifecycleTab';
import { CompensationBenefitsTab } from './tabs/CompensationBenefitsTab';
import { ComplianceTab } from './tabs/ComplianceTab';
import { DocumentsTab } from './tabs/DocumentsTab';

const TAB_OPTIONS = [
  { value: 'personal-info', label: 'Personal Info', icon: UserCircle },
  { value: 'employment-info', label: 'Employment Info', icon: Briefcase },
  { value: 'contract-lifecycle', label: 'Contract & Lifecycle', icon: Calendar },
  { value: 'compensation-benefits', label: 'Compensation & Benefits', icon: DollarSign },
  { value: 'compliance', label: 'Compliance', icon: Shield },
  { value: 'documents', label: 'Documents', icon: FileText },
];

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

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-h-full overflow-hidden flex flex-col"
      >
        <div className="flex items-center mb-4">
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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {isMobile ? (
            <div className="px-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full rounded-full border border-gray-300 bg-white py-2 px-4 text-sm text-gray-900 focus:outline-none"
              >
                {TAB_OPTIONS.map((tab) => (
                  <option key={tab.value} value={tab.value}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <TabsList className="flex gap-4 px-4 py-2 bg-white border-b">
              {TAB_OPTIONS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          )}

          <div className="flex-1 overflow-auto py-6">
            <TabsContent value="personal-info" className="p-4">
              <PersonalInfoTab isViewOnly={isViewOnly} showAdvancedFields={showAdvancedFields} onToggleAdvanced={setShowAdvancedFields} />
            </TabsContent>
            
            <TabsContent value="employment-info" className="p-4">
              <EmploymentInfoTab isViewOnly={isViewOnly} showAdvancedFields={showAdvancedFields} onToggleAdvanced={setShowAdvancedFields} />
            </TabsContent>
            
            <TabsContent value="contract-lifecycle" className="p-4">
              <ContractLifecycleTab isViewOnly={isViewOnly} showAdvancedFields={showAdvancedFields} onToggleAdvanced={setShowAdvancedFields} />
            </TabsContent>
            
            <TabsContent value="compensation-benefits" className="p-4">
              <CompensationBenefitsTab isViewOnly={isViewOnly} showAdvancedFields={showAdvancedFields} onToggleAdvanced={setShowAdvancedFields} />
            </TabsContent>
            
            <TabsContent value="compliance" className="p-4">
              <ComplianceTab isViewOnly={isViewOnly} showAdvancedFields={showAdvancedFields} onToggleAdvanced={setShowAdvancedFields} />
            </TabsContent>
            
            <TabsContent value="documents" className="p-4">
              <DocumentsTab isViewOnly={isViewOnly} employeeId={employeeData?.id} onSaveRequested={!employeeData?.id ? handleSubmit(onSubmit) : undefined} />
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
            onClick={() => setActiveTab('documents')}
          >
            <Upload className={`h-${isMobile ? '6' : '4'} w-${isMobile ? '6' : '4'} ${isMobile ? '' : 'mr-2'}`} />
            {!isMobile && 'Manage Documents'}
          </Button>
        )}
      </form>
    </FormProvider>
  );
};
