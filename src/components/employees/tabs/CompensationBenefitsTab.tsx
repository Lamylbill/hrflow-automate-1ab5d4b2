
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';

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
  const { register } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      <FieldsToggle 
        showAdvanced={showAdvancedFields} 
        onToggle={onToggleAdvanced} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Fields */}
        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="salary">Basic Salary</Label>
            <Input
              id="salary"
              type="number"
              step="0.01"
              {...register('employee.salary', { valueAsNumber: true })}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="salary_currency">Currency</Label>
            <Input
              id="salary_currency"
              {...register('employee.salary_currency')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="leave_entitlement">Leave Entitlement (Days)</Label>
            <Input
              id="leave_entitlement"
              type="number"
              {...register('employee.leave_entitlement', { valueAsNumber: true })}
              disabled={isViewOnly}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="bank_name">Bank Name</Label>
            <Input
              id="bank_name"
              {...register('employee.bank_name')}
              disabled={isViewOnly}
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
              <Label className="font-bold" htmlFor="salary_grade">Salary Grade</Label>
              <Input
                id="salary_grade"
                {...register('employee.salary_grade')}
                disabled={isViewOnly}
              />
            </div>
            
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
          </div>

          <div className="space-y-4">
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

            <div>
              <Label className="font-bold" htmlFor="bank_branch">Bank Branch</Label>
              <Input
                id="bank_branch"
                {...register('employee.bank_branch')}
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
