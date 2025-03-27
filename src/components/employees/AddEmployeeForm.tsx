import React from 'react';
import { EmployeeTabbedForm } from './EmployeeTabbedForm';
import { Employee } from '@/types/employee';

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
  const getDefaultTab = (tab?: string): string => {
    const tabMapping: Record<string, string> = {
      personal: 'basic-info',
      employment: 'job-details',
      compensation: 'compensation',
      statutory: 'compliance',
      documents: 'documents',
      other: 'others',
    };
    return tabMapping[tab || ''] || 'basic-info';
  };

  return (
    <div className="max-h-[80vh] overflow-hidden flex flex-col">
      <EmployeeTabbedForm
        mode={employeeData ? 'edit' : 'create'}
        initialData={employeeData ? { employee: employeeData } : undefined}
        onSuccess={onSuccess}
        onCancel={onCancel}
        isViewOnly={false}
        defaultTab={getDefaultTab(activeTab)}
      />
    </div>
  );
};
