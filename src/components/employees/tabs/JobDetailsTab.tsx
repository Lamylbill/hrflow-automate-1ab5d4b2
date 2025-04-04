
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { EmployeeFormData } from '@/types/employee';
import { 
  employmentTypeOptions, employmentStatusOptions, 
  probationStatusOptions, probationPeriodTypeOptions 
} from '../data/employeeOptions';

interface JobDetailsTabProps {
  isViewOnly?: boolean;
}

export const JobDetailsTab: React.FC<JobDetailsTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors }, watch } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="employee_code" className="font-bold">Employee Code</Label>
          <Input 
            id="employee_code"
            {...register('employee.employee_code')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="job_title" className="font-bold">Job Title</Label>
          <Input 
            id="job_title"
            {...register('employee.job_title')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="department" className="font-bold">Department</Label>
          <Input 
            id="department"
            {...register('employee.department')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="employment_type" className="font-bold">Employment Type</Label>
          <Controller
            name="employee.employment_type"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <SelectTrigger id="employment_type">
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypeOptions.map(option => (
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
          <Label htmlFor="employment_status" className="font-bold">Employment Status</Label>
          <Controller
            name="employee.employment_status"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <SelectTrigger id="employment_status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {employmentStatusOptions.map(option => (
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
          <Label htmlFor="date_of_hire" className="font-bold">Date of Hire</Label>
          <Controller
            name="employee.date_of_hire"
            control={control}
            render={({ field }) => (
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                onDateChange={field.onChange}
                disabled={isViewOnly}
                placeholder="Select hire date"
              />
            )}
          />
        </div>
        
        <div>
          <Label htmlFor="probation_period" className="font-bold">Probation Period</Label>
          <Input 
            id="probation_period"
            type="number"
            {...register('employee.probation_period', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="probation_period_type" className="font-bold">Probation Period Type</Label>
          <Controller
            name="employee.probation_period_type"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <SelectTrigger id="probation_period_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {probationPeriodTypeOptions.map(option => (
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
          <Label htmlFor="probation_due" className="font-bold">Probation End Date</Label>
          <Controller
            name="employee.probation_due"
            control={control}
            render={({ field }) => (
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                onDateChange={field.onChange}
                disabled={isViewOnly}
                placeholder="Select probation end date"
              />
            )}
          />
        </div>
        
        <div>
          <Label htmlFor="probation_status" className="font-bold">Probation Status</Label>
          <Controller
            name="employee.probation_status"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <SelectTrigger id="probation_status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {probationStatusOptions.map(option => (
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
          <Label htmlFor="confirmation_date" className="font-bold">Confirmation Date</Label>
          <Controller
            name="employee.confirmation_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                onDateChange={field.onChange}
                disabled={isViewOnly}
                placeholder="Select confirmation date"
              />
            )}
          />
        </div>
        
        <div>
          <Label htmlFor="supervisor" className="font-bold">Supervisor</Label>
          <Input 
            id="supervisor"
            {...register('employee.supervisor')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="job_grade" className="font-bold">Job Grade</Label>
          <Input 
            id="job_grade"
            {...register('employee.job_grade')}
            disabled={isViewOnly}
          />
        </div>
      </div>
    </div>
  );
};
