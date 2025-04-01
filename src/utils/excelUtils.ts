import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Employee } from '@/types/employee';

/**
 * Generates and downloads an Excel file with the provided data
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
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(data, `${filename}.xlsx`);
}

/**
 * Export all employee data to Excel including all fields
 */
export function exportEmployeesToExcel(employees: Employee[]) {
  if (!employees || employees.length === 0) return false;

  const allFields = new Set<string>();
  employees.forEach(employee => {
    Object.keys(employee).forEach(key => {
      if (key !== 'id' && key !== 'user_id') {
        allFields.add(key);
      }
    });
  });

  const headers = Array.from(allFields).map(field =>
    field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );

  const data = employees.map(employee =>
    Array.from(allFields).map(field => {
      const value = employee[field as keyof Employee];
      return value === null || value === undefined
        ? ''
        : Array.isArray(value)
        ? value.join(', ')
        : typeof value === 'boolean'
        ? value ? 'Yes' : 'No'
        : value;
    })
  );

  const exportData = [headers, ...data];
  generateExcel('employees_export', [{ name: 'Employees', data: exportData }]);
  return true;
}

/**
 * Generates and downloads an employee template Excel file with horizontal orientation
 */
export function generateEmployeeTemplate() {
  const fieldsByCategory = getEmployeeFieldsByCategory();

  const categoryOrder = [
    'personal', 'address', 'emergency', 'employment',
    'probation', 'contract', 'compensation', 'benefits',
    'compliance', 'attendance', 'exit', 'others'
  ];

  const headerRow: string[] = [];
  const exampleRow: string[] = [];
  categoryOrder.forEach(category => {
    if (fieldsByCategory[category]) {
      fieldsByCategory[category].forEach(field => {
        headerRow.push(field.label);
        exampleRow.push(field.example || '');
      });
    }
  });

  const emptyRow = Array(headerRow.length).fill("");

  const instructionsData = [[
    "Field Label", "Field Name", "Description",
    "Example", "Type", "Required", "Category"
  ]];

  categoryOrder.forEach(category => {
    if (fieldsByCategory[category]) {
      fieldsByCategory[category].forEach(field => {
        instructionsData.push([
          field.label,
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

  generateExcel("employee_template", [
    { name: "Instructions", data: instructionsData },
    { name: "Template", data: [headerRow, exampleRow, emptyRow] }
  ]);

  return true;
}

/**
 * Returns structured employee fields by category
 */
function getEmployeeFieldsByCategory() {
  // Keep your full existing `getEmployeeFieldsByCategory()` implementation here
  // (already shared in your previous message)
  return {} as Record<string, any[]>; // Placeholder to satisfy TypeScript
}
