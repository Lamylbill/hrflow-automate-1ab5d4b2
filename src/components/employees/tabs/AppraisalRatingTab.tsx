
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
import { Textarea } from '@/components/ui/textarea';
import { EmployeeFormData, EmployeeAppraisalRating } from '@/types/employee';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppraisalRatingTabProps {
  isViewOnly?: boolean;
}

export const AppraisalRatingTab: React.FC<AppraisalRatingTabProps> = ({ isViewOnly = false }) => {
  const { control, register, watch, setValue, formState: { errors } } = useFormContext<EmployeeFormData>();
  const [appraisals, setAppraisals] = useState<Partial<EmployeeAppraisalRating>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const employeeId = watch('employee.id');
  
  // Load existing appraisal ratings if we're in edit mode
  useEffect(() => {
    if (employeeId && !isViewOnly) {
      fetchAppraisalRatings();
    }
  }, [employeeId]);
  
  const fetchAppraisalRatings = async () => {
    if (!employeeId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('employee_appraisal_ratings')
        .select('*')
        .eq('employee_id', employeeId);
        
      if (error) throw error;
      
      setAppraisals(data || []);
      setValue('appraisalRatings', data || []);
    } catch (error: any) {
      console.error('Error fetching appraisal ratings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load appraisal ratings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addAppraisal = () => {
    const newAppraisals = [...appraisals, {
      date_start: '',
      appraisal_type: '',
      rating: '',
      remarks: ''
    }];
    
    setAppraisals(newAppraisals);
    setValue('appraisalRatings', newAppraisals);
  };
  
  const removeAppraisal = (index: number) => {
    const newAppraisals = [...appraisals];
    newAppraisals.splice(index, 1);
    setAppraisals(newAppraisals);
    setValue('appraisalRatings', newAppraisals);
  };
  
  const handleAppraisalChange = (index: number, field: keyof EmployeeAppraisalRating, value: any) => {
    const newAppraisals = [...appraisals];
    newAppraisals[index] = {
      ...newAppraisals[index],
      [field]: value
    };
    
    setAppraisals(newAppraisals);
    setValue('appraisalRatings', newAppraisals);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Appraisal Ratings</h3>
        {!isViewOnly && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addAppraisal}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Appraisal Rating
          </Button>
        )}
      </div>
      
      {appraisals.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 border rounded-md">
          <p className="text-gray-500">No appraisal ratings added yet.</p>
          {!isViewOnly && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={addAppraisal}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Appraisal Rating
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Start</TableHead>
                <TableHead>Appraisal Type</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Remarks</TableHead>
                {!isViewOnly && <TableHead className="w-[80px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {appraisals.map((appraisal, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      type="date"
                      value={appraisal.date_start || ''}
                      onChange={(e) => handleAppraisalChange(index, 'date_start', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={appraisal.appraisal_type || ''}
                      onChange={(e) => handleAppraisalChange(index, 'appraisal_type', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={appraisal.rating || ''}
                      onChange={(e) => handleAppraisalChange(index, 'rating', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={appraisal.remarks || ''}
                      onChange={(e) => handleAppraisalChange(index, 'remarks', e.target.value)}
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
                        onClick={() => removeAppraisal(index)}
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
