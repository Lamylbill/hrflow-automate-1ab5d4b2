
export const DOCUMENT_CATEGORIES = {
  IDENTIFICATION: "Identification",
  EMPLOYMENT: "Employment",
  FINANCIAL: "Financial",
  EDUCATION: "Education",
  IMMIGRATION: "Immigration",
  MEDICAL: "Medical",
  PERFORMANCE: "Performance",
  OTHER: "Other"
};

export const DOCUMENT_TYPES: Record<string, Array<{ value: string; label: string; description?: string }>> = {
  [DOCUMENT_CATEGORIES.IDENTIFICATION]: [
    { value: "national_id", label: "National ID", description: "NRIC, FIN, or other national identification" },
    { value: "passport", label: "Passport", description: "International passport" },
    { value: "drivers_license", label: "Driver's License", description: "Driving permit" },
    { value: "birth_certificate", label: "Birth Certificate" }
  ],
  [DOCUMENT_CATEGORIES.EMPLOYMENT]: [
    { value: "offer_letter", label: "Offer Letter", description: "Official job offer document" },
    { value: "employment_contract", label: "Employment Contract", description: "Signed employment agreement" },
    { value: "confidentiality_agreement", label: "Confidentiality Agreement", description: "NDA or confidentiality contract" },
    { value: "termination_letter", label: "Termination Letter" },
    { value: "resignation_letter", label: "Resignation Letter" }
  ],
  [DOCUMENT_CATEGORIES.FINANCIAL]: [
    { value: "salary_slip", label: "Salary Slip", description: "Pay stub or salary statement" },
    { value: "bank_info", label: "Bank Information", description: "Bank account details for salary" },
    { value: "cpf_statement", label: "CPF Statement", description: "Central Provident Fund statement" },
    { value: "tax_documents", label: "Tax Documents", description: "Income tax or clearance" }
  ],
  [DOCUMENT_CATEGORIES.EDUCATION]: [
    { value: "degree_certificate", label: "Degree Certificate", description: "University or college degree" },
    { value: "diploma", label: "Diploma", description: "Educational diploma" },
    { value: "transcript", label: "Transcript", description: "Academic transcript" },
    { value: "certification", label: "Professional Certification", description: "Industry or skill certification" }
  ],
  [DOCUMENT_CATEGORIES.IMMIGRATION]: [
    { value: "work_permit", label: "Work Permit", description: "Authorization to work" },
    { value: "visa", label: "Visa", description: "Entry or residence visa" },
    { value: "employment_pass", label: "Employment Pass", description: "Singapore EP or S-Pass" },
    { value: "dependent_pass", label: "Dependent Pass" }
  ],
  [DOCUMENT_CATEGORIES.MEDICAL]: [
    { value: "medical_certificate", label: "Medical Certificate", description: "MC for leave" },
    { value: "health_insurance", label: "Health Insurance", description: "Insurance card or policy" },
    { value: "medical_report", label: "Medical Report", description: "Health assessment" },
    { value: "vaccination_record", label: "Vaccination Record" }
  ],
  [DOCUMENT_CATEGORIES.PERFORMANCE]: [
    { value: "performance_review", label: "Performance Review", description: "Periodic evaluation" },
    { value: "warning_letter", label: "Warning Letter" },
    { value: "commendation", label: "Commendation", description: "Recognition or award" },
    { value: "training_certificate", label: "Training Certificate", description: "Completed training" }
  ],
  [DOCUMENT_CATEGORIES.OTHER]: [
    { value: "reference_letter", label: "Reference Letter", description: "Professional reference" },
    { value: "miscellaneous", label: "Miscellaneous", description: "Other documents" }
  ]
};

// Helper functions to get display values
export const getCategoryFromValue = (value: string): string => {
  for (const category in DOCUMENT_CATEGORIES) {
    if (DOCUMENT_CATEGORIES[category as keyof typeof DOCUMENT_CATEGORIES] === value) {
      return value;
    }
  }
  return "Other";
};

export const getTypeFromValue = (category: string, value: string): string => {
  const types = DOCUMENT_TYPES[category] || [];
  const docType = types.find(type => type.value === value);
  return docType ? docType.label : value;
};

export const getDisplayLabel = (category: string, type: string): string => {
  return `${category} - ${getTypeFromValue(category, type)}`;
};
