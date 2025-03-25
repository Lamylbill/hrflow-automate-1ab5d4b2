
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';

interface ContractTabProps {
  isViewOnly?: boolean;
}

export const ContractTab: React.FC<ContractTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="contract_date_start">Date Start</Label>
          <Input 
            id="contract_date_start" 
            type="date"
            {...register('employee.contract_date_start')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="contract_date_end">Date End</Label>
          <Input 
            id="contract_date_end" 
            type="date"
            {...register('employee.contract_date_end')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="contract_type">Contract Type</Label>
          <Input 
            id="contract_type" 
            {...register('employee.contract_type')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="contract_nature">Contract Nature</Label>
          <Input 
            id="contract_nature" 
            {...register('employee.contract_nature')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="renewal">Renewal</Label>
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
          <Label htmlFor="contract_signed">Contract Signed</Label>
        </div>
      </div>
    </div>
  );
};
