// src/components/employees/tabs/ContractLifecycleTab.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';
import { getEmployeeFieldsByCategory } from '@/utils/employeeFieldUtils';
import { renderFieldGroups } from './shared/renderFieldGroups';

interface ContractLifecycleTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const ContractLifecycleTab: React.FC<ContractLifecycleTabProps> = ({
  isViewOnly = false,
  showAdvancedFields,
  onToggleAdvanced
}) => {
  const methods = useFormContext<EmployeeFormData>();
  const fields = getEmployeeFieldsByCategory('contract');
  const basicFields = fields.filter(f => f.level === 'basic');
  const advancedFields = fields.filter(f => f.level === 'advanced');

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      <FieldsToggle 
        showAdvanced={showAdvancedFields} 
        onToggle={onToggleAdvanced} 
      />

      {renderFieldGroups(basicFields, methods, isViewOnly)}

      {showAdvancedFields && (
        <div className="pt-6 border-t border-gray-200">
          {renderFieldGroups(advancedFields, methods, isViewOnly)}
        </div>
      )}
    </div>
  );
};
