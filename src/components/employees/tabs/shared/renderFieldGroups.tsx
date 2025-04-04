
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
  if (!fields || !Array.isArray(fields)) {
    console.error('❌ Invalid or missing fields array passed to renderFieldGroups:', fields);
    return null;
  }

  try {
    const basicFields = fields.filter(f => !f.isAdvanced);
    const advancedFields = fields.filter(f => f.isAdvanced);

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {basicFields.map((field, index) => (
            <React.Fragment key={`${field.name}-${index}`}>
              {renderFieldInput({ field, methods, isViewOnly })}
            </React.Fragment>
          ))}
        </div>

        {showAdvancedFields && advancedFields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
            {advancedFields.map((field, index) => (
              <React.Fragment key={`${field.name}-${index}`}>
                {renderFieldInput({ field, methods, isViewOnly })}
              </React.Fragment>
            ))}
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error('❌ Error rendering field groups:', error);
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        An error occurred while rendering form fields. Please check the console for details.
      </div>
    );
  }
};
