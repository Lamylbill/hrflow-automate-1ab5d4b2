
import React from 'react';
import { EmployeeTabbedForm } from './EmployeeTabbedForm';
import { EmployeeFormData, Employee } from '@/types/employee';

interface AddEmployeeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  employeeData?: Employee; // Add this prop to make it compatible with EmployeeDetailsTabs
  isTabbed?: boolean; // Add this prop to support tabbed mode
  activeTab?: string; // Add this prop to support active tab selection
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
      />
    </div>
  );
};
