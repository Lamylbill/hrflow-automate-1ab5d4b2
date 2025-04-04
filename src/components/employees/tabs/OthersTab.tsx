
import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { EmployeeFormData } from '@/types/employee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface OptionType {
  value: string;
  label: string;
}

interface OthersTabProps {
  isViewOnly?: boolean;
}

export const OthersTab: React.FC<OthersTabProps> = ({ isViewOnly = false }) => {
  const { control, register, watch, setValue } = useFormContext<EmployeeFormData>();
  const [newSkill, setNewSkill] = useState('');
  
  const skillOptions: OptionType[] = [
    { value: 'React', label: 'React' },
    { value: 'Angular', label: 'Angular' },
    { value: 'Vue', label: 'Vue' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Python', label: 'Python' },
    { value: 'Java', label: 'Java' },
    { value: 'Project Management', label: 'Project Management' },
    { value: 'Leadership', label: 'Leadership' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Teamwork', label: 'Teamwork' },
  ];
  
  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const currentSkills: string[] = watch('employee.skill_set') || [];
    if (!currentSkills.includes(newSkill)) {
      setValue('employee.skill_set', [...currentSkills, newSkill]);
    }
    setNewSkill('');
  };
  
  const removeSkill = (skill: string) => {
    const currentSkills: string[] = watch('employee.skill_set') || [];
    setValue('employee.skill_set', currentSkills.filter(s => s !== skill));
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ns_group" className="font-bold">NS Group</Label>
          <Controller
            name="employee.ns_group"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select NS Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Group A</SelectItem>
                  <SelectItem value="B">Group B</SelectItem>
                  <SelectItem value="C">Group C</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <div>
          <Label htmlFor="vaccination_status" className="font-bold">Vaccination Status</Label>
          <Controller
            name="employee.vaccination_status"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isViewOnly}
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fully Vaccinated">Fully Vaccinated</SelectItem>
                  <SelectItem value="Partially Vaccinated">Partially Vaccinated</SelectItem>
                  <SelectItem value="Not Vaccinated">Not Vaccinated</SelectItem>
                  <SelectItem value="Medically Exempted">Medically Exempted</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <div>
          <Label htmlFor="group_hospital_surgical_plan" className="font-bold">Group Hospital & Surgical Plan</Label>
          <Input
            id="group_hospital_surgical_plan"
            disabled={isViewOnly}
            {...register('employee.group_hospital_surgical_plan')}
          />
        </div>
        
        <div>
          <Label htmlFor="group_personal_accident_plan" className="font-bold">Group Personal Accident Plan</Label>
          <Input
            id="group_personal_accident_plan"
            disabled={isViewOnly}
            {...register('employee.group_personal_accident_plan')}
          />
        </div>
        
        <div>
          <Label htmlFor="outpatient_medical_plan" className="font-bold">Outpatient Medical Plan</Label>
          <Input
            id="outpatient_medical_plan"
            disabled={isViewOnly}
            {...register('employee.outpatient_medical_plan')}
          />
        </div>
        
        <div className="md:col-span-2">
          <Label className="font-bold">Skills</Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add new skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              disabled={isViewOnly}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <Button 
              type="button" 
              onClick={addSkill}
              disabled={isViewOnly}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {(watch('employee.skill_set') || []).map(skill => (
              <div 
                key={skill} 
                className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
              >
                {skill}
                {!isViewOnly && (
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="ml-1 text-primary hover:text-primary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="notes" className="font-bold">Notes</Label>
          <Textarea
            id="notes"
            disabled={isViewOnly}
            {...register('employee.notes')}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};
