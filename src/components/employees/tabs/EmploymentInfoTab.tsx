
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';

interface EmploymentInfoTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const EmploymentInfoTab: React.FC<EmploymentInfoTabProps> = ({ 
  isViewOnly = false,
  showAdvancedFields,
  onToggleAdvanced
}) => {
  const { control, register } = useFormContext<EmployeeFormData>();

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
            <Label className="font-bold" htmlFor="employee_code">Employee Code</Label>
            <Input
              id="employee_code"
              {...register('employee.employee_code')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="department">Department</Label>
            <Input
              id="department"
              {...register('employee.department')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="job_title">Job Title</Label>
            <Input
              id="job_title"
              {...register('employee.job_title')}
              disabled={isViewOnly}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="employment_type">Employment Type</Label>
            <Input
              id="employment_type"
              {...register('employee.employment_type')}
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

          <div>
            <Label className="font-bold" htmlFor="reporting_manager">Reporting Manager</Label>
            <Input
              id="reporting_manager"
              {...register('employee.reporting_manager')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('employee.title')}
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
              <Label className="font-bold" htmlFor="recruitment_type">Recruitment Type</Label>
              <Input
                id="recruitment_type"
                {...register('employee.recruitment_type')}
                disabled={isViewOnly}
              />
            </div>
            
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="new_graduate"
                {...register('employee.new_graduate')}
                disabled={isViewOnly}
              />
              <Label className="font-bold" htmlFor="new_graduate">New Graduate</Label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="union_membership">Union Membership</Label>
              <Input
                id="union_membership"
                {...register('employee.union_membership')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="login_id">Login ID</Label>
              <Input
                id="login_id"
                {...register('employee.login_id')}
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
