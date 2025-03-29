
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';

interface SalaryTabProps {
  isViewOnly?: boolean;
}

export const SalaryTab: React.FC<SalaryTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label className="font-bold" htmlFor="work_days_per_week">Work Days Per Week</Label>
          <Input 
            id="work_days_per_week" 
            type="number"
            step="0.5"
            {...register('employee.work_days_per_week', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="work_hours_per_day">Work Hours Per Day</Label>
          <Input 
            id="work_hours_per_day" 
            type="number"
            step="0.5"
            {...register('employee.work_hours_per_day', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="work_hours_per_year">Work Hours Per Year</Label>
          <Input 
            id="work_hours_per_year" 
            type="number"
            step="0.5"
            {...register('employee.work_hours_per_year', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="work_days_per_year">Work Days Per Year</Label>
          <Input 
            id="work_days_per_year" 
            type="number"
            step="0.5"
            {...register('employee.work_days_per_year', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="salary_arrears">Salary Arrears</Label>
          <Input 
            id="salary_arrears" 
            type="number"
            step="0.01"
            {...register('employee.salary_arrears', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="freeze_payment"
            {...register('employee.freeze_payment')}
            disabled={isViewOnly}
          />
          <Label className="font-bold" htmlFor="freeze_payment">Freeze Payment</Label>
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="salary_currency">Salary Currency</Label>
          <Input 
            id="salary_currency" 
            {...register('employee.salary_currency')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="bank_name">Bank Code</Label>
          <Input 
            id="bank_name" 
            {...register('employee.bank_name')}
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
        
        <div>
          <Label className="font-bold" htmlFor="bank_account_number">Bank Account No</Label>
          <Input 
            id="bank_account_number" 
            {...register('employee.bank_account_number')}
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
          <Label className="font-bold" htmlFor="bank_currency">Bank Currency</Label>
          <Input 
            id="bank_currency" 
            {...register('employee.bank_currency')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="allocation_type">Allocation Type</Label>
          <Input 
            id="allocation_type" 
            {...register('employee.allocation_type')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="allocation_amount">Allocation Amount</Label>
          <Input 
            id="allocation_amount" 
            type="number"
            step="0.01"
            {...register('employee.allocation_amount', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="allocation_account">Allocation Account</Label>
          <Input 
            id="allocation_account" 
            {...register('employee.allocation_account')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="allocation_run">Allocation Run</Label>
          <Input 
            id="allocation_run" 
            {...register('employee.allocation_run')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="salary_date_start">Date Start</Label>
          <Input 
            id="salary_date_start" 
            type="date"
            {...register('employee.salary_date_start')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="salary_status_change_reason">Status Change Reason</Label>
          <Input 
            id="salary_status_change_reason" 
            {...register('employee.salary_status_change_reason')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="pay_mode">Pay Mode</Label>
          <Input 
            id="pay_mode" 
            {...register('employee.pay_mode')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="pay_type">Pay Type</Label>
          <Input 
            id="pay_type" 
            {...register('employee.pay_type')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="salary_grade">Salary Grade</Label>
          <Input 
            id="salary_grade" 
            {...register('employee.salary_grade')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="salary_fixed">Salary Fixed</Label>
          <Input 
            id="salary_fixed" 
            type="number"
            step="0.01"
            {...register('employee.salary_fixed', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="mvc">MVC</Label>
          <Input 
            id="mvc" 
            type="number"
            step="0.01"
            {...register('employee.mvc', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="mvc_percentage">MVC (%)</Label>
          <Input 
            id="mvc_percentage" 
            type="number"
            step="0.01"
            {...register('employee.mvc_percentage', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="salary_gross">Salary Gross</Label>
          <Input 
            id="salary_gross" 
            type="number"
            step="0.01"
            {...register('employee.salary_gross', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="salary">Salary</Label>
          <Input 
            id="salary" 
            type="number"
            step="0.01"
            {...register('employee.salary', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="leave_entitlement">Leave Entitlement</Label>
          <Input 
            id="leave_entitlement" 
            type="number"
            step="0.5"
            {...register('employee.leave_entitlement', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="leave_balance">Leave Balance</Label>
          <Input 
            id="leave_balance" 
            type="number"
            step="0.5"
            {...register('employee.leave_balance', { valueAsNumber: true })}
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
  );
};
