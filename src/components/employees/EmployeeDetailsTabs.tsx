
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AddEmployeeForm } from '@/components/employees/AddEmployeeForm';
import { DocumentManager } from '@/components/employees/documents/DocumentManager';
import { Employee } from '@/types/employee';

interface EmployeeDetailsTabsProps {
  employee: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmployeeDetailsTabs: React.FC<EmployeeDetailsTabsProps> = ({
  employee,
  onSuccess,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [refreshDocuments, setRefreshDocuments] = useState(0);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'documents') {
      setRefreshDocuments(prev => prev + 1);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="employment">Employment</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal" className="pt-2">
        <AddEmployeeForm 
          employeeData={employee}
          onSuccess={onSuccess}
          onCancel={onCancel}
          isTabbed={true}
          activeTab="personal"
        />
      </TabsContent>
      
      <TabsContent value="employment" className="pt-2">
        <AddEmployeeForm 
          employeeData={employee}
          onSuccess={onSuccess}
          onCancel={onCancel}
          isTabbed={true}
          activeTab="employment"
        />
      </TabsContent>
      
      <TabsContent value="documents" className="pt-2">
        <DocumentManager 
          employeeId={employee.id || ''}
          refreshTrigger={refreshDocuments}
        />
      </TabsContent>
    </Tabs>
  );
};
