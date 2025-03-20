
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
 * Generates and downloads an employee template Excel file
 * with Singapore-specific example data
 */
export function generateEmployeeTemplate() {
  // Employee field descriptions
  const employeeFields = [
    ["Field", "Description", "Example", "Type", "Required"],
    ["full_name", "Employee's full name", "Tan Wei Ming", "Text", "Yes"],
    ["profile_picture", "URL to profile image", "https://example.com/image.jpg", "URL", "No"],
    ["date_of_birth", "Employee's birth date", "1990-01-15", "Date (YYYY-MM-DD)", "No"],
    ["gender", "Employee's gender", "Male / Female / Other", "Text", "No"],
    ["nationality", "Employee's nationality", "Singapore", "Text", "No"],
    ["employee_code", "Internal employee number", "EMP001", "Text", "No"],
    ["job_title", "Job role", "Software Engineer", "Text", "No"],
    ["department", "Assigned department", "IT", "Text", "No"],
    ["employment_type", "Type of employment", "Full-time / Part-time / Contract", "Text", "No"],
    ["employment_status", "Current status", "Active / On Leave / Resigned", "Text", "No"],
    ["date_of_hire", "Date employee was hired", "2022-01-15", "Date (YYYY-MM-DD)", "No"],
    ["date_of_exit", "Last working date if resigned", "2023-01-15", "Date (YYYY-MM-DD)", "No"],
    ["email", "Employee's work email", "wei.ming@example.com.sg", "Email", "Yes"],
    ["phone_number", "Contact number", "+6591234567", "Text", "No"],
    ["home_address", "Residential address", "Block 123, Ang Mo Kio Avenue 6, #12-34", "Text", "No"],
    ["postal_code", "Postal code", "560123", "Text", "No"],
    ["emergency_contact_name", "Name of emergency contact", "Lim Mei Ling", "Text", "No"],
    ["emergency_contact_phone", "Emergency contact phone", "+6598765432", "Text", "No"],
    ["salary", "Monthly salary in SGD", "5000", "Number", "No"],
    ["bank_name", "Employee's bank name", "DBS Bank / OCBC / UOB", "Text", "No"],
    ["bank_account_number", "Salary payment account", "123456789", "Text", "No"],
    ["cpf_contribution", "Whether CPF deductions apply", "true / false", "Boolean", "No"],
    ["cpf_account_number", "CPF account for contributions", "S1234567D", "Text", "No"],
    ["tax_identification_number", "NRIC or FIN for income tax", "S9812345A", "Text", "No"],
    ["leave_entitlement", "Total annual leave days", "14", "Number", "No"],
    ["leave_balance", "Remaining leave days", "10", "Number", "No"],
    ["medical_entitlement", "Total medical leave days", "14", "Number", "No"],
    ["benefits_enrolled", "List of company benefits", "Health Insurance, Dental, Transport Allowance", "Text (comma-separated)", "No"],
    ["work_permit_number", "Work visa/permit number", "G1234567K", "Text", "No"],
    ["work_pass_expiry_date", "Expiry date of work pass", "2025-01-15", "Date (YYYY-MM-DD)", "No"],
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
  
  // Singapore-specific example row
  const exampleRow = [
    "Tan Wei Ming",
    "",
    "1990-01-15",
    "Male",
    "Singapore",
    "EMP001",
    "Software Engineer",
    "Engineering",
    "Full-time",
    "Active",
    "2022-01-15",
    "",
    "wei.ming@example.com.sg",
    "+6591234567",
    "Block 123, Ang Mo Kio Avenue 6, #12-34",
    "560123",
    "Lim Mei Ling",
    "+6598765432",
    "5000",
    "DBS Bank",
    "123456789",
    "true",
    "S1234567D",
    "S9812345A",
    "14",
    "10",
    "14",
    "Health Insurance, Dental, Transport Allowance",
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
