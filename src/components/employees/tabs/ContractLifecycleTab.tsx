
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
            <Label className="font-bold" htmlFor="date_of_hire">Date of Hire</Label>
            <Input
              id="date_of_hire"
              type="date"
              {...register('employee.date_of_hire')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="contract_date_start">Contract Start Date</Label>
            <Input
              id="contract_date_start"
              type="date"
              {...register('employee.contract_date_start')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="contract_date_end">Contract End Date</Label>
            <Input
              id="contract_date_end"
              type="date"
              {...register('employee.contract_date_end')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="service_length_total">Service Length (Total)</Label>
            <Input
              id="service_length_total"
              type="number"
              {...register('employee.service_length_total', { valueAsNumber: true })}
              disabled={isViewOnly}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="contract_type">Contract Type</Label>
            <Input
              id="contract_type"
              {...register('employee.contract_type')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="work_experience_to_date">Work Experience (To Date)</Label>
            <Input
              id="work_experience_to_date"
              type="number"
              {...register('employee.work_experience_to_date', { valueAsNumber: true })}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="previous_work_experience">Previous Work Experience</Label>
            <Input
              id="previous_work_experience"
              type="number"
              {...register('employee.previous_work_experience', { valueAsNumber: true })}
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
              <Label className="font-bold" htmlFor="initial_join_date">Initial Join Date</Label>
              <Input
                id="initial_join_date"
                type="date"
                {...register('employee.initial_join_date')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="probation_period">Probation Period</Label>
              <Input
                id="probation_period"
                type="number"
                {...register('employee.probation_period', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="probation_due">Probation Due</Label>
              <Input
                id="probation_due"
                type="date"
                {...register('employee.probation_due')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="confirmed_date">Confirmed Date</Label>
              <Input
                id="confirmed_date"
                type="date"
                {...register('employee.confirmed_date')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="probation_status">Probation Status</Label>
              <Input
                id="probation_status"
                {...register('employee.probation_status')}
                disabled={isViewOnly}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="resignation_tender_date">Resignation Tender Date</Label>
              <Input
                id="resignation_tender_date"
                type="date"
                {...register('employee.resignation_tender_date')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="date_of_exit">Exit Date</Label>
              <Input
                id="date_of_exit"
                type="date"
                {...register('employee.date_of_exit')}
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
              <Label className="font-bold" htmlFor="exit_interview_date">Exit Interview Date</Label>
              <Input
                id="exit_interview_date"
                type="date"
                {...register('employee.exit_interview_date')}
                disabled={isViewOnly}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="notice_period">Notice Period</Label>
              <Input
                id="notice_period"
                type="number"
                {...register('employee.notice_period', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="termination_notice_period">Termination Notice Period</Label>
              <Input
                id="termination_notice_period"
                type="number"
                {...register('employee.termination_notice_period', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="rehire"
                {...register('employee.rehire')}
                disabled={isViewOnly}
              />
              <Label className="font-bold" htmlFor="rehire">Rehire</Label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="renewal">Renewal</Label>
              <Input
                id="renewal"
                {...register('employee.renewal')}
                disabled={isViewOnly}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="contract_signed"
                {...register('employee.contract_signed')}
                disabled={isViewOnly}
              />
              <Label className="font-bold" htmlFor="contract_signed">Contract Signed</Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
