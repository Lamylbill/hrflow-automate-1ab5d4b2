import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { EmployeeFormData } from '@/types/employee';

interface PersonalInfoTabProps {
  isViewOnly?: boolean;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label className="font-bold" htmlFor="employee_code">Employee Code</Label>
          <Input 
            id="employee_code" 
            {...register('employee.employee_code')}
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
        
        <div>
          <Label className="font-bold" htmlFor="title">Title</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => {
              // This would typically be handled by a controller component
            }}
            defaultValue={control._defaultValues.employee?.title || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr">Mr</SelectItem>
              <SelectItem value="Mrs">Mrs</SelectItem>
              <SelectItem value="Ms">Ms</SelectItem>
              <SelectItem value="Dr">Dr</SelectItem>
              <SelectItem value="Prof">Prof</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="first_name" className="font-medium">First Name</Label>
          <Input 
            id="first_name" 
            {...register('employee.first_name')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="last_name" className="font-medium">Last Name</Label>
          <Input 
            id="last_name" 
            {...register('employee.last_name')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="middle_name">Middle Name</Label>
          <Input 
            id="middle_name" 
            {...register('employee.middle_name')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="full_name" className="font-medium">Full Name</Label>
          <Input 
            id="full_name" 
            {...register('employee.full_name', { required: "Full name is required" })}
            disabled={isViewOnly}
          />
          {errors.employee?.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.employee.full_name.message}</p>
          )}
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="alias_name">Alias Name</Label>
          <Input 
            id="alias_name" 
            {...register('employee.alias_name')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="local_name">Local Name</Label>
          <Input 
            id="local_name" 
            {...register('employee.local_name')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="gender">Gender</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => {
              // This would typically be handled by a controller component
            }}
            defaultValue={control._defaultValues.employee?.gender || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="nationality">Nationality</Label>
          <Input 
            id="nationality" 
            {...register('employee.nationality')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="identity_no">Identity No</Label>
          <Input 
            id="identity_no" 
            {...register('employee.identity_no')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="date_of_birth">Birth Date</Label>
          <Input 
            id="date_of_birth" 
            type="date"
            {...register('employee.date_of_birth')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="birth_place">Birth Place</Label>
          <Input 
            id="birth_place" 
            {...register('employee.birth_place')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="marital_status">Marital Status</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => {
              // This would typically be handled by a controller component
            }}
            defaultValue={control._defaultValues.employee?.marital_status || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Married">Married</SelectItem>
              <SelectItem value="Divorced">Divorced</SelectItem>
              <SelectItem value="Widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="marriage_date">Marriage Date</Label>
          <Input 
            id="marriage_date" 
            type="date"
            {...register('employee.marriage_date')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="no_of_children">No of Children</Label>
          <Input 
            id="no_of_children" 
            type="number"
            {...register('employee.no_of_children', { 
              valueAsNumber: true,
              min: { value: 0, message: "Value must be positive" }
            })}
            disabled={isViewOnly}
          />
          {errors.employee?.no_of_children && (
            <p className="text-red-500 text-sm mt-1">{errors.employee.no_of_children.message}</p>
          )}
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="retire_age">Retire Age</Label>
          <Input 
            id="retire_age" 
            type="number"
            {...register('employee.retire_age', { 
              valueAsNumber: true,
              min: { value: 0, message: "Value must be positive" }
            })}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="ethnic_origin">Ethnic Origin</Label>
          <Input 
            id="ethnic_origin" 
            {...register('employee.ethnic_origin')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="religion">Religion</Label>
          <Input 
            id="religion" 
            {...register('employee.religion')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="qualification">Qualification</Label>
          <Input 
            id="qualification" 
            {...register('employee.qualification')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="web_role">Web Role</Label>
          <Input 
            id="web_role" 
            {...register('employee.web_role')}
            disabled={isViewOnly}
          />
        </div>
      </div>
    </div>
  );
};
