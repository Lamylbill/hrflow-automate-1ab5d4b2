
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AddEmployeeForm } from '@/components/employees/AddEmployeeForm';
import { DocumentManager } from '@/components/employees/documents/DocumentManager';
import { Employee } from '@/types/employee';
import { formatPhoneNumber, formatSalary, formatDate } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

interface EmployeeDetailsTabsProps {
  employee: Employee;
  onSuccess: () => void;
  onCancel: () => void;
  isViewOnly?: boolean;
}

export const EmployeeDetailsTabs: React.FC<EmployeeDetailsTabsProps> = ({
  employee,
  onSuccess,
  onCancel,
  isViewOnly = false
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [refreshDocuments, setRefreshDocuments] = useState(0);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'documents') {
      setRefreshDocuments(prev => prev + 1);
    }
  };

  // View mode content for each tab
  const renderViewContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{employee.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(employee.date_of_birth)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{employee.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-medium">{employee.nationality || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Identity Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tax Identification Number</p>
                  <p className="font-medium">{employee.tax_identification_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Work Permit Number</p>
                  <p className="font-medium">{employee.work_permit_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Work Pass Expiry Date</p>
                  <p className="font-medium">{formatDate(employee.work_pass_expiry_date)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'employment':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Employment Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Job Title</p>
                  <p className="font-medium">{employee.job_title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{employee.department || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment Type</p>
                  <p className="font-medium">{employee.employment_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment Status</p>
                  <p className="font-medium">{employee.employment_status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Hire</p>
                  <p className="font-medium">{formatDate(employee.date_of_hire)}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Employee Code</p>
                  <p className="font-medium">{employee.employee_code || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Probation Status</p>
                  <p className="font-medium">{employee.probation_status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contract Signed</p>
                  <p className="font-medium">{employee.contract_signed ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Exit</p>
                  <p className="font-medium">{formatDate(employee.date_of_exit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{employee.notes || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{employee.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{formatPhoneNumber(employee.phone_number) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Home Address</p>
                  <p className="font-medium">{employee.home_address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Postal Code</p>
                  <p className="font-medium">{employee.postal_code || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Emergency Contact</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact Name</p>
                  <p className="font-medium">{employee.emergency_contact_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact Phone</p>
                  <p className="font-medium">{formatPhoneNumber(employee.emergency_contact_phone) || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'financial':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Compensation</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">{formatSalary(employee.salary) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CPF Contribution</p>
                  <p className="font-medium">{employee.cpf_contribution ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CPF Account Number</p>
                  <p className="font-medium">{employee.cpf_account_number || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Banking Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Bank Name</p>
                  <p className="font-medium">{employee.bank_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bank Account Number</p>
                  <p className="font-medium">{employee.bank_account_number || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'benefits':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Leave</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Leave Entitlement</p>
                  <p className="font-medium">{employee.leave_entitlement || 0} days/year</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Leave Balance</p>
                  <p className="font-medium">{employee.leave_balance || 0} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Medical Entitlement</p>
                  <p className="font-medium">{employee.medical_entitlement || 0} days/year</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Performance & Benefits</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Last Performance Review</p>
                  <p className="font-medium">{formatDate(employee.last_performance_review)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Performance Score</p>
                  <p className="font-medium">{employee.performance_score || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Benefits Enrolled</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {employee.benefits_enrolled && employee.benefits_enrolled.length > 0 ? (
                      employee.benefits_enrolled.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="mr-1 mb-1">
                          {benefit}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'documents':
        return null; // DocumentManager will be rendered directly in the tab content
      default:
        return <div>Select a tab to view employee information</div>;
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-6 mb-6">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="employment">Employment</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="financial">Financial</TabsTrigger>
        <TabsTrigger value="benefits">Benefits</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      
      {!isViewOnly ? (
        <>
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
        </>
      ) : (
        <>
          <TabsContent value="personal" className="pt-2">
            {renderViewContent()}
          </TabsContent>
          
          <TabsContent value="employment" className="pt-2">
            {renderViewContent()}
          </TabsContent>
          
          <TabsContent value="contact" className="pt-2">
            {renderViewContent()}
          </TabsContent>
          
          <TabsContent value="financial" className="pt-2">
            {renderViewContent()}
          </TabsContent>
          
          <TabsContent value="benefits" className="pt-2">
            {renderViewContent()}
          </TabsContent>
        </>
      )}
      
      <TabsContent value="documents" className="pt-2">
        <DocumentManager 
          employeeId={employee.id || ''}
          refreshTrigger={refreshDocuments}
        />
      </TabsContent>
    </Tabs>
  );
};
