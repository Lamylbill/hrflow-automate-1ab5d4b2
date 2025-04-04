
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { renderFieldGroups } from './shared/renderFieldGroups';
import { FieldsToggle } from './shared/FieldsToggle';
import { getEmployeeFieldsByCategory } from '@/utils/employeeFieldUtils';
import { EmployeeFormData } from '@/types/employee';

interface OptionType {
  value: string;
  label: string;
}

export const OthersTab = ({ isViewOnly = false }) => {
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const methods = useFormContext<EmployeeFormData>();
  
  // Get fields specific to the Other category
  const otherFields = getEmployeeFieldsByCategory('other');

  // Convert string[] to OptionType[] for multi-select fields
  const skillSetOptions: OptionType[] = [
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'communication', label: 'Communication' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'projectManagement', label: 'Project Management' },
    { value: 'languages', label: 'Languages' },
    { value: 'customerService', label: 'Customer Service' },
  ];

  const nsGroupOptions: OptionType[] = [
    { value: 'army', label: 'Army' },
    { value: 'navy', label: 'Navy' },
    { value: 'airforce', label: 'Air Force' },
    { value: 'policeForce', label: 'Police Force' },
    { value: 'civilDefence', label: 'Civil Defence' },
  ];

  const vaccinationStatusOptions: OptionType[] = [
    { value: 'fully', label: 'Fully Vaccinated' },
    { value: 'partially', label: 'Partially Vaccinated' },
    { value: 'none', label: 'Not Vaccinated' },
    { value: 'exempt', label: 'Medically Exempted' },
  ];

  const benefitsOptions: OptionType[] = [
    { value: 'medical', label: 'Medical Insurance' },
    { value: 'dental', label: 'Dental Insurance' },
    { value: 'vision', label: 'Vision Insurance' },
    { value: 'retirement', label: 'Retirement Plan' },
    { value: 'lifeInsurance', label: 'Life Insurance' },
    { value: 'flexibleSpending', label: 'Flexible Spending Account' },
    { value: 'wellness', label: 'Wellness Program' },
    { value: 'tuition', label: 'Tuition Reimbursement' },
    { value: 'childcare', label: 'Childcare Benefits' },
    { value: 'paidLeave', label: 'Paid Leave' },
  ];

  return (
    <div className="space-y-6">
      <FieldsToggle 
        showAdvanced={showAdvancedFields} 
        onToggle={setShowAdvancedFields} 
      />

      {renderFieldGroups(methods, otherFields, isViewOnly, showAdvancedFields)}
    </div>
  );
};

export default OthersTab;
