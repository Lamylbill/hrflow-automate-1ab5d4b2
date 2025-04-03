import { Employee, EmployeeFormData } from '@/types/employee';

export interface FieldMeta {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'dropdown' | 'boolean';
  category: string;
  isNested?: boolean;
  nestedType?: keyof Omit<EmployeeFormData, 'employee'>;
  example?: string | number;
}

// Base fields from Employee
export const employeeBaseFields: FieldMeta[] = [
  { name: 'full_name', label: 'Full Name', type: 'text', category: 'Personal Info' },
  { name: 'email', label: 'Email', type: 'email', category: 'Personal Info' },
  { name: 'contact_number', label: 'Phone', type: 'text', category: 'Personal Info' },
  { name: 'gender', label: 'Gender', type: 'dropdown', category: 'Personal Info' },
  { name: 'date_of_birth', label: 'Date of Birth', type: 'date', category: 'Personal Info' },
  { name: 'department', label: 'Department', type: 'text', category: 'Employment Info' },
  { name: 'job_title', label: 'Job Title', type: 'text', category: 'Employment Info' },
  { name: 'employment_type', label: 'Employment Type', type: 'dropdown', category: 'Employment Info' },
  { name: 'gross_salary', label: 'Gross Salary', type: 'number', category: 'Compensation' },
  { name: 'cpf_contribution', label: 'CPF Contribution', type: 'boolean', category: 'Compliance' },
  { name: 'tax_file_no', label: 'Tax File No', type: 'text', category: 'Compliance' },
  // Add more fields as needed
];

// Nested entities
export const nestedFieldMap: Record<keyof Omit<EmployeeFormData, 'employee'>, FieldMeta[]> = {
  allowances: [
    { name: 'allowance_type', label: 'Allowance Type', type: 'text', category: 'Allowances', isNested: true, nestedType: 'allowances' },
    { name: 'amount', label: 'Allowance Amount', type: 'number', category: 'Allowances', isNested: true, nestedType: 'allowances' },
  ],
  familyMembers: [
    { name: 'name', label: 'Family Member Name', type: 'text', category: 'Family', isNested: true, nestedType: 'familyMembers' },
    { name: 'relationship', label: 'Relationship', type: 'text', category: 'Family', isNested: true, nestedType: 'familyMembers' },
  ],
  education: [
    { name: 'institute_name', label: 'Institute', type: 'text', category: 'Education', isNested: true, nestedType: 'education' },
    { name: 'qualification', label: 'Qualification', type: 'text', category: 'Education', isNested: true, nestedType: 'education' },
  ],
  workExperience: [
    { name: 'company_name', label: 'Company Name', type: 'text', category: 'Experience', isNested: true, nestedType: 'workExperience' },
    { name: 'job_title', label: 'Position', type: 'text', category: 'Experience', isNested: true, nestedType: 'workExperience' },
  ],
  appraisalRatings: [
    { name: 'appraisal_type', label: 'Appraisal Type', type: 'text', category: 'Appraisal', isNested: true, nestedType: 'appraisalRatings' },
    { name: 'rating', label: 'Rating', type: 'text', category: 'Appraisal', isNested: true, nestedType: 'appraisalRatings' },
  ],
  documents: [
    { name: 'name', label: 'Document Name', type: 'text', category: 'Documents', isNested: true, nestedType: 'documents' },
    { name: 'type', label: 'Document Type', type: 'text', category: 'Documents', isNested: true, nestedType: 'documents' },
  ],
};

// Export all fields including flattened nested
export const getFlatEmployeeFormFields = (): FieldMeta[] => {
  const base = employeeBaseFields;
  const nestedFlattened: FieldMeta[] = [];

  Object.entries(nestedFieldMap).forEach(([key, fields]) => {
    for (let i = 0; i < 3; i++) {
      fields.forEach(field => {
        nestedFlattened.push({
          ...field,
          name: `${key}.${i}.${field.name}`,
          label: `${field.label} (${i + 1})`
        });
      });
    }
  });

  return [...base, ...nestedFlattened];
};

export const getFieldMetaByName = (name: string): FieldMeta | undefined => {
  return getFlatEmployeeFormFields().find(f => f.name === name);
}
