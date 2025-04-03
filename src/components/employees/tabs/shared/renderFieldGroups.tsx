// src/components/employees/tabs/shared/renderFieldGroups.tsx
import React from 'react';
import { Control, FieldValues, UseFormReturn } from 'react-hook-form';
import { renderFieldInput } from '@/components/employees/tabs/shared/renderFieldInput';
import { EmployeeFieldDefinition } from '@/types/employee';

export const renderFieldGroups = (
  methods: UseFormReturn<FieldValues>,
  fields: EmployeeFieldDefinition[],
  isViewOnly: boolean,
  showAdvancedFields: boolean
) => {
  const basicFields = fields.filter(f => f.level === 'basic');
  const advancedFields = fields.filter(f => f.level === 'advanced');

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {basicFields.map((field) =>
          renderFieldInput(methods.control as Control, field, isViewOnly)
        )}
      </div>

      {showAdvancedFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
          {advancedFields.map((field) =>
            renderFieldInput(methods.control as Control, field, isViewOnly)
          )}
        </div>
      )}
    </>
  );
};
