
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
import { format } from 'date-fns';
import { FieldsToggle } from './shared/FieldsToggle';
import { momOccupationGroupOptions, residencyStatusOptions } from '../data/employeeOptions';

interface ComplianceTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const ComplianceTab: React.FC<ComplianceTabProps> = ({ 
  isViewOnly = false,
  showAdvancedFields,
  onToggleAdvanced
}) => {
  const { control, register } = useFormContext<EmployeeFormData>();

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
            <Label className="font-bold" htmlFor="mom_occupation_group">MOM Occupation Group</Label>
            <Controller
              name="employee.mom_occupation_group"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select occupation group" />
                  </SelectTrigger>
                  <SelectContent>
                    {momOccupationGroupOptions.map(option => (
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
            <Label className="font-bold" htmlFor="residency_status">Residency Status</Label>
            <Controller
              name="employee.residency_status"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select residency status" />
                  </SelectTrigger>
                  <SelectContent>
                    {residencyStatusOptions.map(option => (
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
            <Label className="font-bold" htmlFor="union_membership">Union Membership</Label>
            <Input
              id="union_membership"
              {...register('employee.union_membership')}
              disabled={isViewOnly}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="cpf_contribution">CPF Eligibility</Label>
            <Controller
              name="employee.cpf_contribution"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={(value) => field.onChange(value === 'true')}
                  value={field.value !== undefined ? String(field.value) : 'true'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select eligibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Eligible</SelectItem>
                    <SelectItem value="false">Not Eligible</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="cpf_account_number">CPF Account Number</Label>
            <Input
              id="cpf_account_number"
              {...register('employee.cpf_account_number')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="pr_issue_date">PR Issue Date</Label>
            <Controller
              control={control}
              name="employee.pr_issue_date"
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>
      </div>

      {/* Advanced Fields */}
      {showAdvancedFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="mom_employee_type">MOM Employee Type</Label>
              <Input
                id="mom_employee_type"
                {...register('employee.mom_employee_type')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="mom_bc_occupation_group">MOM BC Occupation Group</Label>
              <Input
                id="mom_bc_occupation_group"
                {...register('employee.mom_bc_occupation_group')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="mom_bc_employee_type">MOM BC Employee Type</Label>
              <Input
                id="mom_bc_employee_type"
                {...register('employee.mom_bc_employee_type')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="mom_bc_employment_type">MOM BC Employment Type</Label>
              <Input
                id="mom_bc_employment_type"
                {...register('employee.mom_bc_employment_type')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="mom_bc_employee_group">MOM BC Employee Group</Label>
              <Input
                id="mom_bc_employee_group"
                {...register('employee.mom_bc_employee_group')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="funds">Funds</Label>
              <Input
                id="funds"
                {...register('employee.funds')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="mso_scheme">MSO Scheme</Label>
              <Input
                id="mso_scheme"
                {...register('employee.mso_scheme')}
                disabled={isViewOnly}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="pr_renounce_date">PR Renounce Date</Label>
              <Controller
                control={control}
                name="employee.pr_renounce_date"
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
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="statutory_date_start">Statutory Date Start</Label>
              <Controller
                control={control}
                name="employee.statutory_date_start"
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
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="statutory_date_end">Statutory Date End</Label>
              <Controller
                control={control}
                name="employee.statutory_date_end"
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
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="membership_no">Membership Number</Label>
              <Input
                id="membership_no"
                {...register('employee.membership_no')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="rest_day_per_week">Rest Day Per Week</Label>
              <Input
                id="rest_day_per_week"
                {...register('employee.rest_day_per_week')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="work_permit_number">Work Permit Number</Label>
              <Input
                id="work_permit_number"
                {...register('employee.work_permit_number')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="tax_identification_number">Tax Identification Number</Label>
              <Input
                id="tax_identification_number"
                {...register('employee.tax_identification_number')}
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
