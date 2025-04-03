// src/components/employees/tabs/CompensationBenefitsTab.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';
import { getEmployeeFieldsByCategory } from '@/utils/employeeFieldUtils';
import { renderFieldGroups } from './shared/renderFieldGroups';

interface CompensationBenefitsTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const CompensationBenefitsTab: React.FC<CompensationBenefitsTabProps> = ({
  isViewOnly = false,
  showAdvancedFields,
  onToggleAdvanced,
}) => {
  const methods = useFormContext<EmployeeFormData>();
  const compensationFields = getEmployeeFieldsByCategory('compensation');

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      <FieldsToggle
        showAdvanced={showAdvancedFields}
        onToggle={onToggleAdvanced}
      />

      {renderFieldGroups(methods, compensationFields, isViewOnly, showAdvancedFields)}
    </div>
  );
};
