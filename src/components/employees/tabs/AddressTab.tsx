// src/components/employees/tabs/AddressTab.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';
import { getEmployeeFieldsByCategory } from '@/utils/employeeFieldUtils';
import { renderFieldGroups } from './shared/renderFieldGroups';

interface AddressTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const AddressTab: React.FC<AddressTabProps> = ({ 
  isViewOnly = false,
  showAdvancedFields,
  onToggleAdvanced
}) => {
  const methods = useFormContext<EmployeeFormData>();
  const addressFields = getEmployeeFieldsByCategory('address');

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      <FieldsToggle 
        showAdvanced={showAdvancedFields} 
        onToggle={onToggleAdvanced} 
      />

      {renderFieldGroups(methods, addressFields, isViewOnly, showAdvancedFields)}
    </div>
  );
};
