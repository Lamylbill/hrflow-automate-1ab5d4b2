
import React, { useEffect } from 'react';
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
  // Convert tab names between different formats if needed
  const getDefaultTab = (tab?: string): string => {
    // Map old tab names to new tab structure if coming from old structure
    if (!tab) return 'basic-info';
    
    const tabMapping: Record<string, string> = {
      'personal': 'basic-info',
      'employment': 'job-details',
      'assignment': 'job-details',
      'contract': 'job-details',
      'statutory': 'compliance',
      'salary': 'compensation',
      'allowance': 'compensation',
      'attendance': 'job-details',
      'address': 'basic-info',
      'family': 'others',
      'emergency': 'others',
      'education': 'others',
      'workExperience': 'others',
      'other': 'others',
      'appraisal': 'others',
      'documents': 'documents'
    };
    
    return tabMapping[tab] || tab;
  };
  
  return (
    <div className="max-h-[80vh] overflow-hidden flex flex-col">
      <EmployeeTabbedForm
        mode={employeeData ? "edit" : "create"}
        initialData={employeeData ? { employee: employeeData } : undefined}
        onSuccess={() => onSuccess()}
        onCancel={onCancel}
        isViewOnly={false}
        defaultTab={getDefaultTab(activeTab)}
      />
    </div>
  );
};
