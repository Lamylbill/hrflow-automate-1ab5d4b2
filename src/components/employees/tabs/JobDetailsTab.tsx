import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';

interface JobDetailsTabProps {
  isViewOnly?: boolean;
}

export const JobDetailsTab: React.FC<JobDetailsTabProps> = ({ 
  isViewOnly = false 
}) => {
  const { control, register, watch } = useFormContext<EmployeeFormData>();
  
  const employmentType = watch("employee.employment_type");
  const contractType = watch("employee.contract_type");
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="font-medium" htmlFor="job_title">Job Title</Label>
          <Input 
            id="job_title" 
            {...register("employee.job_title")} 
            disabled={isViewOnly}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="department">Department</Label>
          <Input 
            id="department" 
            {...register("employee.department")} 
            disabled={isViewOnly}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="employment_type">Employment Type</Label>
          <Controller
            name="employee.employment_type"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                  <SelectItem value="Intern">Intern</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="date_of_hire">Date of Hire</Label>
          <Input 
            id="date_of_hire" 
            type="date"
            {...register("employee.date_of_hire")} 
            disabled={isViewOnly}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="supervisor">Supervisor</Label>
          <Input 
            id="supervisor" 
            {...register("employee.supervisor")} 
            disabled={isViewOnly}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="employment_status">Employment Status</Label>
          <Input 
            id="employment_status" 
            {...register("employee.employment_status")} 
            disabled={isViewOnly}
          />
        </div>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="font-medium" htmlFor="confirmation_date">Confirmation Date</Label>
          <Input 
            id="confirmation_date" 
            type="date"
            {...register("employee.confirmation_date")} 
            disabled={isViewOnly}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="probation_end">Probation End</Label>
          <Input 
            id="probation_end" 
            type="date"
            {...register("employee.probation_end")} 
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-medium" htmlFor="probation_period_type">Probation Period Type</Label>
          <Controller
            name="employee.probation_period_type" as any
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="job_grade">Job Grade</Label>
          <Input 
            id="job_grade" 
            {...register("employee.job_grade")} 
            disabled={isViewOnly}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="employee_code">Employee Code</Label>
          <Input 
            id="employee_code" 
            {...register("employee.employee_code")} 
            disabled={isViewOnly}
          />
        </div>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="font-medium" htmlFor="contract_type">Contract Type</Label>
          <Controller
            name="employee.contract_type"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Fixed-term">Fixed-term</SelectItem>
                  <SelectItem value="Zero-hour">Zero-hour</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="contract_start">Contract Start</Label>
          <Input 
            id="contract_start" 
            type="date"
            {...register("employee.contract_start")} 
            disabled={isViewOnly}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="work_hours">Work Hours</Label>
          <Input 
            id="work_hours" 
            type="number"
            {...register("employee.work_hours", { valueAsNumber: true })} 
            disabled={isViewOnly}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="work_pass_type">Work Pass Type</Label>
          <Input 
            id="work_pass_type" 
            {...register("employee.work_pass_type")} 
            disabled={isViewOnly}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="work_pass_number">Work Pass Number</Label>
          <Input 
            id="work_pass_number" 
            {...register("employee.work_pass_number")} 
            disabled={isViewOnly}
          />
        </div>
  
        <div>
          <Label className="font-medium" htmlFor="work_pass_expiry">Work Pass Expiry</Label>
          <Input 
            id="work_pass_expiry" 
            type="date"
            {...register("employee.work_pass_expiry")} 
            disabled={isViewOnly}
          />
        </div>
      </div>
    </div>
  );
};
