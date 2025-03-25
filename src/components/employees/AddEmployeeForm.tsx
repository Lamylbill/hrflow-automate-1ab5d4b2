
import React from 'react';
import { EmployeeTabbedForm } from './EmployeeTabbedForm';
import { EmployeeFormData } from '@/types/employee';

interface AddEmployeeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddEmployeeForm = ({ onSuccess, onCancel }: AddEmployeeFormProps) => {
  return (
    <div className="max-h-[80vh] overflow-hidden flex flex-col">
      <EmployeeTabbedForm
        mode="create"
        onSuccess={() => onSuccess()}
        onCancel={onCancel}
      />
    </div>
  );
};
