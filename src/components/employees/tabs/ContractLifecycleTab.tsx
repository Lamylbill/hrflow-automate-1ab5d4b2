
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
            <Label className="font-bold" htmlFor="contract_type">Contract Type</Label>
            <Input
              id="contract_type"
              {...register('employee.contract_type')}
              disabled={isViewOnly}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="contract_signed"
              {...register('employee.contract_signed')}
              disabled={isViewOnly}
            />
            <Label className="font-bold" htmlFor="contract_signed">Contract Signed</Label>
          </div>
        </div>

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
            <Label className="font-bold" htmlFor="date_of_exit">Date of Exit</Label>
            <Input
              id="date_of_exit"
              type="date"
              {...register('employee.date_of_exit')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="contract_nature">Contract Nature</Label>
            <Input
              id="contract_nature"
              {...register('employee.contract_nature')}
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
              <Label className="font-bold" htmlFor="confirmed_date">Confirmation Date</Label>
              <Input
                id="confirmed_date"
                type="date"
                {...register('employee.confirmed_date')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="last_working_date">Last Working Date</Label>
              <Input
                id="last_working_date"
                type="date"
                {...register('employee.last_working_date')}
                disabled={isViewOnly}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="exit_reason">Exit Reason</Label>
              <Input
                id="exit_reason"
                {...register('employee.exit_reason')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="rehire">Rehireable</Label>
              <div className="mt-2">
                <Checkbox
                  id="rehire"
                  {...register('employee.rehire')}
                  disabled={isViewOnly}
                />
              </div>
            </div>

            <div>
              <Label className="font-bold" htmlFor="renewal">Renewal Status</Label>
              <Input
                id="renewal"
                {...register('employee.renewal')}
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
