
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Employee } from '@/types/employee';

/**
 * Generates and downloads an Excel file with the provided data
 * @param filename The name of the file to download
 * @param sheets An array of sheet data objects
 */
export function generateExcel(
  filename: string, 
  sheets: { 
    name: string, 
    data: any[][] 
  }[]
) {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Add each sheet to the workbook
  sheets.forEach(sheet => {
    const ws = XLSX.utils.aoa_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });
  
  // Generate the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Download the file
  saveAs(data, `${filename}.xlsx`);
}

/**
 * Export all employee data to Excel including all fields
 * @param employees Array of employee objects
 */
export function exportEmployeesToExcel(employees: Employee[]) {
  if (!employees || employees.length === 0) {
    return false;
  }
  
  // Get all possible field names from all employees
  const allFields = new Set<string>();
  employees.forEach(employee => {
    Object.keys(employee).forEach(key => {
      if (key !== 'id' && key !== 'user_id') { // Skip internal IDs
        allFields.add(key);
      }
    });
  });
  
  // Create header row with readable field names
  const headers = Array.from(allFields).map(field => {
    // Convert field_name to Field Name format
    return field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  });
  
  // Create data rows with all fields
  const data = employees.map(employee => {
    return Array.from(allFields).map(field => {
      const value = employee[field as keyof Employee];
      
      // Handle different data types appropriately
      if (value === null || value === undefined) {
        return '';
      } else if (Array.isArray(value)) {
        return value.join(', ');
      } else if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      } else {
        return value;
      }
    });
  });
  
  // Combine headers and data
  const exportData = [headers, ...data];
  
  generateExcel("employees_export", [{ name: "Employees", data: exportData }]);
  return true;
}

/**
 * Get all employee fields organized by category
 * This ensures the template always reflects the latest schema
 */
function getEmployeeFieldsByCategory() {
  return {
    personal: [
      { field: "full_name", label: "Full Name", description: "Employee's full name", example: "Tan Wei Ming", type: "Text", required: true },
      { field: "first_name", label: "First Name", description: "Employee's first/given name", example: "Wei Ming", type: "Text", required: false },
      { field: "last_name", label: "Last Name", description: "Employee's surname/family name", example: "Tan", type: "Text", required: false },
      { field: "middle_name", label: "Middle Name", description: "Employee's middle name", example: "", type: "Text", required: false },
      { field: "alias_name", label: "Alias Name", description: "Employee's nickname or preferred name", example: "William", type: "Text", required: false },
      { field: "local_name", label: "Local Name", description: "Employee's name in local language characters", example: "陈伟明", type: "Text", required: false },
      { field: "title", label: "Title", description: "Employee's title (Mr/Ms/Dr etc)", example: "Mr", type: "Text", required: false },
      { field: "profile_picture", label: "Profile Picture", description: "URL to profile image", example: "https://example.com/image.jpg", type: "URL", required: false },
      { field: "date_of_birth", label: "Date of Birth", description: "Employee's birth date", example: "1990-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "birth_place", label: "Birth Place", description: "Place of birth", example: "Singapore", type: "Text", required: false },
      { field: "gender", label: "Gender", description: "Employee's gender", example: "Male / Female / Other", type: "Text", required: false },
      { field: "nationality", label: "Nationality", description: "Employee's nationality", example: "Singapore", type: "Text", required: false },
      { field: "identity_no", label: "Identity Number", description: "National ID or identity card number", example: "S9812345A", type: "Text", required: false },
      { field: "marital_status", label: "Marital Status", description: "Employee's marital status", example: "Single / Married / Divorced", type: "Text", required: false },
      { field: "marriage_date", label: "Marriage Date", description: "Date of marriage", example: "2015-06-18", type: "Date (YYYY-MM-DD)", required: false },
      { field: "no_of_children", label: "Number of Children", description: "Number of children", example: "2", type: "Number", required: false },
      { field: "ethnic_origin", label: "Ethnic Origin", description: "Employee's ethnic origin/race", example: "Chinese", type: "Text", required: false },
      { field: "religion", label: "Religion", description: "Employee's religious affiliation", example: "Buddhism", type: "Text", required: false },
      { field: "qualification", label: "Qualification", description: "Educational qualification", example: "Bachelor's Degree", type: "Text", required: false },
      { field: "email", label: "Email", description: "Employee's work email", example: "wei.ming@example.com.sg", type: "Email", required: true },
      { field: "personal_email", label: "Personal Email", description: "Employee's personal email", example: "weiming.tan@gmail.com", type: "Email", required: false },
      { field: "phone_number", label: "Phone Number", description: "Primary contact number", example: "+6591234567", type: "Text", required: false },
      { field: "mobile_no", label: "Mobile Number", description: "Mobile phone number", example: "+6591234567", type: "Text", required: false },
      { field: "telephone_no", label: "Telephone Number", description: "Fixed line number", example: "+6565432198", type: "Text", required: false },
      { field: "personal_mobile_no", label: "Personal Mobile Number", description: "Personal mobile number", example: "+6598765432", type: "Text", required: false },
      { field: "extension_no", label: "Extension Number", description: "Office extension number", example: "1234", type: "Text", required: false },
    ],
    address: [
      { field: "address_type", label: "Address Type", description: "Type of address", example: "Residential / Mailing", type: "Text", required: false },
      { field: "home_address", label: "Home Address", description: "Residential address", example: "Block 123, Ang Mo Kio Avenue 6, #12-34", type: "Text", required: false },
      { field: "address_line_1", label: "Address Line 1", description: "First line of address", example: "Block 123, Ang Mo Kio Avenue 6", type: "Text", required: false },
      { field: "address_line_2", label: "Address Line 2", description: "Second line of address", example: "#12-34", type: "Text", required: false },
      { field: "city", label: "City", description: "City of residence", example: "Singapore", type: "Text", required: false },
      { field: "country_region", label: "Country/Region", description: "Country or region of residence", example: "Singapore", type: "Text", required: false },
      { field: "postal_code", label: "Postal Code", description: "Postal code", example: "560123", type: "Text", required: false },
    ],
    emergency: [
      { field: "emergency_contact_name", label: "Emergency Contact Name", description: "Name of emergency contact", example: "Lim Mei Ling", type: "Text", required: false },
      { field: "emergency_contact_phone", label: "Emergency Contact Phone", description: "Emergency contact phone", example: "+6598765432", type: "Text", required: false },
      { field: "emergency_relationship", label: "Emergency Relationship", description: "Relationship to emergency contact", example: "Spouse / Parent", type: "Text", required: false },
    ],
    employment: [
      { field: "employee_code", label: "Employee Code", description: "Internal employee number", example: "EMP001", type: "Text", required: false },
      { field: "login_id", label: "Login ID", description: "System login identifier", example: "tanwm", type: "Text", required: false },
      { field: "job_title", label: "Job Title", description: "Job role", example: "Software Engineer", type: "Text", required: false },
      { field: "department", label: "Department", description: "Assigned department", example: "IT", type: "Text", required: false },
      { field: "employment_type", label: "Employment Type", description: "Type of employment", example: "Full-time / Part-time / Contract", type: "Text", required: false },
      { field: "employment_status", label: "Employment Status", description: "Current status", example: "Active / On Leave / Resigned", type: "Text", required: false },
      { field: "date_of_hire", label: "Date of Hire", description: "Date employee was hired", example: "2022-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "initial_join_date", label: "Initial Join Date", description: "First date of employment", example: "2021-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "join_date_for_leave", label: "Join Date for Leave", description: "Date used for leave calculation", example: "2022-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "company", label: "Company", description: "Company or subsidiary name", example: "ABC Tech Pte Ltd", type: "Text", required: false },
      { field: "cost_center", label: "Cost Center", description: "Cost center or budget code", example: "CC001", type: "Text", required: false },
      { field: "job_grade", label: "Job Grade", description: "Employee job grade or level", example: "L3", type: "Text", required: false },
      { field: "hr_rpt_job_category", label: "HR Report Job Category", description: "Job category for HR reporting", example: "Technical", type: "Text", required: false },
      { field: "hr_rpt_division_category", label: "HR Report Division Category", description: "Division category for HR reporting", example: "Engineering", type: "Text", required: false },
      { field: "leave_grade", label: "Leave Grade", description: "Grade for leave entitlement", example: "Grade A", type: "Text", required: false },
      { field: "pay_group", label: "Pay Group", description: "Grouping for payroll purposes", example: "Monthly", type: "Text", required: false },
      { field: "manager", label: "Manager", description: "Manager's name", example: "John Lee", type: "Text", required: false },
      { field: "reporting_manager", label: "Reporting Manager", description: "Direct supervisor ID", example: "MGR123", type: "Text", required: false },
      { field: "recruitment_type", label: "Recruitment Type", description: "How employee was recruited", example: "Direct / Agency", type: "Text", required: false },
      { field: "new_graduate", label: "New Graduate", description: "Whether employee is a new graduate", example: "true / false", type: "Boolean", required: false },
      { field: "web_role", label: "Web Role", description: "System access role", example: "Admin / User", type: "Text", required: false },
      { field: "assignment_date_start", label: "Assignment Start Date", description: "Current role start date", example: "2022-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "status_change_reason", label: "Status Change Reason", description: "Reason for status change", example: "Promotion", type: "Text", required: false },
    ],
    probation: [
      { field: "probation_period", label: "Probation Period", description: "Length of probation", example: "3", type: "Number", required: false },
      { field: "probation_period_type", label: "Probation Period Type", description: "Unit for probation period", example: "Months", type: "Text", required: false },
      { field: "probation_due", label: "Probation Due Date", description: "When probation ends", example: "2022-04-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "confirmed_date", label: "Confirmation Date", description: "Date of confirmation after probation", example: "2022-04-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "probation_status", label: "Probation Status", description: "Current probation status", example: "Under Probation / Confirmed", type: "Text", required: false },
    ],
    exit: [
      { field: "date_of_exit", label: "Date of Exit", description: "Last working date if resigned", example: "2023-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "resignation_tender_date", label: "Resignation Tender Date", description: "Date resignation was submitted", example: "2022-12-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "exit_reason", label: "Exit Reason", description: "Reason for leaving", example: "Better Opportunity", type: "Text", required: false },
      { field: "exit_interview_date", label: "Exit Interview Date", description: "Date of exit interview", example: "2022-12-20", type: "Date (YYYY-MM-DD)", required: false },
      { field: "notice_period", label: "Notice Period", description: "Required notice period", example: "30", type: "Number", required: false },
      { field: "last_working_date", label: "Last Working Date", description: "Final day of work", example: "2023-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "rehire", label: "Rehire Eligible", description: "Whether employee can be rehired", example: "true / false", type: "Boolean", required: false },
      { field: "previous_employee_code", label: "Previous Employee Code", description: "Previous employee ID if rehired", example: "EMP098", type: "Text", required: false },
    ],
    contract: [
      { field: "contract_date_start", label: "Contract Start Date", description: "Contract start date", example: "2022-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "contract_date_end", label: "Contract End Date", description: "Contract end date", example: "2023-01-14", type: "Date (YYYY-MM-DD)", required: false },
      { field: "contract_type", label: "Contract Type", description: "Type of employment contract", example: "Fixed Term / Permanent", type: "Text", required: false },
      { field: "contract_nature", label: "Contract Nature", description: "Nature of contract", example: "Full-time / Part-time", type: "Text", required: false },
      { field: "contract_signed", label: "Contract Signed", description: "Whether contract is signed", example: "true / false", type: "Boolean", required: false },
      { field: "renewal", label: "Renewal", description: "Contract renewal type", example: "Auto / Manual", type: "Text", required: false },
      { field: "no_of_contracts", label: "Number of Contracts", description: "Number of contracts held", example: "2", type: "Number", required: false },
      { field: "contract_adjustment", label: "Contract Adjustment", description: "Contract term adjustment", example: "1", type: "Number", required: false },
      { field: "no_of_contracts_total", label: "Total Number of Contracts", description: "Total contracts including adjustments", example: "3", type: "Number", required: false },
      { field: "shorted_period", label: "Shortened Period", description: "Shortened notice period", example: "15", type: "Number", required: false },
      { field: "shorted_period_type", label: "Shortened Period Type", description: "Unit for shortened period", example: "Days", type: "Text", required: false },
      { field: "service_length_adjustment", label: "Service Length Adjustment", description: "Adjustment to service duration", example: "3", type: "Number", required: false },
      { field: "service_length_total", label: "Total Service Length", description: "Total service duration", example: "24", type: "Number", required: false },
      { field: "previous_work_experience", label: "Previous Work Experience", description: "Prior work experience in months", example: "36", type: "Number", required: false },
      { field: "work_experience_to_date", label: "Work Experience to Date", description: "Total work experience to date", example: "60", type: "Number", required: false },
    ],
    compensation: [
      { field: "salary", label: "Salary", description: "Monthly salary in SGD", example: "5000", type: "Number", required: false },
      { field: "salary_currency", label: "Salary Currency", description: "Currency code for salary", example: "SGD", type: "Text", required: false },
      { field: "salary_date_start", label: "Salary Start Date", description: "Start date for current salary", example: "2022-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "salary_status_change_reason", label: "Salary Change Reason", description: "Reason for salary change", example: "Annual Increment", type: "Text", required: false },
      { field: "pay_mode", label: "Pay Mode", description: "Mode of salary payment", example: "Bank Transfer", type: "Text", required: false },
      { field: "pay_type", label: "Pay Type", description: "Type of payment", example: "Monthly / Hourly", type: "Text", required: false },
      { field: "salary_grade", label: "Salary Grade", description: "Salary grade or band", example: "SG3", type: "Text", required: false },
      { field: "salary_fixed", label: "Fixed Salary", description: "Fixed portion of salary", example: "4500", type: "Number", required: false },
      { field: "mvc", label: "MVC", description: "Monthly variable component", example: "500", type: "Number", required: false },
      { field: "mvc_percentage", label: "MVC Percentage", description: "MVC as percentage of total", example: "10", type: "Number", required: false },
      { field: "salary_gross", label: "Gross Salary", description: "Gross monthly salary", example: "5000", type: "Number", required: false },
      { field: "salary_arrears", label: "Salary Arrears", description: "Salary arrears amount", example: "2500", type: "Number", required: false },
      { field: "freeze_payment", label: "Freeze Payment", description: "Whether payment is frozen", example: "true / false", type: "Boolean", required: false },
      { field: "work_days_per_week", label: "Work Days Per Week", description: "Number of working days per week", example: "5", type: "Number", required: false },
      { field: "work_hours_per_day", label: "Work Hours Per Day", description: "Number of working hours per day", example: "8", type: "Number", required: false },
      { field: "work_hours_per_year", label: "Work Hours Per Year", description: "Total working hours per year", example: "2080", type: "Number", required: false },
      { field: "work_days_per_year", label: "Work Days Per Year", description: "Total working days per year", example: "260", type: "Number", required: false },
      { field: "allocation_type", label: "Allocation Type", description: "Salary allocation type", example: "Full / Split", type: "Text", required: false },
      { field: "allocation_amount", label: "Allocation Amount", description: "Amount for allocation", example: "1000", type: "Number", required: false },
      { field: "allocation_account", label: "Allocation Account", description: "Account for allocation", example: "ACC123", type: "Text", required: false },
      { field: "allocation_run", label: "Allocation Run", description: "Allocation run type", example: "Monthly", type: "Text", required: false },
      { field: "bank_name", label: "Bank Name", description: "Employee's bank name", example: "DBS Bank / OCBC / UOB", type: "Text", required: false },
      { field: "bank_branch", label: "Bank Branch", description: "Bank branch name", example: "Raffles Place", type: "Text", required: false },
      { field: "bank_account_number", label: "Bank Account Number", description: "Salary payment account", example: "123456789", type: "Text", required: false },
      { field: "beneficiary_name", label: "Beneficiary Name", description: "Name for bank transfer", example: "Tan Wei Ming", type: "Text", required: false },
      { field: "bank_currency", label: "Bank Currency", description: "Currency for bank account", example: "SGD", type: "Text", required: false },
    ],
    benefits: [
      { field: "leave_entitlement", label: "Leave Entitlement", description: "Total annual leave days", example: "14", type: "Number", required: false },
      { field: "leave_balance", label: "Leave Balance", description: "Remaining leave days", example: "10", type: "Number", required: false },
      { field: "medical_entitlement", label: "Medical Entitlement", description: "Total medical leave days", example: "14", type: "Number", required: false },
      { field: "benefits_enrolled", label: "Benefits Enrolled", description: "List of company benefits", example: "Health Insurance, Dental", type: "Text (comma-separated)", required: false },
      { field: "thirteenth_month_entitlement", label: "13th Month Entitlement", description: "Eligible for 13th month payment", example: "true / false", type: "Boolean", required: false },
      { field: "group_hospital_surgical_plan", label: "Group Hospital Plan", description: "Hospital insurance plan", example: "Basic / Enhanced", type: "Text", required: false },
      { field: "group_personal_accident_plan", label: "Personal Accident Plan", description: "Accident insurance plan", example: "Standard", type: "Text", required: false },
      { field: "outpatient_medical_plan", label: "Outpatient Medical Plan", description: "Outpatient coverage plan", example: "GP Panel", type: "Text", required: false },
    ],
    compliance: [
      { field: "cpf_contribution", label: "CPF Contribution", description: "Whether CPF deductions apply", example: "true / false", type: "Boolean", required: false },
      { field: "cpf_account_number", label: "CPF Account Number", description: "CPF account for contributions", example: "S1234567D", type: "Text", required: false },
      { field: "tax_identification_number", label: "Tax ID Number", description: "NRIC or FIN for income tax", example: "S9812345A", type: "Text", required: false },
      { field: "work_permit_number", label: "Work Permit Number", description: "Work visa/permit number", example: "G1234567K", type: "Text", required: false },
      { field: "work_pass_expiry_date", label: "Work Pass Expiry Date", description: "Expiry date of work pass", example: "2025-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "mom_occupation_group", label: "MOM Occupation Group", description: "Occupation group for MOM", example: "Professionals", type: "Text", required: false },
      { field: "mom_employee_type", label: "MOM Employee Type", description: "Employee type for MOM", example: "Foreign / Local", type: "Text", required: false },
      { field: "mom_bc_occupation_group", label: "MOM BC Occupation Group", description: "Business central occupation group", example: "SSIC 62011", type: "Text", required: false },
      { field: "mom_bc_employee_type", label: "MOM BC Employee Type", description: "Business central employee type", example: "EP", type: "Text", required: false },
      { field: "mom_bc_employment_type", label: "MOM BC Employment Type", description: "Business central employment type", example: "Full-time", type: "Text", required: false },
      { field: "mom_bc_employee_group", label: "MOM BC Employee Group", description: "Business central employee group", example: "Foreign", type: "Text", required: false },
      { field: "pr_issue_date", label: "PR Issue Date", description: "Permanent residency issue date", example: "2018-05-20", type: "Date (YYYY-MM-DD)", required: false },
      { field: "pr_renounce_date", label: "PR Renounce Date", description: "Permanent residency renouncement date", example: "2020-06-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "residency_status", label: "Residency Status", description: "Status of residency", example: "Citizen / PR / Foreigner", type: "Text", required: false },
      { field: "statutory_date_start", label: "Statutory Start Date", description: "Start date for statutory compliance", example: "2022-01-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "statutory_date_end", label: "Statutory End Date", description: "End date for statutory compliance", example: "2025-01-14", type: "Date (YYYY-MM-DD)", required: false },
      { field: "funds", label: "Funds", description: "Pension or social security funds", example: "CPF", type: "Text", required: false },
      { field: "mso_scheme", label: "MSO Scheme", description: "Medisave-only scheme", example: "Full / Partial", type: "Text", required: false },
      { field: "union_membership", label: "Union Membership", description: "Trade union membership", example: "NTUC", type: "Text", required: false },
      { field: "membership_no", label: "Membership Number", description: "Union membership number", example: "M12345", type: "Text", required: false },
      { field: "rest_day_per_week", label: "Rest Day Per Week", description: "Designated rest day", example: "Sunday", type: "Text", required: false },
      { field: "overtime_payment_period", label: "Overtime Payment Period", description: "Period for overtime payment", example: "Monthly", type: "Text", required: false },
      { field: "overtime_rate_of_pay", label: "Overtime Rate of Pay", description: "Rate multiplier for overtime", example: "1.5", type: "Number", required: false },
      { field: "paid_medical_examination_fee", label: "Paid Medical Exam Fee", description: "Whether medical exam fee is paid", example: "true / false", type: "Boolean", required: false },
      { field: "other_medical_benefit", label: "Other Medical Benefit", description: "Additional medical benefits", example: "Specialist Coverage", type: "Text", required: false },
      { field: "termination_notice_period", label: "Termination Notice Period", description: "Notice period for termination", example: "30", type: "Number", required: false },
      { field: "retire_age", label: "Retirement Age", description: "Age of retirement", example: "62", type: "Number", required: false },
    ],
    attendance: [
      { field: "attendance_calendar", label: "Attendance Calendar", description: "Calendar used for attendance", example: "Standard / Shift", type: "Text", required: false },
      { field: "ot_group", label: "OT Group", description: "Overtime grouping", example: "Group A", type: "Text", required: false },
      { field: "must_clock", label: "Must Clock", description: "Whether time clock is required", example: "true / false", type: "Boolean", required: false },
      { field: "all_work_day", label: "All Work Day", description: "Whether works all days", example: "true / false", type: "Boolean", required: false },
      { field: "badge_no", label: "Badge Number", description: "Employee badge number", example: "B12345", type: "Text", required: false },
      { field: "imei_uuid_no", label: "IMEI/UUID Number", description: "Device ID for attendance", example: "123456789012345", type: "Text", required: false },
      { field: "clock_codes", label: "Clock Codes", description: "Codes for time clock", example: "IN, OUT, BREAK", type: "Text (comma-separated)", required: false },
      { field: "clock_area_codes", label: "Clock Area Codes", description: "Area codes for time clock", example: "MAIN, BRANCH", type: "Text (comma-separated)", required: false },
    ],
    others: [
      { field: "skill_set", label: "Skill Set", description: "List of employee skills", example: "Java, React, SQL", type: "Text (comma-separated)", required: false },
      { field: "ns_group", label: "NS Group", description: "National service group", example: "A / B / C", type: "Text", required: false },
      { field: "vaccination_status", label: "Vaccination Status", description: "COVID vaccination status", example: "Fully Vaccinated", type: "Text", required: false },
      { field: "last_performance_review", label: "Last Performance Review", description: "Date of last review", example: "2022-12-15", type: "Date (YYYY-MM-DD)", required: false },
      { field: "performance_score", label: "Performance Score", description: "Last performance rating", example: "4.5", type: "Number", required: false },
      { field: "notes", label: "Notes", description: "HR/Admin notes", example: "Excellent performer", type: "Text", required: false },
    ],
  };
}

/**
 * Generates and downloads an employee template Excel file
 * with Singapore-specific example data organized by categories
 */
export function generateEmployeeTemplate() {
  // Get all employee fields organized by category
  const fieldsByCategory = getEmployeeFieldsByCategory();
  
  // Create a single header row with all fields in proper category order
  const headerRow: string[] = [];
  const exampleRow: string[] = [];
  
  // Process each category in the desired order
  const categoryOrder = ['personal', 'employment', 'probation', 'contract', 'compensation', 'benefits', 'compliance', 'address', 'emergency', 'exit', 'attendance', 'others'];
  
  categoryOrder.forEach(category => {
    if (fieldsByCategory[category]) {
      fieldsByCategory[category].forEach(field => {
        headerRow.push(field.field);
        exampleRow.push(field.example || '');
      });
    }
  });
  
  // Add one empty row for user to start filling
  const emptyRow = Array(headerRow.length).fill("");
  
  // Create the instructions data for the separate sheet
  const instructionsData = [
    ["Field", "Description", "Example", "Type", "Required", "Category"],
  ];
  
  // Add all fields to instructions sheet
  categoryOrder.forEach(category => {
    if (fieldsByCategory[category]) {
      fieldsByCategory[category].forEach(field => {
        instructionsData.push([
          field.field,
          field.description,
          field.example,
          field.type,
          field.required ? "Yes" : "No",
          category.charAt(0).toUpperCase() + category.slice(1)
        ]);
      });
    }
  });
  
  // Create the template with multiple sheets
  generateExcel("employee_template", [
    {
      name: "Instructions",
      data: instructionsData
    },
    {
      name: "Template",
      data: [headerRow, exampleRow, emptyRow]
    }
  ]);
  
  return true;
}
