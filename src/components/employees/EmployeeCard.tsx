
import React from 'react';
import { Edit, Trash, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui-custom/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/types/employee';

interface EmployeeCardProps { 
  employee: Employee,
  onViewDetails: (employee: Employee) => void,
  onEdit: (employee: Employee) => void,
  onDelete: (employee: Employee) => void,
  isMultiSelectMode?: boolean,
  isSelected?: boolean,
  onToggleSelect?: () => void,
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee,
  onViewDetails,
  onEdit,
  onDelete,
  isMultiSelectMode = false,
  isSelected = false,
  onToggleSelect
}) => {
  // Generate initials from full name
  const getInitials = (name: string | undefined) => {
    if (!name) return '?';
    return name.split(' ').map(n => n?.[0]).join('').toUpperCase();
  };

  const handleClick = () => {
    if (isMultiSelectMode && onToggleSelect) {
      onToggleSelect();
    } else {
      onViewDetails(employee);
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow border p-4 hover:shadow-md transition-shadow cursor-pointer 
        ${isMultiSelectMode && isSelected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : ''}
      `}
      onClick={handleClick}
    >
      {isMultiSelectMode && (
        <div className="flex justify-end mb-2" onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={onToggleSelect} 
          />
        </div>
      )}
      
      <div className="flex items-center mb-3">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={employee.profile_photo || employee.profile_picture} alt={employee.full_name} />
          <AvatarFallback className="bg-hrflow-blue text-white">
            {getInitials(employee.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h3 className="font-medium text-base">{employee.full_name}</h3>
          <p className="text-sm text-gray-500">{employee.job_title || 'No Job Title'}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="text-sm">
          <span className="text-gray-500">Department:</span> {employee.department || 'N/A'}
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Email:</span> {employee.email}
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Status:</span> <Badge variant={
            employee.employment_status === 'Active' ? 'success' :
            employee.employment_status === 'On Leave' ? 'warning' :
            employee.employment_status === 'Resigned' ? 'destructive' : 'outline'
          }>
            {employee.employment_status || 'Unknown'}
          </Badge>
        </div>
      </div>
      
      <div className="flex justify-end gap-1 border-t pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="px-2"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(employee);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="px-2 text-red-500 hover:text-red-700"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(employee);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
