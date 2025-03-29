import React from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { FieldsToggle } from './shared/FieldsToggle';
import { genderOptions, maritalStatusOptions } from '../data/employeeOptions';

const nationalityOptions = [
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'China', value: 'China' },
  { label: 'India', value: 'India' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Vietnam', value: 'Vietnam' },
  { label: 'Myanmar', value: 'Myanmar' },
  { label: 'Other (please specify)', value: 'Other' },
];

interface BasicInfoTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  isViewOnly = false,
  showAdvancedFields,
  onToggleAdvanced
}) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();
  const selectedNationality = useWatch({ name: 'employee.nationality' });
  const otherNationality = useWatch({ name: 'employee.nationality_other' });

  const maxDate = new Date();
  const minDate = new Date('1900-01-01');

  return (
    <div className="space-y-6">
      <FieldsToggle 
        showAdvanced={showAdvancedFields} 
        onToggle={onToggleAdvanced} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              {...register('employee.full_name', { required: "Full name is required" })}
              disabled={isViewOnly}
              required
            />
            {errors.employee?.full_name && (
              <p className="text-sm font-bold font-medium text-destructive mt-1">{errors.employee.full_name.message}</p>
            )}
          </div>

          <div>
            <Label className="font-bold" htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              {...register('employee.first_name')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              {...register('employee.last_name')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="gender">Gender</Label>
            <Controller
              name="employee.gender"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="nationality">Nationality</Label>
            {isViewOnly ? (
              <Input
                value={selectedNationality === 'Other' && otherNationality?.trim() ? otherNationality : selectedNationality || ''}
                disabled
              />
            ) : (
              <>
                <Controller
                  name="employee.nationality"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={isViewOnly}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {selectedNationality === 'Other' && (
                  <div className="mt-2">
                    <Label className="font-bold" htmlFor="nationality_other">Please specify nationality</Label>
                    <Input
                      id="nationality_other"
                      placeholder="Enter nationality"
                      {...register('employee.nationality_other')}
                      disabled={isViewOnly}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="identity_no">Identity Number</Label>
            <Input
              id="identity_no"
              {...register('employee.identity_no')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="date_of_birth">Date of Birth</Label>
            <Controller
              control={control}
              name="employee.date_of_birth"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isViewOnly}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                      disabled={(date) => date > maxDate || date < minDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="marital_status">Marital Status</Label>
            <Controller
              name="employee.marital_status"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="phone_number">Contact Number</Label>
            <Input
              id="phone_number"
              {...register('employee.phone_number')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('employee.email', { required: "Email is required" })}
              disabled={isViewOnly}
              required
            />
            {errors.employee?.email && (
              <p className="text-sm font-bold font-medium text-destructive mt-1">{errors.employee.email.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
