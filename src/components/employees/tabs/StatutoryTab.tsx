
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';

interface StatutoryTabProps {
  isViewOnly?: boolean;
}

export const StatutoryTab: React.FC<StatutoryTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="mom_occupation_group">MOM Occupation Group</Label>
          <Input 
            id="mom_occupation_group" 
            {...register('employee.mom_occupation_group')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="mom_employee_type">MOM Employee Type</Label>
          <Input 
            id="mom_employee_type" 
            {...register('employee.mom_employee_type')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="mom_bc_occupation_group">MOM BC Occupation Group</Label>
          <Input 
            id="mom_bc_occupation_group" 
            {...register('employee.mom_bc_occupation_group')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="mom_bc_employee_type">MOM BC Employee Type</Label>
          <Input 
            id="mom_bc_employee_type" 
            {...register('employee.mom_bc_employee_type')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="mom_bc_employment_type">MOM BC Employment Type</Label>
          <Input 
            id="mom_bc_employment_type" 
            {...register('employee.mom_bc_employment_type')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="mom_bc_employee_group">MOM BC Employee Group</Label>
          <Input 
            id="mom_bc_employee_group" 
            {...register('employee.mom_bc_employee_group')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="funds">Funds</Label>
          <Input 
            id="funds" 
            {...register('employee.funds')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="mso_scheme">MSO Scheme</Label>
          <Input 
            id="mso_scheme" 
            {...register('employee.mso_scheme')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="pr_issue_date">PR Issue Date</Label>
          <Input 
            id="pr_issue_date" 
            type="date"
            {...register('employee.pr_issue_date')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="pr_renounce_date">PR Renounce Date</Label>
          <Input 
            id="pr_renounce_date" 
            type="date"
            {...register('employee.pr_renounce_date')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="residency_status">Residency Status</Label>
          <Input 
            id="residency_status" 
            {...register('employee.residency_status')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="union_membership">Union</Label>
          <Input 
            id="union_membership" 
            {...register('employee.union_membership')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="statutory_date_start">Date Start</Label>
          <Input 
            id="statutory_date_start" 
            type="date"
            {...register('employee.statutory_date_start')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="statutory_date_end">Date End</Label>
          <Input 
            id="statutory_date_end" 
            type="date"
            {...register('employee.statutory_date_end')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="membership_no">Membership No</Label>
          <Input 
            id="membership_no" 
            {...register('employee.membership_no')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="rest_day_per_week">Rest Day Per Week</Label>
          <Input 
            id="rest_day_per_week" 
            {...register('employee.rest_day_per_week')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="overtime_payment_period">Overtime Payment Period</Label>
          <Input 
            id="overtime_payment_period" 
            {...register('employee.overtime_payment_period')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="overtime_rate_of_pay">Overtime Rate Of Pay</Label>
          <Input 
            id="overtime_rate_of_pay" 
            type="number"
            step="0.01"
            {...register('employee.overtime_rate_of_pay', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="paid_medical_examination_fee"
            {...register('employee.paid_medical_examination_fee')}
            disabled={isViewOnly}
          />
          <Label htmlFor="paid_medical_examination_fee">Paid Medical Examination Fee</Label>
        </div>
        
        <div>
          <Label htmlFor="other_medical_benefit">Other Medical Benefit</Label>
          <Input 
            id="other_medical_benefit" 
            {...register('employee.other_medical_benefit')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="termination_notice_period">Notice Period For Termination Of Employment</Label>
          <Input 
            id="termination_notice_period" 
            type="number"
            {...register('employee.termination_notice_period', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="work_permit_number">Work Permit Number</Label>
          <Input 
            id="work_permit_number" 
            {...register('employee.work_permit_number')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="work_pass_expiry_date">Work Pass Expiry Date</Label>
          <Input 
            id="work_pass_expiry_date" 
            type="date"
            {...register('employee.work_pass_expiry_date')}
            disabled={isViewOnly}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="cpf_contribution"
            {...register('employee.cpf_contribution')}
            disabled={isViewOnly}
          />
          <Label htmlFor="cpf_contribution">CPF Contribution</Label>
        </div>
        
        <div>
          <Label htmlFor="cpf_account_number">CPF Account Number</Label>
          <Input 
            id="cpf_account_number" 
            {...register('employee.cpf_account_number')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="tax_identification_number">Tax Identification Number</Label>
          <Input 
            id="tax_identification_number" 
            {...register('employee.tax_identification_number')}
            disabled={isViewOnly}
          />
        </div>
      </div>
    </div>
  );
};
