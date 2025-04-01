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
    data: any[][]
  }[]
) {
  const wb = XLSX.utils.book_new();
  sheets.forEach(sheet => {
    const ws = XLSX.utils.aoa_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(data, `${filename}.xlsx`);
}

/**
 * Full schema fields for employee, grouped by logical categories
 */
const employeeFieldSchema = [
  ["Full Name", "Employee's full name", "Tan Wei Ming", "Text", "Yes", "Personal"],
  ["First Name", "Employee's first name", "Wei Ming", "Text", "No", "Personal"],
  ["Last Name", "Employee's last name", "Tan", "Text", "No", "Personal"],
  ["Middle Name", "Employee's middle name", "", "Text", "No", "Personal"],
  ["Alias Name", "Employee's alias", "William", "Text", "No", "Personal"],
  ["Local Name", "Employee's name in local language", "陈伟明", "Text", "No", "Personal"],
  ["Title", "Employee's title (e.g. Mr/Ms/Dr)", "Mr", "Text", "No", "Personal"],
  ["Profile Picture", "URL to profile image", "https://example.com/image.jpg", "URL", "No", "Personal"],
  ["Date of Birth", "Employee's birth date", "1990-01-15", "Date (YYYY-MM-DD)", "No", "Personal"],
  ["Birth Place", "Place of birth", "Singapore", "Text", "No", "Personal"],
  ["Gender", "Gender of employee", "Male / Female", "Text", "No", "Personal"],
  ["Nationality", "Nationality of employee", "Singapore", "Text", "No", "Personal"],
  ["Email", "Employee's work email", "wei.ming@example.com.sg", "Email", "Yes", "Personal"],
  ["Phone Number", "Primary contact number", "+6591234567", "Text", "No", "Personal"],
  ["Home Address", "Residential address", "Block 123, Ang Mo Kio Avenue 6, #12-34", "Text", "No", "Personal"],
  ["Postal Code", "Postal code", "560123", "Text", "No", "Personal"],
  ["Emergency Contact Name", "Name of emergency contact", "Lim Mei Ling", "Text", "No", "Emergency"],
  ["Emergency Contact Phone", "Emergency contact number", "+6598765432", "Text", "No", "Emergency"],
  ["Job Title", "Job role", "Software Engineer", "Text", "No", "Employment"],
  ["Department", "Assigned department", "IT", "Text", "No", "Employment"],
  ["Employment Type", "Type of employment", "Full-time", "Text", "No", "Employment"],
  ["Employment Status", "Employment status", "Active", "Text", "No", "Employment"],
  ["Date of Hire", "Date employee was hired", "2022-01-15", "Date (YYYY-MM-DD)", "No", "Employment"],
  ["Salary", "Monthly salary in SGD", "5000", "Number", "No", "Compensation"],
  ["Bank Name", "Bank name", "DBS Bank", "Text", "No", "Compensation"],
  ["Bank Account Number", "Bank account for salary", "123456789", "Text", "No", "Compensation"],
  ["CPF Contribution", "Whether CPF deductions apply", "true", "Boolean", "No", "Compliance"],
  ["CPF Account Number", "CPF account number", "S1234567D", "Text", "No", "Compliance"],
  ["Tax Identification Number", "NRIC or FIN for income tax", "S9812345A", "Text", "No", "Compliance"],
  ["Leave Entitlement", "Total annual leave days", "14", "Number", "No", "Benefits"],
  ["Leave Balance", "Remaining leave days", "10", "Number", "No", "Benefits"],
  ["Medical Entitlement", "Medical leave entitlement", "14", "Number", "No", "Benefits"],
  ["Work Permit Number", "Work visa/permit number", "G1234567K", "Text", "No", "Compliance"],
  ["Work Pass Expiry Date", "Expiry of work pass", "2025-01-15", "Date (YYYY-MM-DD)", "No", "Compliance"],
  ["Contract Signed", "Whether contract is signed", "true", "Boolean", "No", "Contract"],
  ["Probation Status", "Probation status", "Under Probation", "Text", "No", "Probation"],
  ["Notes", "HR/Admin notes", "Excellent performer", "Text", "No", "Others"]
];

export function generateEmployeeTemplate() {
  const headers = employeeFieldSchema.map(f => f[0]);
  const exampleRow = employeeFieldSchema.map(f => f[2]);
  const emptyRow = Array(headers.length).fill("");

  const instructions = [["Field Label", "Field Name", "Description", "Example", "Type", "Required", "Category"], ...employeeFieldSchema];

  generateExcel("Employee_Template_Full", [
    { name: "Instructions", data: instructions },
    { name: "Template", data: [headers, exampleRow, emptyRow] }
  ]);
}
