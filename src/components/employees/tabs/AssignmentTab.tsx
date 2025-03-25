
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';

interface AssignmentTabProps {
  isViewOnly?: boolean;
}

export const AssignmentTab: React.FC<AssignmentTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="assignment_date_start">Date Start</Label>
          <Input 
            id="assignment_date_start" 
            type="date"
            {...register('employee.assignment_date_start')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="status_change_reason">Status Change Reason</Label>
          <Input 
            id="status_change_reason" 
            {...register('employee.status_change_reason')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company" 
            {...register('employee.company')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="department">Department</Label>
          <Input 
            id="department" 
            {...register('employee.department')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="job_title">Designation</Label>
          <Input 
            id="job_title" 
            {...register('employee.job_title')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="cost_center">Cost Center</Label>
          <Input 
            id="cost_center" 
            {...register('employee.cost_center')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="job_grade">Job Grade</Label>
          <Input 
            id="job_grade" 
            {...register('employee.job_grade')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="employment_type">Employment Type</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => {
              // This would typically be handled by a controller component
            }}
            defaultValue={control._defaultValues.employee?.employment_type || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-Time">Full-Time</SelectItem>
              <SelectItem value="Part-Time">Part-Time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Temporary">Temporary</SelectItem>
              <SelectItem value="Intern">Intern</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="employment_status">Employment Status</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => {
              // This would typically be handled by a controller component
            }}
            defaultValue={control._defaultValues.employee?.employment_status || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Resigned">Resigned</SelectItem>
              <SelectItem value="Terminated">Terminated</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="hr_rpt_job_category">HR Rpt Job Category</Label>
          <Input 
            id="hr_rpt_job_category" 
            {...register('employee.hr_rpt_job_category')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="hr_rpt_division_category">HR Rpt Division Category</Label>
          <Input 
            id="hr_rpt_division_category" 
            {...register('employee.hr_rpt_division_category')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="leave_grade">Leave Grade</Label>
          <Input 
            id="leave_grade" 
            {...register('employee.leave_grade')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="pay_group">Pay Group</Label>
          <Input 
            id="pay_group" 
            {...register('employee.pay_group')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="manager">Manager</Label>
          <Input 
            id="manager" 
            {...register('employee.manager')}
            disabled={isViewOnly}
          />
        </div>
      </div>
    </div>
  );
};
