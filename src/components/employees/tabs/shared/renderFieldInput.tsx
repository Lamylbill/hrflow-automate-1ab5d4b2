
// src/components/employees/tabs/shared/renderFieldInput.tsx
import React from 'react';
import { Controller, UseFormReturn, FieldPath } from 'react-hook-form';
import { EmployeeFormData } from '@/types/employee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { FieldMeta } from '@/utils/employeeFieldUtils';

interface RenderFieldInputProps {
  field: FieldMeta;
  methods: UseFormReturn<EmployeeFormData>;
  isViewOnly?: boolean;
}

export const renderFieldInput = ({ field, methods, isViewOnly = false }: RenderFieldInputProps) => {
  const { control, register, formState: { errors } } = methods;
  const fieldName = `employee.${field.name}` as FieldPath<EmployeeFormData>;
  const error = errors?.employee?.[field.name as keyof typeof errors.employee];

  // Helper function to safely check if a date is valid
  const isValidDate = (date: any): boolean => {
    if (!date) return false;
    const d = new Date(date);
    return !isNaN(d.getTime());
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            disabled={isViewOnly}
            {...register(fieldName)}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            disabled={isViewOnly}
            {...register(fieldName)}
          />
        );

      case 'dropdown':
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={controllerField.onChange}
                value={String(controllerField.value || '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {(field.options || []).map((opt: any) => (
                    <SelectItem key={typeof opt === 'object' ? opt.value : opt} 
                                value={typeof opt === 'object' ? opt.value : opt}>
                      {typeof opt === 'object' ? opt.label : opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case 'boolean':
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Switch
                checked={!!controllerField.value}
                onCheckedChange={controllerField.onChange}
                disabled={isViewOnly}
              />
            )}
          />
        );

      case 'date':
        return (
          <Controller
            control={control}
            name={fieldName}
            render={({ field: controllerField }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !controllerField.value && "text-muted-foreground"
                    )}
                    disabled={isViewOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {controllerField.value && isValidDate(controllerField.value)
                      ? format(new Date(controllerField.value as string), 'PPP')
                      : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={controllerField.value && isValidDate(controllerField.value) 
                      ? new Date(controllerField.value as string) 
                      : undefined}
                    onSelect={(date) =>
                      controllerField.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        );

      default:
        return (
          <Input
            id={field.name}
            placeholder={field.placeholder}
            disabled={isViewOnly}
            {...register(fieldName)}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <Label htmlFor={field.name} className="font-bold">
        {field.label}
      </Label>
      {renderInput()}
      {error && <p className="text-sm font-medium text-destructive">{(error as any).message}</p>}
    </div>
  );
};
