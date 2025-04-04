
// src/components/employees/tabs/shared/renderFieldGroups.tsx
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { renderFieldInput } from '@/components/employees/tabs/shared/renderFieldInput';
import { EmployeeFormData } from '@/types/employee';
import { FieldMeta } from '@/utils/employeeFieldUtils';

export const renderFieldGroups = (
  methods: UseFormReturn<EmployeeFormData>,
  fields: FieldMeta[],
  isViewOnly: boolean,
  showAdvancedFields: boolean
) => {
  console.log('🔍 Raw fields passed to renderFieldGroups:', fields);

  const basicFields = fields.filter(f => !f.isAdvanced);
  const advancedFields = fields.filter(f => f.isAdvanced);

  console.log('📌 Basic Fields:', basicFields);
  console.log('📌 Advanced Fields:', advancedFields);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {basicFields.map((field) =>
          renderFieldInput({ field, methods, isViewOnly })
        )}
      </div>

      {showAdvancedFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
          {advancedFields.map((field) =>
            renderFieldInput({ field, methods, isViewOnly })
          )}
        </div>
      )}
    </>
  );
};
