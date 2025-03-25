
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeFormData } from '@/types/employee';

interface EmergencyContactTabProps {
  isViewOnly?: boolean;
}

export const EmergencyContactTab: React.FC<EmergencyContactTabProps> = ({ isViewOnly = false }) => {
  const { register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="emergency_contact_name">Contact Name</Label>
          <Input 
            id="emergency_contact_name" 
            {...register('employee.emergency_contact_name')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="emergency_relationship">Relationship</Label>
          <Input 
            id="emergency_relationship" 
            {...register('employee.emergency_relationship')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="emergency_contact_phone">Mobile No</Label>
          <Input 
            id="emergency_contact_phone" 
            {...register('employee.emergency_contact_phone')}
            disabled={isViewOnly}
          />
        </div>
      </div>
    </div>
  );
};
