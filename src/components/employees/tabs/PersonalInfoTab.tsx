// src/components/employees/tabs/PersonalInfoTab.tsx

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { employeeFieldsByCategory } from '@/utils/employeeFieldUtils';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui-custom/DatePicker';

interface PersonalInfoTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (show: boolean) => void;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  isViewOnly,
  showAdvancedFields,
  onToggleAdvanced,
}) => {
  const { control } = useFormContext();
  const fields = employeeFieldsByCategory['personalInfo'];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show Advanced</span>
          <Switch checked={showAdvancedFields} onCheckedChange={onToggleAdvanced} />
        </div>
      </div>

      {[...fields.basic, ...(showAdvancedFields ? fields.advanced : [])].map((field) => (
        <FormField
          key={field.name}
          control={control}
          name={`employee.${field.name}`}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                {field.type === 'date' ? (
                  <DatePicker disabled={isViewOnly} {...fieldProps} />
                ) : (
                  <Input disabled={isViewOnly} type={field.type} placeholder={field.placeholder || ''} {...fieldProps} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};
