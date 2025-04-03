
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Employee } from '@/types/employee';
import { 
  fullEmployeeFieldList,
  getAllCategories,
  getFieldsByCategory,
  getFieldMetaByName,
  convertFieldValue,
  standardizeEmployee
} from './employeeFieldUtils';

// Function to export employees data to Excel
export const exportEmployeesToExcel = (employees: Employee[]) => {
  try {
    // Group fields by category
    const categories = getAllCategories();
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    let rowIndex = 0;
    
    // Add category headers
    categories.forEach(category => {
      const fields = getFieldsByCategory(category);
      
      // Add category header
      XLSX.utils.sheet_add_aoa(worksheet, [[category]], { origin: { r: rowIndex, c: 0 } });
      rowIndex++;
      
      // Add field headers
      const headers = fields.map(field => field.label);
      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: { r: rowIndex, c: 0 } });
      rowIndex++;
      
      // Add employee data
      employees.forEach(employee => {
        const rowData = fields.map(field => {
          const value = employee[field.name as keyof Employee];
          return value === null || value === undefined ? '' : value;
        });
        
        XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: { r: rowIndex, c: 0 } });
        rowIndex++;
      });
      
      // Add empty row after each category
      XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: { r: rowIndex, c: 0 } });
      rowIndex++;
    });
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Save file
    saveAs(blob, `Employees_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting employees to Excel:', error);
    return false;
  }
};

// Function to generate employee template for import
export const generateEmployeeTemplate = () => {
  try {
    // Group fields by category
    const categories = getAllCategories();
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    let colIndex = 0;
    
    // Add header row with field names
    const headerRow: string[] = [];
    const sampleDataRow: any[] = [];
    const blankDataRow: any[] = [];
    
    // Process fields by category
    categories.forEach(category => {
      const fields = getFieldsByCategory(category);
      
      // Add category header
      headerRow.push(`--- ${category} ---`);
      sampleDataRow.push('');
      blankDataRow.push('');
      colIndex++;
      
      // Add fields
      fields.forEach(field => {
        headerRow.push(field.label);
        
        // Add sample data based on field type
        switch (field.type) {
          case 'text':
            sampleDataRow.push(field.name === 'full_name' ? 'John Doe' : 'Sample Text');
            break;
          case 'email':
            sampleDataRow.push('johndoe@example.com');
            break;
          case 'date':
            sampleDataRow.push('2023-01-01');
            break;
          case 'number':
            sampleDataRow.push(1000);
            break;
          case 'dropdown':
            sampleDataRow.push(field.options && field.options.length > 0 ? field.options[0] : '');
            break;
          case 'boolean':
            sampleDataRow.push('Yes');
            break;
          default:
            sampleDataRow.push('');
        }
        
        blankDataRow.push('');
        colIndex++;
      });
    });
    
    // Add rows to worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: { r: 0, c: 0 } });
    XLSX.utils.sheet_add_aoa(worksheet, [sampleDataRow], { origin: { r: 1, c: 0 } });
    XLSX.utils.sheet_add_aoa(worksheet, [blankDataRow], { origin: { r: 2, c: 0 } });
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Template');
    
    // Save workbook as Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Employee_Import_Template_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error generating employee template:', error);
    return false;
  }
};

// Helper function to parse employee data from Excel for import
export const parseEmployeeDataFromExcel = (headerRow: any[], dataRow: any[]): Partial<Employee> => {
  const employee: Partial<Employee> = {};
  
  headerRow.forEach((header, index) => {
    if (!header || typeof header !== 'string') return;
    
    // Skip category headers which are marked with "---"
    if (header.includes('---')) return;
    
    // Find the corresponding field by label
    const field = fullEmployeeFieldList.find(f => f.label === header);
    
    if (field && index < dataRow.length) {
      const rawValue = dataRow[index];
      
      // Only process values that aren't empty
      if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
        const fieldName = field.name as keyof Employee;
        
        try {
          const convertedValue = convertFieldValue(field, rawValue);
          
          if (convertedValue !== null) {
            (employee as any)[fieldName] = convertedValue;
          }
        } catch (error) {
          console.error(`Error converting field ${field.name}:`, error);
          // Continue with other fields even if one fails
        }
      }
    }
  });
  
  return standardizeEmployee(employee);
};

// Main function to process employee import from Excel
export const processEmployeeImport = async (file: File): Promise<Partial<Employee>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) {
          throw new Error('Invalid template format or empty file');
        }
        
        // Extract header row (field names)
        const headerRow = jsonData[0];
        
        // Process data rows (starting from row 2)
        const employees: Partial<Employee>[] = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const dataRow = jsonData[i];
          
          // Skip empty rows
          if (!dataRow || dataRow.length === 0 || !dataRow.some(cell => cell !== null && cell !== undefined && cell !== '')) {
            continue;
          }
          
          try {
            const employeeData = parseEmployeeDataFromExcel(headerRow, dataRow);
            
            // Validate required fields
            if (employeeData.full_name && employeeData.email) {
              // Safety check: Ensure 'allowances' is not directly included in the employee data
              // as it should be handled separately in a dedicated table
              if ('allowances' in employeeData && typeof employeeData.allowances !== 'number') {
                delete employeeData.allowances;
              }
              
              employees.push(employeeData);
            }
          } catch (error) {
            console.error(`Error processing row ${i}:`, error);
            // Continue with other rows even if one fails
          }
        }
        
        resolve(employees);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};
