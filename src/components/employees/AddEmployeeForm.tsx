
import React from 'react';
import { EmployeeTabbedForm } from './EmployeeTabbedForm';
import { EmployeeFormData, Employee } from '@/types/employee';

interface AddEmployeeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  employeeData?: Employee; 
  isTabbed?: boolean;
  activeTab?: string;
}

export const AddEmployeeForm = ({ 
  onSuccess, 
  onCancel, 
  employeeData,
  isTabbed,
  activeTab 
}: AddEmployeeFormProps) => {
  return (
    <div className="max-h-[80vh] overflow-hidden flex flex-col">
      <EmployeeTabbedForm
        mode={employeeData ? "edit" : "create"}
        initialData={employeeData ? { employee: employeeData } : undefined}
        onSuccess={() => onSuccess()}
        onCancel={onCancel}
        isViewOnly={false}
        defaultTab={activeTab}
      />
    </div>
  );
};
