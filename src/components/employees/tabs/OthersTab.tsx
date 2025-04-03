
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';
import { skillOptions, nsStatusOptions, vaccinationStatusOptions } from '../data/employeeOptions';

interface OthersTabProps {
  isViewOnly?: boolean;
}

export const OthersTab: React.FC<OthersTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Personal Attributes */}
        <div className="col-span-full">
          <h3 className="text-lg font-semibold mb-4">Personal Attributes</h3>
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="qualificationField">Qualification</Label>
          <Input 
            id="qualificationField"
            {...register('employee.qualification')} 
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="skillSet">Skill Set</Label>
          <Controller
            name="employee.skill_set"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={skillOptions}
                selected={field.value || []}
                onChange={(selected) => field.onChange(selected)}
                disabled={isViewOnly}
                placeholder="Select skills..."
              />
            )}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="nsGroup">NS Status</Label>
          <Controller
            name="employee.ns_group"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select NS status" />
                </SelectTrigger>
                <SelectContent>
                  {nsStatusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <div className="col-span-full">
          <h3 className="text-lg font-semibold mb-4 mt-4">Health & Medical</h3>
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="vaccinationStatus">Vaccination Status</Label>
          <Controller
            name="employee.vaccination_status"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vaccination status" />
                </SelectTrigger>
                <SelectContent>
                  {vaccinationStatusOptions.map(option => (
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
          <Label className="font-bold" htmlFor="medicalEntitlement">Medical Entitlement</Label>
          <Input 
            id="medicalEntitlement"
            type="number"
            step="0.01"
            {...register('employee.medical_entitlement', { valueAsNumber: true })} 
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="outpatientMedicalPlan">Outpatient Medical Plan</Label>
          <Input 
            id="outpatientMedicalPlan"
            {...register('employee.outpatient_medical_plan')} 
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="groupHospitalSurgicalPlan">Group Hospital & Surgical Plan</Label>
          <Input 
            id="groupHospitalSurgicalPlan"
            {...register('employee.group_hospital_surgical_plan')} 
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="groupPersonalAccidentPlan">Group Personal Accident Plan</Label>
          <Input 
            id="groupPersonalAccidentPlan"
            {...register('employee.group_personal_accident_plan')} 
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label className="font-bold" htmlFor="otherMedicalBenefit">Other Medical Benefits</Label>
          <Input 
            id="otherMedicalBenefit"
            {...register('employee.other_medical_benefit')} 
            disabled={isViewOnly}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Controller
            name="employee.thirteenth_month_entitlement"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="thirteenthMonthEntitlement"
                checked={field.value || false}
                onCheckedChange={field.onChange}
                disabled={isViewOnly}
              />
            )}
          />
          <Label className="font-bold" htmlFor="thirteenthMonthEntitlement">13th Month Entitlement</Label>
        </div>
        
        <div className="col-span-full mt-4">
          <Label className="font-bold" htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes"
            className="min-h-[120px]"
            {...register('employee.notes')} 
            disabled={isViewOnly}
          />
        </div>
      </div>
    </div>
  );
};
