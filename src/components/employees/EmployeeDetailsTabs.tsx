
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AddEmployeeForm } from '@/components/employees/AddEmployeeForm';
import { DocumentManager } from '@/components/employees/documents/DocumentManager';
import { Employee } from '@/types/employee';
import { formatPhoneNumber, formatSalary, formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui-custom/Button';
import { Edit, Save, Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [activeTab, setActiveTab] = useState('basic-info');
  const [refreshDocuments, setRefreshDocuments] = useState(0);
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'documents') {
      setRefreshDocuments(prev => prev + 1);
    }
  };

  // View mode content for each tab
  const renderViewContent = () => {
    switch (activeTab) {
      case 'basic-info':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {employee.full_name || [employee.first_name, employee.middle_name, employee.last_name].filter(Boolean).join(' ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{employee.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-medium">{employee.nationality || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(employee.date_of_birth)}</p>
                </div>
              </div>
            </div>
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
                  <p className="text-sm text-gray-500">Identity Number</p>
                  <p className="font-medium">{employee.identity_no || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marital Status</p>
                  <p className="font-medium">{employee.marital_status || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'job-details':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Employment Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Date of Hire</p>
                  <p className="font-medium">{formatDate(employee.date_of_hire)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{employee.department || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="font-medium">{employee.job_title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment Type</p>
                  <p className="font-medium">{employee.employment_type || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Manager</p>
                  <p className="font-medium">{employee.reporting_manager || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment Status</p>
                  <p className="font-medium">{employee.employment_status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Probation Period</p>
                  <p className="font-medium">{employee.probation_period ? `${employee.probation_period} days` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Exit Date</p>
                  <p className="font-medium">{formatDate(employee.date_of_exit)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'compensation':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Salary Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">{formatSalary(employee.salary) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pay Type</p>
                  <p className="font-medium">{employee.pay_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pay Mode</p>
                  <p className="font-medium">{employee.pay_mode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salary Currency</p>
                  <p className="font-medium">{employee.salary_currency || 'N/A'}</p>
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
                <div>
                  <p className="text-sm text-gray-500">Bank Branch</p>
                  <p className="font-medium">{employee.bank_branch || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Beneficiary Name</p>
                  <p className="font-medium">{employee.beneficiary_name || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'compliance':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Compliance Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">MOM Occupation Group</p>
                  <p className="font-medium">{employee.mom_occupation_group || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Residency Status</p>
                  <p className="font-medium">{employee.residency_status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Union Membership</p>
                  <p className="font-medium">{employee.union_membership || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Statutory Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">CPF Eligible</p>
                  <p className="font-medium">{employee.cpf_contribution ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CPF Account Number</p>
                  <p className="font-medium">{employee.cpf_account_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">PR Issue Date</p>
                  <p className="font-medium">{formatDate(employee.pr_issue_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Work Permit Number</p>
                  <p className="font-medium">{employee.work_permit_number || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'others':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Emergency Contact</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{employee.emergency_contact_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relationship</p>
                  <p className="font-medium">{employee.emergency_relationship || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{formatPhoneNumber(employee.emergency_contact_phone) || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Skills</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {employee.skill_set && employee.skill_set.length > 0 ? (
                      employee.skill_set.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm mr-1 mb-1">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">None specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NS Group</p>
                  <p className="font-medium">{employee.ns_group || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vaccination Status</p>
                  <p className="font-medium">{employee.vaccination_status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium text-sm whitespace-pre-wrap">{employee.notes || 'N/A'}</p>
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

  // Render a form or view component based on isViewOnly flag
  const renderFormContent = () => {
    if (isViewOnly) {
      return renderViewContent();
    }
    
    if (activeTab !== 'documents') {
      return (
        <AddEmployeeForm 
          employeeData={employee}
          onSuccess={onSuccess}
          onCancel={onCancel}
          isTabbed={true}
          activeTab={activeTab}
        />
      );
    }
    
    return null; // DocumentManager will be rendered directly
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="border-b overflow-x-auto">
        <TabsList className="w-full flex justify-start px-2 h-auto flex-nowrap min-w-max py-1">
          <TabsTrigger value="basic-info" className="whitespace-nowrap">Basic Info</TabsTrigger>
          <TabsTrigger value="job-details" className="whitespace-nowrap">Job Details</TabsTrigger>
          <TabsTrigger value="compensation" className="whitespace-nowrap">Compensation</TabsTrigger>
          <TabsTrigger value="compliance" className="whitespace-nowrap">Compliance & Statutory</TabsTrigger>
          <TabsTrigger value="documents" className="whitespace-nowrap">Documents</TabsTrigger>
          <TabsTrigger value="others" className="whitespace-nowrap">Others</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="basic-info" className="pt-2">
        {renderFormContent()}
      </TabsContent>
      
      <TabsContent value="job-details" className="pt-2">
        {renderFormContent()}
      </TabsContent>
      
      <TabsContent value="compensation" className="pt-2">
        {renderFormContent()}
      </TabsContent>
      
      <TabsContent value="compliance" className="pt-2">
        {renderFormContent()}
      </TabsContent>
      
      <TabsContent value="documents" className="pt-2">
        {employee && employee.id ? (
          <DocumentManager 
            employeeId={employee.id}
            refreshTrigger={refreshDocuments}
            isTabbed={true}
          />
        ) : (
          <div className="p-6 border border-dashed rounded-md text-center bg-gray-50">
            <p className="font-medium mb-2">Save employee record first to enable document uploads</p>
            <p className="text-sm text-gray-500 mb-4">
              You need to save the employee details before you can upload documents.
            </p>
            <Button variant="primary" onClick={onSuccess}>
              <Save className="mr-2 h-4 w-4" />
              Save Employee Details
            </Button>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="others" className="pt-2">
        {renderFormContent()}
      </TabsContent>
      
      {!isViewOnly && activeTab !== 'documents' && (
        <div className="mt-8 flex justify-end gap-2 sticky bottom-4 z-30">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="employee-form">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
          
          {employee && employee.id && (
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('documents')}
              className="ml-4"
            >
              <Upload className="mr-2 h-4 w-4" />
              Manage Documents
            </Button>
          )}
        </div>
      )}
    </Tabs>
  );
};
