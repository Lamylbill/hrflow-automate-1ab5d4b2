
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';

interface EmploymentTabProps {
  isViewOnly?: boolean;
}

export const EmploymentTab: React.FC<EmploymentTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="email" className="font-medium">Email *</Label>
          <Input 
            id="email" 
            type="email"
            {...register('employee.email', { required: "Email is required" })}
            disabled={isViewOnly}
          />
          {errors.employee?.email && (
            <p className="text-red-500 text-sm mt-1">{errors.employee.email.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="date_of_hire">Join Date</Label>
          <Input 
            id="date_of_hire" 
            type="date"
            {...register('employee.date_of_hire')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="join_date_for_leave">Join Date for Leave</Label>
          <Input 
            id="join_date_for_leave" 
            type="date"
            {...register('employee.join_date_for_leave')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="initial_join_date">Initial Join Date</Label>
          <Input 
            id="initial_join_date" 
            type="date"
            {...register('employee.initial_join_date')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="recruitment_type">Recruitment Type</Label>
          <Input 
            id="recruitment_type" 
            {...register('employee.recruitment_type')}
            disabled={isViewOnly}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="new_graduate"
            {...register('employee.new_graduate')}
            disabled={isViewOnly}
          />
          <Label htmlFor="new_graduate">New Graduate</Label>
        </div>
        
        <div>
          <Label htmlFor="probation_period">Probation Period</Label>
          <Input 
            id="probation_period" 
            type="number"
            {...register('employee.probation_period', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="probation_period_type">Probation Period Type</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => {
              // This would typically be handled by a controller component
            }}
            defaultValue={control._defaultValues.employee?.probation_period_type || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Days">Days</SelectItem>
              <SelectItem value="Weeks">Weeks</SelectItem>
              <SelectItem value="Months">Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="probation_due">Probation Due</Label>
          <Input 
            id="probation_due" 
            type="date"
            {...register('employee.probation_due')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="confirmed_date">Confirmed Date</Label>
          <Input 
            id="confirmed_date" 
            type="date"
            {...register('employee.confirmed_date')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="resignation_tender_date">Resignation Tender Date</Label>
          <Input 
            id="resignation_tender_date" 
            type="date"
            {...register('employee.resignation_tender_date')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="date_of_exit">Exit Date</Label>
          <Input 
            id="date_of_exit" 
            type="date"
            {...register('employee.date_of_exit')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="exit_reason">Exit Reason</Label>
          <Input 
            id="exit_reason" 
            {...register('employee.exit_reason')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="exit_interview_date">Exit Interview Date</Label>
          <Input 
            id="exit_interview_date" 
            type="date"
            {...register('employee.exit_interview_date')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="notice_period">Notice Period</Label>
          <Input 
            id="notice_period" 
            type="number"
            {...register('employee.notice_period', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="shorted_period">Shorted Period</Label>
          <Input 
            id="shorted_period" 
            type="number"
            {...register('employee.shorted_period', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="shorted_period_type">Shorted Period Type</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => {
              // This would typically be handled by a controller component
            }}
            defaultValue={control._defaultValues.employee?.shorted_period_type || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Days">Days</SelectItem>
              <SelectItem value="Weeks">Weeks</SelectItem>
              <SelectItem value="Months">Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="rehire"
            {...register('employee.rehire')}
            disabled={isViewOnly}
          />
          <Label htmlFor="rehire">Rehire</Label>
        </div>
        
        <div>
          <Label htmlFor="previous_employee_code">Previous Employee Code</Label>
          <Input 
            id="previous_employee_code" 
            {...register('employee.previous_employee_code')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="service_length_adjustment">Service Length Adjustment</Label>
          <Input 
            id="service_length_adjustment" 
            type="number"
            {...register('employee.service_length_adjustment', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="service_length_total">Service Length Total</Label>
          <Input 
            id="service_length_total" 
            type="number"
            {...register('employee.service_length_total', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="previous_work_experience">Previous Work Experience</Label>
          <Input 
            id="previous_work_experience" 
            type="number"
            {...register('employee.previous_work_experience', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="work_experience_to_date">Work Experience To-Date</Label>
          <Input 
            id="work_experience_to_date" 
            type="number"
            {...register('employee.work_experience_to_date', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="no_of_contracts">No of Contracts</Label>
          <Input 
            id="no_of_contracts" 
            type="number"
            {...register('employee.no_of_contracts', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="contract_adjustment">Contract Adjustment</Label>
          <Input 
            id="contract_adjustment" 
            type="number"
            {...register('employee.contract_adjustment', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="no_of_contracts_total">No of Contracts Total</Label>
          <Input 
            id="no_of_contracts_total" 
            type="number"
            {...register('employee.no_of_contracts_total', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="last_working_date">Last Working Date</Label>
          <Input 
            id="last_working_date" 
            type="date"
            {...register('employee.last_working_date')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="extension_no">Extension No</Label>
          <Input 
            id="extension_no" 
            {...register('employee.extension_no')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="mobile_no">Mobile No</Label>
          <Input 
            id="mobile_no" 
            {...register('employee.mobile_no')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="telephone_no">Telephone No</Label>
          <Input 
            id="telephone_no" 
            {...register('employee.telephone_no')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="personal_email">Personal Email</Label>
          <Input 
            id="personal_email" 
            type="email"
            {...register('employee.personal_email')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="personal_mobile_no">Personal Mobile No</Label>
          <Input 
            id="personal_mobile_no" 
            {...register('employee.personal_mobile_no')}
            disabled={isViewOnly}
          />
        </div>
      </div>
    </div>
  );
};
