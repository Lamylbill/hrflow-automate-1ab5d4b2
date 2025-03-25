
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
import { EmployeeFormData, EmployeeFamilyMember } from '@/types/employee';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FamilyTabProps {
  isViewOnly?: boolean;
}

export const FamilyTab: React.FC<FamilyTabProps> = ({ isViewOnly = false }) => {
  const { control, register, watch, setValue, formState: { errors } } = useFormContext<EmployeeFormData>();
  const [familyMembers, setFamilyMembers] = useState<Partial<EmployeeFamilyMember>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const employeeId = watch('employee.id');
  
  // Load existing family members if we're in edit mode
  useEffect(() => {
    if (employeeId && !isViewOnly) {
      fetchFamilyMembers();
    }
  }, [employeeId]);
  
  const fetchFamilyMembers = async () => {
    if (!employeeId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('employee_family_members')
        .select('*')
        .eq('employee_id', employeeId);
        
      if (error) throw error;
      
      setFamilyMembers(data || []);
      setValue('familyMembers', data || []);
    } catch (error: any) {
      console.error('Error fetching family members:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load family members',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addFamilyMember = () => {
    const newFamilyMembers = [...familyMembers, {
      name: '',
      relationship: '',
      date_of_birth: '',
      contact_number: '',
      notes: ''
    }];
    
    setFamilyMembers(newFamilyMembers);
    setValue('familyMembers', newFamilyMembers);
  };
  
  const removeFamilyMember = (index: number) => {
    const newFamilyMembers = [...familyMembers];
    newFamilyMembers.splice(index, 1);
    setFamilyMembers(newFamilyMembers);
    setValue('familyMembers', newFamilyMembers);
  };
  
  const handleFamilyMemberChange = (index: number, field: keyof EmployeeFamilyMember, value: any) => {
    const newFamilyMembers = [...familyMembers];
    newFamilyMembers[index] = {
      ...newFamilyMembers[index],
      [field]: value
    };
    
    setFamilyMembers(newFamilyMembers);
    setValue('familyMembers', newFamilyMembers);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Family Members</h3>
        {!isViewOnly && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addFamilyMember}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Family Member
          </Button>
        )}
      </div>
      
      {familyMembers.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 border rounded-md">
          <p className="text-gray-500">No family members added yet.</p>
          {!isViewOnly && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={addFamilyMember}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Family Member
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Notes</TableHead>
                {!isViewOnly && <TableHead className="w-[80px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {familyMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      value={member.name || ''}
                      onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={member.relationship || ''}
                      onChange={(e) => handleFamilyMemberChange(index, 'relationship', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="date"
                      value={member.date_of_birth || ''}
                      onChange={(e) => handleFamilyMemberChange(index, 'date_of_birth', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={member.contact_number || ''}
                      onChange={(e) => handleFamilyMemberChange(index, 'contact_number', e.target.value)}
                      disabled={isViewOnly}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={member.notes || ''}
                      onChange={(e) => handleFamilyMemberChange(index, 'notes', e.target.value)}
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
                        onClick={() => removeFamilyMember(index)}
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
