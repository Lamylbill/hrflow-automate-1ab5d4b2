
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
import { EmployeeFormData, EmployeeAllowance } from '@/types/employee';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AllowanceTabProps {
  isViewOnly?: boolean;
}

export const AllowanceTab: React.FC<AllowanceTabProps> = ({ isViewOnly = false }) => {
  const { control, register, watch, setValue, formState: { errors } } = useFormContext<EmployeeFormData>();
  const [allowances, setAllowances] = useState<Partial<EmployeeAllowance>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const employeeId = watch('employee.id');
  
  // Load existing allowances if we're in edit mode
  useEffect(() => {
    if (employeeId && !isViewOnly) {
      fetchAllowances();
    }
  }, [employeeId]);
  
  const fetchAllowances = async () => {
    if (!employeeId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('employee_allowances')
        .select('*')
        .eq('employee_id', employeeId);
        
      if (error) throw error;
      
      setAllowances(data || []);
      setValue('allowances', data || []);
    } catch (error: any) {
      console.error('Error fetching allowances:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load allowances',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addAllowance = () => {
    const newAllowances = [...allowances, {
      allowance_type: '',
      date_start: '',
      date_end: '',
      amount: 0,
      currency: '',
      run_type: '',
      bi_monthly_option: '',
      pay_batch: ''
    }];
    
    setAllowances(newAllowances);
    setValue('allowances', newAllowances);
  };
  
  const removeAllowance = (index: number) => {
    const newAllowances = [...allowances];
    newAllowances.splice(index, 1);
    setAllowances(newAllowances);
    setValue('allowances', newAllowances);
  };
  
  const handleAllowanceChange = (index: number, field: keyof EmployeeAllowance, value: any) => {
    const newAllowances = [...allowances];
    newAllowances[index] = {
      ...newAllowances[index],
      [field]: value
    };
    
    setAllowances(newAllowances);
    setValue('allowances', newAllowances);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Allowances</h3>
        {!isViewOnly && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addAllowance}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Allowance
          </Button>
        )}
      </div>
      
      {allowances.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 border rounded-md">
          <p className="text-gray-500">No allowances added yet.</p>
          {!isViewOnly && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={addAllowance}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Allowance
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Allowance Type</TableHead>
                <TableHead>Date Start</TableHead>
                <TableHead>Date End</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Run Type</TableHead>
                <TableHead>Bi-Monthly Option</TableHead>
                <TableHead>Pay Batch</TableHead>
                {!isViewOnly && <TableHead className="w-[80px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allowances.map((allowance, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      value={allowance.allowance_type || ''}
                      onChange={(e) => handleAllowanceChange(index, 'allowance_type', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="date"
                      value={allowance.date_start || ''}
                      onChange={(e) => handleAllowanceChange(index, 'date_start', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="date"
                      value={allowance.date_end || ''}
                      onChange={(e) => handleAllowanceChange(index, 'date_end', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      step="0.01"
                      value={allowance.amount || 0}
                      onChange={(e) => handleAllowanceChange(index, 'amount', parseFloat(e.target.value))}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={allowance.currency || ''}
                      onChange={(e) => handleAllowanceChange(index, 'currency', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={allowance.run_type || ''}
                      onChange={(e) => handleAllowanceChange(index, 'run_type', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={allowance.bi_monthly_option || ''}
                      onChange={(e) => handleAllowanceChange(index, 'bi_monthly_option', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={allowance.pay_batch || ''}
                      onChange={(e) => handleAllowanceChange(index, 'pay_batch', e.target.value)}
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
                        onClick={() => removeAllowance(index)}
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
