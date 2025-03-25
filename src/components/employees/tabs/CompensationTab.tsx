
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';
import { payTypeOptions, payModeOptions, currencyOptions, bankOptions } from '../data/employeeOptions';

interface CompensationTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const CompensationTab: React.FC<CompensationTabProps> = ({ 
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
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              step="0.01"
              {...register('employee.salary', { valueAsNumber: true })}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label htmlFor="pay_type">Pay Type</Label>
            <Controller
              name="employee.pay_type"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pay type" />
                  </SelectTrigger>
                  <SelectContent>
                    {payTypeOptions.map(option => (
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
            <Label htmlFor="pay_mode">Pay Mode</Label>
            <Controller
              name="employee.pay_mode"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pay mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {payModeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="bank_name">Bank Name</Label>
            <Controller
              name="employee.bank_name"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankOptions.map(option => (
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
            <Label htmlFor="bank_account_number">Bank Account Number</Label>
            <Input
              id="bank_account_number"
              {...register('employee.bank_account_number')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label htmlFor="salary_currency">Salary Currency</Label>
            <Controller
              name="employee.salary_currency"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Label htmlFor="bank_branch">Bank Branch</Label>
              <Input
                id="bank_branch"
                {...register('employee.bank_branch')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="beneficiary_name">Beneficiary Name</Label>
              <Input
                id="beneficiary_name"
                {...register('employee.beneficiary_name')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="bank_currency">Bank Currency</Label>
              <Controller
                name="employee.bank_currency"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={isViewOnly}
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map(option => (
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
              <Label htmlFor="allocation_type">Allocation Type</Label>
              <Input
                id="allocation_type"
                {...register('employee.allocation_type')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="allocation_amount">Allocation Amount</Label>
              <Input
                id="allocation_amount"
                type="number"
                step="0.01"
                {...register('employee.allocation_amount', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="allocation_account">Allocation Account</Label>
              <Input
                id="allocation_account"
                {...register('employee.allocation_account')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="allocation_run">Allocation Run</Label>
              <Input
                id="allocation_run"
                {...register('employee.allocation_run')}
                disabled={isViewOnly}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="work_days_per_week">Work Days Per Week</Label>
              <Input
                id="work_days_per_week"
                type="number"
                step="0.5"
                {...register('employee.work_days_per_week', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="work_hours_per_day">Work Hours Per Day</Label>
              <Input
                id="work_hours_per_day"
                type="number"
                step="0.5"
                {...register('employee.work_hours_per_day', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="work_days_per_year">Work Days Per Year</Label>
              <Input
                id="work_days_per_year"
                type="number"
                {...register('employee.work_days_per_year', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="work_hours_per_year">Work Hours Per Year</Label>
              <Input
                id="work_hours_per_year"
                type="number"
                {...register('employee.work_hours_per_year', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="salary_arrears">Salary Arrears</Label>
              <Input
                id="salary_arrears"
                type="number"
                step="0.01"
                {...register('employee.salary_arrears', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="freeze_payment">Freeze Payment</Label>
              <Controller
                name="employee.freeze_payment"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={isViewOnly}
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value !== undefined ? String(field.value) : ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="mvc">MVC</Label>
              <Input
                id="mvc"
                type="number"
                step="0.01"
                {...register('employee.mvc', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="mvc_percentage">MVC (%)</Label>
              <Input
                id="mvc_percentage"
                type="number"
                step="0.01"
                {...register('employee.mvc_percentage', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
