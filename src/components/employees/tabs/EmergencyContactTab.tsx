// src/components/employees/tabs/EmergencyContactTab.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';
import { getEmployeeFieldsByCategory } from '@/utils/employeeFieldUtils';
import { renderFieldGroups } from './shared/renderFieldGroups';

interface EmergencyContactTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const EmergencyContactTab: React.FC<EmergencyContactTabProps> = ({ 
  isViewOnly = false,
  showAdvancedFields,
  onToggleAdvanced
}) => {
  const methods = useFormContext<EmployeeFormData>();
  const emergencyContactFields = getEmployeeFieldsByCategory('emergency');

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      <FieldsToggle 
        showAdvanced={showAdvancedFields} 
        onToggle={onToggleAdvanced} 
      />

      {renderFieldGroups(methods, emergencyContactFields, isViewOnly, showAdvancedFields)}
    </div>
  );
};
