
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
import { EmployeeFormData, EmployeeEducation } from '@/types/employee';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EducationTabProps {
  isViewOnly?: boolean;
}

export const EducationTab: React.FC<EducationTabProps> = ({ isViewOnly = false }) => {
  const { control, register, watch, setValue, formState: { errors } } = useFormContext<EmployeeFormData>();
  const [educationRecords, setEducationRecords] = useState<EmployeeEducation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Get the employee data from form context
  const employeeData = watch('employee');
  
  // Load existing education records if we're in edit mode
  useEffect(() => {
    if (employeeData.id && !isViewOnly) {
      fetchEducationRecords();
    }
  }, [employeeData.id]);
  
  const fetchEducationRecords = async () => {
    if (!employeeData.id) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('employee_education')
        .select('*')
        .eq('employee_id', employeeData.id);
        
      if (error) throw error;
      
      setEducationRecords(data || []);
      setValue('education', data || []);
    } catch (error: any) {
      console.error('Error fetching education records:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load education records',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addEducationRecord = () => {
    const newEducationRecords = [...educationRecords, {
      id: '',
      employee_id: employeeData.id || '',
      qualification: '',
      major: '',
      institute_name: '',
      graduation_year: undefined,
      created_at: '',
      updated_at: ''
    }];
    
    setEducationRecords(newEducationRecords);
    setValue('education', newEducationRecords);
  };
  
  const removeEducationRecord = (index: number) => {
    const newEducationRecords = [...educationRecords];
    newEducationRecords.splice(index, 1);
    setEducationRecords(newEducationRecords);
    setValue('education', newEducationRecords);
  };
  
  const handleEducationChange = (index: number, field: keyof EmployeeEducation, value: any) => {
    const newEducationRecords = [...educationRecords];
    newEducationRecords[index] = {
      ...newEducationRecords[index],
      [field]: value
    };
    
    setEducationRecords(newEducationRecords);
    setValue('education', newEducationRecords);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold font-medium">Education</h3>
        {!isViewOnly && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addEducationRecord}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        )}
      </div>
      
      {educationRecords.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 border rounded-md">
          <p className="text-gray-500">No education records added yet.</p>
          {!isViewOnly && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={addEducationRecord}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Education
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Qualification</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Institute Name</TableHead>
                <TableHead>Graduation Year</TableHead>
                {!isViewOnly && <TableHead className="w-[80px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {educationRecords.map((education, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      value={education.qualification || ''}
                      onChange={(e) => handleEducationChange(index, 'qualification', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={education.major || ''}
                      onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={education.institute_name || ''}
                      onChange={(e) => handleEducationChange(index, 'institute_name', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={education.graduation_year || ''}
                      onChange={(e) => handleEducationChange(index, 'graduation_year', parseInt(e.target.value))}
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
                        onClick={() => removeEducationRecord(index)}
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
