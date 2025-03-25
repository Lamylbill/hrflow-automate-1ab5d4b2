
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { EmployeeFormData } from '@/types/employee';
import { FieldsToggle } from './shared/FieldsToggle';
import { nsGroupOptions, vaccinationStatusOptions, skillOptions } from '../data/employeeOptions';

interface OthersTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const OthersTab: React.FC<OthersTabProps> = ({ 
  isViewOnly = false,
  showAdvancedFields,
  onToggleAdvanced
}) => {
  const { control, register } = useFormContext<EmployeeFormData>();

  const skillsOptions = skillOptions.map(skill => ({
    label: skill,
    value: skill
  }));

  return (
    <div className="space-y-6">
      <FieldsToggle 
        showAdvanced={showAdvancedFields} 
        onToggle={onToggleAdvanced} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
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
            <Label htmlFor="emergency_contact_phone">Mobile Number</Label>
            <Input
              id="emergency_contact_phone"
              {...register('employee.emergency_contact_phone')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label htmlFor="qualification">Education Qualification</Label>
            <Input
              id="qualification"
              {...register('employee.qualification')}
              disabled={isViewOnly}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="institute_name">Institute</Label>
            <Input
              id="institute_name"
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label htmlFor="skill_set">Skills</Label>
            <Controller
              name="employee.skill_set"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  disabled={isViewOnly}
                  selected={field.value || []}
                  options={skillsOptions}
                  onChange={field.onChange}
                  placeholder="Select skills"
                />
              )}
            />
          </div>

          <div>
            <Label htmlFor="ns_group">NS Group</Label>
            <Controller
              name="employee.ns_group"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select NS group" />
                  </SelectTrigger>
                  <SelectContent>
                    {nsGroupOptions.map(option => (
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
            <Label htmlFor="vaccination_status">Vaccination Status</Label>
            <Controller
              name="employee.vaccination_status"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
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
        </div>
      </div>

      {/* Advanced Fields */}
      {showAdvancedFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <Label htmlFor="graduation_year">Graduation Year</Label>
              <Input
                id="graduation_year"
                type="number"
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="major">Major</Label>
              <Input
                id="major"
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="group_hospital_surgical_plan">Group Hospital Plan</Label>
              <Input
                id="group_hospital_surgical_plan"
                {...register('employee.group_hospital_surgical_plan')}
                disabled={isViewOnly}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="group_personal_accident_plan">Accident Plan</Label>
              <Input
                id="group_personal_accident_plan"
                {...register('employee.group_personal_accident_plan')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="outpatient_medical_plan">Outpatient Medical</Label>
              <Input
                id="outpatient_medical_plan"
                {...register('employee.outpatient_medical_plan')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label htmlFor="thirteenth_month_entitlement">13th Month Eligibility</Label>
              <Controller
                name="employee.thirteenth_month_entitlement"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={isViewOnly}
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value !== undefined ? String(field.value) : ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select eligibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Eligible</SelectItem>
                      <SelectItem value="false">Not Eligible</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('employee.notes')}
          disabled={isViewOnly}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};
