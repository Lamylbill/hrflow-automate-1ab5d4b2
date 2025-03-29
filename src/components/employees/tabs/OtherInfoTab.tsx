
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';

interface OtherInfoTabProps {
  isViewOnly?: boolean;
}

export const OtherInfoTab: React.FC<OtherInfoTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label className="font-bold" htmlFor="skill_set">Skill Set</Label>
          <Input 
            id="skill_set" 
            {...register('employee.skill_set')}
            placeholder="Comma-separated list of skills"
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="ns_group">NS Group</Label>
          <Input 
            id="ns_group" 
            {...register('employee.ns_group')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="vaccination_status">Vaccination Status</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => {
              // This would typically be handled by a controller component
            }}
            defaultValue={control._defaultValues.employee?.vaccination_status || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fully Vaccinated">Fully Vaccinated</SelectItem>
              <SelectItem value="Partially Vaccinated">Partially Vaccinated</SelectItem>
              <SelectItem value="Not Vaccinated">Not Vaccinated</SelectItem>
              <SelectItem value="Exempted">Exempted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="group_hospital_surgical_plan">Group Hospital and Surgical Plan</Label>
          <Input 
            id="group_hospital_surgical_plan" 
            {...register('employee.group_hospital_surgical_plan')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="group_personal_accident_plan">Group Personal and Accident Plan</Label>
          <Input 
            id="group_personal_accident_plan" 
            {...register('employee.group_personal_accident_plan')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="outpatient_medical_plan">Outpatient Medical Plan</Label>
          <Input 
            id="outpatient_medical_plan" 
            {...register('employee.outpatient_medical_plan')}
            disabled={isViewOnly}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="thirteenth_month_entitlement"
            {...register('employee.thirteenth_month_entitlement')}
            disabled={isViewOnly}
          />
          <Label className="font-bold" htmlFor="thirteenth_month_entitlement">13th Month Entitlement</Label>
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="benefits_enrolled">Benefits Enrolled</Label>
          <Input 
            id="benefits_enrolled" 
            {...register('employee.benefits_enrolled')}
            placeholder="Comma-separated list of benefits"
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="probation_status">Probation Status</Label>
          <Select 
            disabled={isViewOnly}
            onValueChange={(value) => {
              // This would typically be handled by a controller component
            }}
            defaultValue={control._defaultValues.employee?.probation_status || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="On Probation">On Probation</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Extended">Extended</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="last_performance_review">Last Performance Review</Label>
          <Input 
            id="last_performance_review" 
            type="date"
            {...register('employee.last_performance_review')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="performance_score">Performance Score</Label>
          <Input 
            id="performance_score" 
            type="number"
            step="0.1"
            {...register('employee.performance_score', { valueAsNumber: true })}
            disabled={isViewOnly}
          />
        </div>
        
        <div className="md:col-span-3">
          <Label className="font-bold" htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            {...register('employee.notes')}
            disabled={isViewOnly}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};
