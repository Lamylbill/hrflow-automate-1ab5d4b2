
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';
import { payTypeOptions, payModeOptions, currencyOptions, bankOptions } from '../data/employeeOptions';

interface CompensationBenefitsTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const CompensationBenefitsTab: React.FC<CompensationBenefitsTabProps> = ({ 
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
        {/* Basic Fields */}
        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              step="0.01"
              {...register('employee.salary', { valueAsNumber: true })}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="pay_mode">Pay Mode</Label>
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

          <div>
            <Label className="font-bold" htmlFor="pay_type">Pay Type</Label>
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
        </div>

        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="bank_name">Bank Name</Label>
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
            <Label className="font-bold" htmlFor="bank_account_number">Bank Account Number</Label>
            <Input
              id="bank_account_number"
              {...register('employee.bank_account_number')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="medical_entitlement">Medical Entitlement</Label>
            <Input
              id="medical_entitlement"
              type="number"
              step="0.01"
              {...register('employee.medical_entitlement', { valueAsNumber: true })}
              disabled={isViewOnly}
            />
          </div>
        </div>
      </div>

      {/* Advanced Fields */}
      {showAdvancedFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="bank_branch">Bank Branch</Label>
              <Input
                id="bank_branch"
                {...register('employee.bank_branch')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="bank_currency">Bank Currency</Label>
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
              <Label className="font-bold" htmlFor="salary_date_start">Salary Date Start</Label>
              <Input
                id="salary_date_start"
                type="date"
                {...register('employee.salary_date_start')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="salary_status_change_reason">Salary Status Change Reason</Label>
              <Input
                id="salary_status_change_reason"
                {...register('employee.salary_status_change_reason')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="salary_fixed">Salary Fixed</Label>
              <Input
                id="salary_fixed"
                type="number"
                step="0.01"
                {...register('employee.salary_fixed', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="mvc">MVC</Label>
              <Input
                id="mvc"
                type="number"
                step="0.01"
                {...register('employee.mvc', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="mvc_percentage">MVC Percentage</Label>
              <Input
                id="mvc_percentage"
                type="number"
                step="0.01"
                {...register('employee.mvc_percentage', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="salary_gross">Salary Gross</Label>
              <Input
                id="salary_gross"
                type="number"
                step="0.01"
                {...register('employee.salary_gross', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="leave_entitlement">Leave Entitlement</Label>
              <Input
                id="leave_entitlement"
                type="number"
                step="0.01"
                {...register('employee.leave_entitlement', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="leave_balance">Leave Balance</Label>
              <Input
                id="leave_balance"
                type="number"
                step="0.01"
                {...register('employee.leave_balance', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="paid_medical_examination_fee"
                {...register('employee.paid_medical_examination_fee')}
                disabled={isViewOnly}
              />
              <Label className="font-bold" htmlFor="paid_medical_examination_fee">Paid Medical Examination Fee</Label>
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="other_medical_benefit">Other Medical Benefit</Label>
              <Input
                id="other_medical_benefit"
                {...register('employee.other_medical_benefit')}
                disabled={isViewOnly}
              />
            </div>
            
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="thirteenth_month_entitlement"
                {...register('employee.thirteenth_month_entitlement')}
                disabled={isViewOnly}
              />
              <Label className="font-bold" htmlFor="thirteenth_month_entitlement">13th Month Entitlement</Label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="group_hospital_surgical_plan">Group Hospital Surgical Plan</Label>
              <Input
                id="group_hospital_surgical_plan"
                {...register('employee.group_hospital_surgical_plan')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="group_personal_accident_plan">Group Personal Accident Plan</Label>
              <Input
                id="group_personal_accident_plan"
                {...register('employee.group_personal_accident_plan')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="outpatient_medical_plan">Outpatient Medical Plan</Label>
              <Input
                id="outpatient_medical_plan"
                {...register('employee.outpatient_medical_plan')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="beneficiary_name">Beneficiary Name</Label>
              <Input
                id="beneficiary_name"
                {...register('employee.beneficiary_name')}
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
