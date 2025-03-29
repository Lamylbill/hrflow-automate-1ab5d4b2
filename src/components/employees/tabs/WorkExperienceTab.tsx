
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui-custom/Button';
import { Plus, Trash } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { EmployeeFormData, EmployeeWorkExperience } from '@/types/employee';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WorkExperienceTabProps {
  isViewOnly?: boolean;
}

export const WorkExperienceTab: React.FC<WorkExperienceTabProps> = ({ isViewOnly = false }) => {
  const { control, register, watch, setValue, formState: { errors } } = useFormContext<EmployeeFormData>();
  const [experiences, setExperiences] = useState<Partial<EmployeeWorkExperience>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Get the employee data from form context
  const employeeData = watch('employee');
  
  // Load existing work experiences if we're in edit mode
  useEffect(() => {
    if (employeeData?.id && !isViewOnly) {
      fetchWorkExperiences();
    }
  }, [employeeData?.id]);
  
  const fetchWorkExperiences = async () => {
    if (!employeeData?.id) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('employee_work_experience')
        .select('*')
        .eq('employee_id', employeeData.id);
        
      if (error) throw error;
      
      setExperiences(data || []);
      setValue('workExperience', data || []);
    } catch (error: any) {
      console.error('Error fetching work experiences:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load work experiences',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addExperience = () => {
    const newExperiences = [...experiences, {
      company_name: '',
      job_title: '',
      date_start: '',
      date_end: '',
    }];
    
    setExperiences(newExperiences);
    setValue('workExperience', newExperiences as EmployeeWorkExperience[]);
  };
  
  const removeExperience = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
    setValue('workExperience', newExperiences as EmployeeWorkExperience[]);
  };
  
  const handleExperienceChange = (index: number, field: keyof EmployeeWorkExperience, value: any) => {
    const newExperiences = [...experiences];
    if (newExperiences[index]) {
      newExperiences[index] = {
        ...newExperiences[index],
        [field]: value
      };
      
      setExperiences(newExperiences);
      setValue('workExperience', newExperiences as EmployeeWorkExperience[]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold" className="text-lg font-bold font-medium">Work Experience</h3>
        {!isViewOnly && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addExperience}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Work Experience
          </Button>
        )}
      </div>
      
      {experiences.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 border rounded-md">
          <p className="text-gray-500">No work experience records added yet.</p>
          {!isViewOnly && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={addExperience}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Work Experience
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Date Start</TableHead>
                <TableHead>Date End</TableHead>
                {!isViewOnly && <TableHead className="w-[80px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.map((experience, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      value={experience.company_name || ''}
                      onChange={(e) => handleExperienceChange(index, 'company_name', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={experience.job_title || ''}
                      onChange={(e) => handleExperienceChange(index, 'job_title', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="date"
                      value={experience.date_start || ''}
                      onChange={(e) => handleExperienceChange(index, 'date_start', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="date"
                      value={experience.date_end || ''}
                      onChange={(e) => handleExperienceChange(index, 'date_end', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  {!isViewOnly && (
                    <TableCell>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeExperience(index)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
