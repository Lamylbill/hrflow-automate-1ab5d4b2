// src/components/employees/tabs/ContractLifecycleTab.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';

interface ContractLifecycleTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const ContractLifecycleTab: React.FC<ContractLifecycleTabProps> = ({
  isViewOnly = false,
  showAdvancedFields,
  onToggleAdvanced,
}) => {
  const { register } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      <FieldsToggle
        showAdvanced={showAdvancedFields}
        onToggle={onToggleAdvanced}
      />

      {/* Basic Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="hire_date">Hire Date</Label>
            <Input
              id="hire_date"
              type="date"
              {...register('employee.hire_date' as const)}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="contract_type">Contract Type</Label>
            <Input
              id="contract_type"
              {...register('employee.contract_type')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="employment_status">Employment Status</Label>
            <Input
              id="employment_status"
              {...register('employee.employment_status')}
              disabled={isViewOnly}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="probation_start_date">Probation Start</Label>
            <Input
              id="probation_start_date"
              type="date"
              {...register('employee.probation_start_date' as const)}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="probation_end_date">Probation End</Label>
            <Input
              id="probation_end_date"
              type="date"
              {...register('employee.probation_end_date' as const)}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="confirmation_date">Confirmation Date</Label>
            <Input
              id="confirmation_date"
              type="date"
              {...register('employee.confirmation_date' as const)}
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
              <Label className="font-bold" htmlFor="contract_start_date">Contract Start Date</Label>
              <Input
                id="contract_start_date"
                type="date"
                {...register('employee.contract_start_date' as const)}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="contract_end_date">Contract End Date</Label>
              <Input
                id="contract_end_date"
                type="date"
                {...register('employee.contract_end_date' as const)}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="notice_period">Notice Period</Label>
              <Input
                id="notice_period"
                {...register('employee.notice_period')}
                disabled={isViewOnly}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="exit_date">Exit Date</Label>
              <Input
                id="exit_date"
                type="date"
                {...register('employee.exit_date' as const)}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="exit_reason">Exit Reason</Label>
              <Input
                id="exit_reason"
                {...register('employee.exit_reason')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="exit_remarks">Exit Remarks</Label>
              <Input
                id="exit_remarks"
                {...register('employee.exit_remarks')}
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
