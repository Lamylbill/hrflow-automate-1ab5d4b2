
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';

interface AddressTabProps {
  isViewOnly?: boolean;
}

export const AddressTab: React.FC<AddressTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="font-bold" htmlFor="address_type">Address Type</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => {
              // This would typically be handled by a controller component
            }}
            defaultValue={control._defaultValues.employee?.address_type || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select address type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Permanent">Permanent</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Mailing">Mailing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="address_line_1">Address Line 1</Label>
          <Input 
            id="address_line_1" 
            {...register('employee.address_line_1')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="address_line_2">Address Line 2</Label>
          <Input 
            id="address_line_2" 
            {...register('employee.address_line_2')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="city">City</Label>
          <Input 
            id="city" 
            {...register('employee.city')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="postal_code">Postal Code</Label>
          <Input 
            id="postal_code" 
            {...register('employee.postal_code')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="country_region">Country/Region</Label>
          <Input 
            id="country_region" 
            {...register('employee.country_region')}
            disabled={isViewOnly}
          />
        </div>
        
        <div className="md:col-span-2">
          <Label className="font-bold" htmlFor="home_address">Full Address (Legacy)</Label>
          <Textarea 
            id="home_address" 
            {...register('employee.home_address')}
            disabled={isViewOnly}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
