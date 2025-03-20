
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

/**
 * Generates and downloads an Excel file with the provided data
 * @param filename The name of the file to download
 * @param sheets An array of sheet data objects
 */
export function generateExcel(
  filename: string, 
  sheets: { 
    name: string, 
    data: any[][], 
    header?: boolean 
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
 * Generates and downloads an employee template Excel file
 */
export function generateEmployeeTemplate() {
  // Employee field descriptions
  const employeeFields = [
    ["Field", "Description", "Example", "Type", "Required"],
    ["full_name", "Employee's full name", "John Doe", "Text", "Yes"],
    ["profile_picture", "URL to profile image", "https://example.com/image.jpg", "URL", "No"],
    ["date_of_birth", "Employee's birth date", "1990-01-01", "Date (YYYY-MM-DD)", "No"],
    ["gender", "Employee's gender", "Male / Female / Other", "Text", "No"],
    ["nationality", "Employee's nationality", "Singapore", "Text", "No"],
    ["employee_code", "Internal employee number", "EMP001", "Text", "No"],
    ["job_title", "Job role", "Software Engineer", "Text", "No"],
    ["department", "Assigned department", "IT", "Text", "No"],
    ["employment_type", "Type of employment", "Full-time / Part-time / Contract", "Text", "No"],
    ["employment_status", "Current status", "Active / On Leave / Resigned", "Text", "No"],
    ["date_of_hire", "Date employee was hired", "2022-01-01", "Date (YYYY-MM-DD)", "No"],
    ["date_of_exit", "Last working date if resigned", "2023-01-01", "Date (YYYY-MM-DD)", "No"],
    ["email", "Employee's work email", "john.doe@example.com", "Email", "Yes"],
    ["phone_number", "Contact number", "+6512345678", "Text", "No"],
    ["home_address", "Residential address", "123 Main Street", "Text", "No"],
    ["postal_code", "Postal code", "123456", "Text", "No"],
    ["emergency_contact_name", "Name of emergency contact", "Jane Doe", "Text", "No"],
    ["emergency_contact_phone", "Emergency contact phone", "+6598765432", "Text", "No"],
    ["salary", "Monthly or annual salary", "5000", "Number", "No"],
    ["bank_name", "Employee's bank name", "DBS Bank", "Text", "No"],
    ["bank_account_number", "Salary payment account", "123456789", "Text", "No"],
    ["cpf_contribution", "Whether CPF deductions apply", "true / false", "Boolean", "No"],
    ["cpf_account_number", "CPF account for contributions", "CPF12345", "Text", "No"],
    ["tax_identification_number", "Taxpayer ID for income tax", "Tax12345", "Text", "No"],
    ["leave_entitlement", "Total leave days per year", "21", "Number", "No"],
    ["leave_balance", "Remaining leave days", "15", "Number", "No"],
    ["medical_entitlement", "Total medical leave days", "14", "Number", "No"],
    ["benefits_enrolled", "List of company benefits", "Health Insurance, Dental", "Text (comma-separated)", "No"],
    ["work_permit_number", "Work visa/permit number", "WP12345", "Text", "No"],
    ["work_pass_expiry_date", "Expiry date of work pass", "2025-01-01", "Date (YYYY-MM-DD)", "No"],
    ["contract_signed", "Whether contract is signed", "true / false", "Boolean", "No"],
    ["probation_status", "Probation status", "Under Probation / Confirmed", "Text", "No"],
    ["notes", "HR/Admin notes", "Excellent performer", "Text", "No"]
  ];
  
  // Employee template with header row
  const templateHeaders = [
    "full_name",
    "profile_picture",
    "date_of_birth",
    "gender",
    "nationality",
    "employee_code",
    "job_title",
    "department",
    "employment_type",
    "employment_status",
    "date_of_hire",
    "date_of_exit",
    "email",
    "phone_number",
    "home_address",
    "postal_code",
    "emergency_contact_name",
    "emergency_contact_phone",
    "salary",
    "bank_name",
    "bank_account_number",
    "cpf_contribution",
    "cpf_account_number",
    "tax_identification_number",
    "leave_entitlement",
    "leave_balance",
    "medical_entitlement",
    "benefits_enrolled",
    "work_permit_number",
    "work_pass_expiry_date",
    "contract_signed",
    "probation_status",
    "notes"
  ];
  
  // Example row
  const exampleRow = [
    "John Doe",
    "",
    "1990-01-01",
    "Male",
    "Singapore",
    "EMP001",
    "Software Engineer",
    "Engineering",
    "Full-time",
    "Active",
    "2022-01-01",
    "",
    "john.doe@example.com",
    "+6512345678",
    "123 Main Street",
    "123456",
    "Jane Doe",
    "+6598765432",
    "5000",
    "DBS Bank",
    "123456789",
    "true",
    "CPF12345",
    "Tax12345",
    "21",
    "15",
    "14",
    "Health Insurance, Dental",
    "",
    "",
    "true",
    "Confirmed",
    "Excellent performer"
  ];
  
  // Create the template with multiple sheets
  generateExcel("employee_template", [
    {
      name: "Instructions",
      data: employeeFields
    },
    {
      name: "Template",
      data: [templateHeaders, exampleRow, Array(templateHeaders.length).fill("")]
    }
  ]);
  
  return true;
}
