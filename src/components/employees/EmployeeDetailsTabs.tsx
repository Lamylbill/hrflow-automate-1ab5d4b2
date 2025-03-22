
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
      <TabsList className="grid grid-cols-5 mb-6">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="employment">Employment</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="financial">Financial</TabsTrigger>
        <TabsTrigger value="benefits">Benefits</TabsTrigger>
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
      
      <TabsContent value="contact" className="pt-2">
        <AddEmployeeForm 
          employeeData={employee}
          onSuccess={onSuccess}
          onCancel={onCancel}
          isTabbed={true}
          activeTab="contact"
        />
      </TabsContent>
      
      <TabsContent value="financial" className="pt-2">
        <AddEmployeeForm 
          employeeData={employee}
          onSuccess={onSuccess}
          onCancel={onCancel}
          isTabbed={true}
          activeTab="financial"
        />
      </TabsContent>
      
      <TabsContent value="benefits" className="pt-2">
        <AddEmployeeForm 
          employeeData={employee}
          onSuccess={onSuccess}
          onCancel={onCancel}
          isTabbed={true}
          activeTab="benefits"
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
