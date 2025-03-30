
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';

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
            <Label className="font-bold" htmlFor="tax_identification_number">Tax Identification Number</Label>
            <Input
              id="tax_identification_number"
              {...register('employee.tax_identification_number')}
              disabled={isViewOnly}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cpf_contribution"
              {...register('employee.cpf_contribution')}
              disabled={isViewOnly}
              defaultChecked={true}
            />
            <Label className="font-bold" htmlFor="cpf_contribution">CPF Contribution</Label>
          </div>

          <div>
            <Label className="font-bold" htmlFor="cpf_account_number">CPF Account Number</Label>
            <Input
              id="cpf_account_number"
              {...register('employee.cpf_account_number')}
              disabled={isViewOnly}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="work_permit_number">Work Permit Number</Label>
            <Input
              id="work_permit_number"
              {...register('employee.work_permit_number')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="work_pass_expiry_date">Work Pass Expiry Date</Label>
            <Input
              id="work_pass_expiry_date"
              type="date"
              {...register('employee.work_pass_expiry_date')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="residency_status">Residency Status</Label>
            <Input
              id="residency_status"
              {...register('employee.residency_status')}
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
              <Label className="font-bold" htmlFor="statutory_date_start">Statutory Date Start</Label>
              <Input
                id="statutory_date_start"
                type="date"
                {...register('employee.statutory_date_start')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="statutory_date_end">Statutory Date End</Label>
              <Input
                id="statutory_date_end"
                type="date"
                {...register('employee.statutory_date_end')}
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
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="pr_issue_date">PR Issue Date</Label>
              <Input
                id="pr_issue_date"
                type="date"
                {...register('employee.pr_issue_date')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="pr_renounce_date">PR Renounce Date</Label>
              <Input
                id="pr_renounce_date"
                type="date"
                {...register('employee.pr_renounce_date')}
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
        </div>
      )}
    </div>
  );
};
