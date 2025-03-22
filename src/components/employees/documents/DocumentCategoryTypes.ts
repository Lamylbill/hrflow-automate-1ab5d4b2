
export const DOCUMENT_CATEGORIES = {
  PERSONAL_ID: '1️⃣ Personal Identification & Eligibility',
  EMPLOYMENT: '2️⃣ Employment Agreements & Contracts',
  PAYROLL: '3️⃣ Payroll & Taxation',
  LEAVE: '4️⃣ Leave & Benefits',
  PERFORMANCE: '5️⃣ Performance & Disciplinary',
  TRAINING: '6️⃣ Training & Development',
  EXIT: '7️⃣ Exit & Offboarding'
};

export const DOCUMENT_TYPES = {
  [DOCUMENT_CATEGORIES.PERSONAL_ID]: [
    { value: 'nric', label: 'NRIC / MyKad / Passport', description: 'Official ID (Singapore NRIC, Malaysia MyKad, or passport for foreigners)' },
    { value: 'work_pass', label: 'Work Pass / Permit', description: 'Employment pass, S-pass, work permit, etc.' },
    { value: 'visa', label: 'Visa Documents', description: 'Supporting documents for employment visa' },
    { value: 'birth_cert', label: 'Birth Certificate', description: 'Required in some onboarding scenarios' },
    { value: 'drivers_license', label: 'Driver\'s License', description: 'If relevant to job function' }
  ],
  [DOCUMENT_CATEGORIES.EMPLOYMENT]: [
    { value: 'offer_letter', label: 'Signed Offer Letter', description: 'Employment terms prior to contract' },
    { value: 'employment_contract', label: 'Employment Contract', description: 'Legally binding job agreement' },
    { value: 'nda', label: 'Non-Disclosure Agreement (NDA)', description: 'Confidentiality & IP protection' },
    { value: 'probation', label: 'Probation Confirmation', description: 'Formal notice of passing probation' },
    { value: 'job_description', label: 'Job Description', description: 'Role responsibilities and expectations' }
  ],
  [DOCUMENT_CATEGORIES.PAYROLL]: [
    { value: 'bank_details', label: 'Bank Account Details', description: 'For salary deposit' },
    { value: 'cpf_forms', label: 'CPF Contribution Forms (SG)', description: 'Forms IR8A, IR8S, Appendix 8A, 8B' },
    { value: 'pcb_forms', label: 'PCB Tax Forms (MY)', description: 'EA Form, PCB II, TP1, etc.' },
    { value: 'payslips', label: 'Salary Payslips', description: 'Monthly payment slips' },
    { value: 'salary_adjust', label: 'Salary Adjustment Letters', description: 'Documentation of increment or change' },
    { value: 'tax_declaration', label: 'Income Tax Declaration', description: 'Annual income confirmation' }
  ],
  [DOCUMENT_CATEGORIES.LEAVE]: [
    { value: 'medical_cert', label: 'Medical Certificates (MCs)', description: 'Sick leave justification' },
    { value: 'parental_leave', label: 'Maternity / Paternity Documents', description: 'Government leave eligibility proof' },
    { value: 'leave_forms', label: 'Leave Application Forms', description: 'Annual / unpaid / special leave' },
    { value: 'benefit_claims', label: 'Benefit Claims Receipts', description: 'Dental, health, optical, transport, etc.' },
    { value: 'insurance', label: 'Insurance Policies', description: 'Medical or life insurance docs' },
    { value: 'benefit_enrollment', label: 'Benefit Enrollment Forms', description: 'Forms to opt into company benefit plans' }
  ],
  [DOCUMENT_CATEGORIES.PERFORMANCE]: [
    { value: 'appraisal', label: 'Performance Appraisal Reports', description: 'Periodic reviews' },
    { value: 'kpi', label: 'KPI Review Documents', description: 'Metrics against targets' },
    { value: 'disciplinary', label: 'Disciplinary Records / Warning Letters', description: 'HR response to misconduct' },
    { value: 'feedback', label: 'Employee Feedback Forms', description: 'Peer or self-evaluation' }
  ],
  [DOCUMENT_CATEGORIES.TRAINING]: [
    { value: 'certificates', label: 'Training Certificates', description: 'Skills or course completion proof' },
    { value: 'learning_plans', label: 'Learning Plans', description: 'Training roadmap for development' },
    { value: 'workshop', label: 'Workshop Attendance Proof', description: 'Sign-in sheets or certificates' }
  ],
  [DOCUMENT_CATEGORIES.EXIT]: [
    { value: 'resignation', label: 'Resignation Letter', description: 'Voluntary departure notice' },
    { value: 'termination', label: 'Termination Letter', description: 'Employer-initiated dismissal' },
    { value: 'exit_interview', label: 'Exit Interview Forms', description: 'Feedback and insights from departing employee' },
    { value: 'final_payslip', label: 'Final Payslip', description: 'Salary including leave encashment' },
    { value: 'clearance', label: 'Clearance Form', description: 'Checklist of return items and dues' }
  ]
};

export type DocumentCategory = keyof typeof DOCUMENT_TYPES;
export type DocumentType = { value: string; label: string; description: string };

export const getCategoryFromValue = (value: string): string | undefined => {
  return Object.values(DOCUMENT_CATEGORIES).find(category => 
    value.startsWith(category)
  );
};

export const getTypeFromValue = (categoryValue: string, typeValue: string): DocumentType | undefined => {
  const category = Object.values(DOCUMENT_CATEGORIES).find(cat => categoryValue.startsWith(cat));
  
  if (!category) return undefined;
  
  return DOCUMENT_TYPES[category].find(type => type.value === typeValue);
};

export const getDisplayLabel = (categoryValue: string, typeValue: string): string => {
  const category = getCategoryFromValue(categoryValue);
  const type = category ? 
    DOCUMENT_TYPES[category].find(t => t.value === typeValue) : 
    undefined;
  
  if (category && type) {
    return `${category} - ${type.label}`;
  }
  
  return `${categoryValue || 'Unknown'} - ${typeValue || 'Unknown'}`;
};
