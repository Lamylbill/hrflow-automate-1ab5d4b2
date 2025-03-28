import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { EmployeeFormData } from '@/types/employee';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema } from '@/lib/validation/employeeValidation';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { JobDetailsTab } from './tabs/JobDetailsTab';
import { CompensationTab } from './tabs/CompensationTab';
import { ComplianceTab } from './tabs/ComplianceTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { OthersTab } from './tabs/OthersTab';
import { Button } from '@/components/ui-custom/Button';

interface Props {
  initialData: EmployeeFormData;
  mode: 'view' | 'edit' | 'add';
  isViewOnly?: boolean;
  onSuccess: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

export const EmployeeTabbedForm: React.FC<Props> = ({
  initialData,
  mode,
  isViewOnly = false,
  onSuccess,
  onCancel,
}) => {
  const methods = useForm<EmployeeFormData>({
    defaultValues: initialData,
    resolver: zodResolver(employeeFormSchema),
    mode: 'onChange',
  });

  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const handleSubmit = methods.handleSubmit((data) => {
    onSuccess(data);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-6 w-full rounded-none bg-muted/40 border-b border-gray-200">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="job">Job Details</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="others">Others</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoTab
              isViewOnly={isViewOnly}
              showAdvancedFields={showAdvancedFields}
              onToggleAdvanced={setShowAdvancedFields}
            />
          </TabsContent>

          <TabsContent value="job">
            <JobDetailsTab isViewOnly={isViewOnly} />
          </TabsContent>

          <TabsContent value="compensation">
            <CompensationTab isViewOnly={isViewOnly} />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceTab isViewOnly={isViewOnly} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab isViewOnly={isViewOnly} />
          </TabsContent>

          <TabsContent value="others">
            <OthersTab isViewOnly={isViewOnly} />
          </TabsContent>
        </Tabs>

        {mode !== 'view' && (
          <div className="flex justify-end gap-3 border-t pt-6 mt-6">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {mode === 'add' ? 'Add Employee' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};
