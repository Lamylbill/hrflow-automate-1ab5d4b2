
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subYears } from 'date-fns';
import { FieldsToggle } from './shared/FieldsToggle';
import { genderOptions, nationalityOptions, maritalStatusOptions } from '../data/employeeOptions';

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
  
  // Set min and max dates for date picker
  const maxDate = new Date(); // Today
  const minDate = new Date('1900-01-01');

  return (
    <div className="space-y-6">
      <FieldsToggle 
        showAdvanced={showAdvancedFields} 
        onToggle={onToggleAdvanced} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              {...register('employee.first_name')}
              disabled={isViewOnly}
              required
            />
          </div>

          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              {...register('employee.last_name')}
              disabled={isViewOnly}
              required
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
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
            <Label htmlFor="nationality">Nationality</Label>
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
          </div>

          <div>
            <Label htmlFor="identity_no">Identity Number</Label>
            <Input
              id="identity_no"
              {...register('employee.identity_no')}
              disabled={isViewOnly}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="date_of_birth">Date of Birth</Label>
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
            <Label htmlFor="marital_status">Marital Status</Label>
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
            <Label htmlFor="phone_number">Contact Number</Label>
            <Input
              id="phone_number"
              {...register('employee.phone_number')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('employee.email')}
              disabled={isViewOnly}
              required
            />
          </div>
        </div>
      </div>

      {/* Advanced Fields */}
      {showAdvancedFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <Label htmlFor="alias_name">Alias Name</Label>
              <Input
                id="alias_name"
                {...register('employee.alias_name')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="local_name">Local Name</Label>
              <Input
                id="local_name"
                {...register('employee.local_name')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="web_role">Web Role</Label>
              <Input
                id="web_role"
                {...register('employee.web_role')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                {...register('employee.middle_name')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                {...register('employee.full_name')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="birth_place">Birth Place</Label>
              <Input
                id="birth_place"
                {...register('employee.birth_place')}
                disabled={isViewOnly}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="marriage_date">Marriage Date</Label>
              <Controller
                control={control}
                name="employee.marriage_date"
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
                    <PopoverContent className="w-auto p-0">
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
              <Label htmlFor="no_of_children">Number of Children</Label>
              <Input
                id="no_of_children"
                type="number"
                {...register('employee.no_of_children', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="retire_age">Retirement Age</Label>
              <Input
                id="retire_age"
                type="number"
                {...register('employee.retire_age', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="ethnic_origin">Ethnic Origin</Label>
              <Input
                id="ethnic_origin"
                {...register('employee.ethnic_origin')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="religion">Religion</Label>
              <Input
                id="religion"
                {...register('employee.religion')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                {...register('employee.qualification')}
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
