
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  Filter, 
  Download, 
  Upload,
  ChevronDown, 
  Check, 
  X,
  AlertCircle,
  ListFilter,
  Grid,
  Eye,
  Edit,
  Trash,
  FileUp
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui-custom/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateEmployeeTemplate, generateExcel } from '@/utils/excelUtils';
import { NotificationBell } from '@/components/ui-custom/NotificationBell';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';

// Employee Type Definition based on our database structure
interface Employee {
  id: string;
  user_id: string;
  full_name: string;
  profile_picture?: string | null;
  job_title?: string | null;
  department?: string | null;
  email: string;
  phone_number?: string | null;
  date_of_hire?: string | null;
  employment_type?: string | null;
  employment_status?: string | null;
  date_of_exit?: string | null;
  employee_code?: string | null;
  gender?: string | null;
  nationality?: string | null;
  date_of_birth?: string | null;
  reporting_manager?: string | null;
  home_address?: string | null;
  postal_code?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  salary?: number | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  cpf_contribution?: boolean | null;
  cpf_account_number?: string | null;
  tax_identification_number?: string | null;
  leave_entitlement?: number | null;
  leave_balance?: number | null;
  medical_entitlement?: number | null;
  benefits_enrolled?: string[] | null;
  work_permit_number?: string | null;
  work_pass_expiry_date?: string | null;
  contract_signed?: boolean | null;
  probation_status?: string | null;
  last_performance_review?: string | null;
  performance_score?: number | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// View mode type
type ViewMode = 'list' | 'card';

// Employee Details Modal Component
const EmployeeDetailsModal = ({ employee }: { employee: Employee }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={employee.profile_picture || undefined} />
              <AvatarFallback className="bg-gray-200 text-gray-700">
                {employee.full_name?.split(' ').map(n => n?.[0]).join('') || '?'}
              </AvatarFallback>
            </Avatar>
            <span>{employee.full_name}</span>
            <Badge className="ml-2" variant={
              employee.employment_status === 'Active' ? 'success' :
              employee.employment_status === 'On Leave' ? 'warning' :
              employee.employment_status === 'Resigned' ? 'destructive' : 'outline'
            }>
              {employee.employment_status || 'Unknown'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="personal" className="flex-1 overflow-hidden">
          <TabsList className="w-full justify-start border-b px-1">
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="contact">Contact & Address</TabsTrigger>
            <TabsTrigger value="payroll">Payroll & Financial</TabsTrigger>
            <TabsTrigger value="leave">Leave & Benefits</TabsTrigger>
            <TabsTrigger value="compliance">Compliance & HR</TabsTrigger>
            <TabsTrigger value="performance">Performance & Notes</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 p-4">
            <TabsContent value="personal" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p>{employee.full_name || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                  <p>{employee.gender || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                  <p>{employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Nationality</h3>
                  <p>{employee.nationality || 'Not available'}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="employment" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Job Title</h3>
                  <p>{employee.job_title || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p>{employee.department || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Employee Code</h3>
                  <p>{employee.employee_code || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Employment Type</h3>
                  <p>{employee.employment_type || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Employment Status</h3>
                  <p>{employee.employment_status || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Date of Hire</h3>
                  <p>{employee.date_of_hire ? new Date(employee.date_of_hire).toLocaleDateString() : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Date of Exit</h3>
                  <p>{employee.date_of_exit ? new Date(employee.date_of_exit).toLocaleDateString() : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Reporting Manager</h3>
                  <p>Not available</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{employee.email || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p>{employee.phone_number || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Home Address</h3>
                  <p>{employee.home_address || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Postal Code</h3>
                  <p>{employee.postal_code || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Emergency Contact</h3>
                  <p>{employee.emergency_contact_name || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Emergency Contact Phone</h3>
                  <p>{employee.emergency_contact_phone || 'Not available'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payroll" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Salary</h3>
                  <p>{employee.salary ? `$${employee.salary.toLocaleString()}` : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Bank Name</h3>
                  <p>{employee.bank_name || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Bank Account Number</h3>
                  <p>{employee.bank_account_number || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">CPF Contribution</h3>
                  <p>{employee.cpf_contribution !== undefined ? (employee.cpf_contribution ? 'Yes' : 'No') : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">CPF Account Number</h3>
                  <p>{employee.cpf_account_number || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Tax Identification Number</h3>
                  <p>{employee.tax_identification_number || 'Not available'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leave" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Leave Entitlement</h3>
                  <p>{employee.leave_entitlement !== undefined ? `${employee.leave_entitlement} days` : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Leave Balance</h3>
                  <p>{employee.leave_balance !== undefined ? `${employee.leave_balance} days` : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Medical Entitlement</h3>
                  <p>{employee.medical_entitlement !== undefined ? `${employee.medical_entitlement} days` : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Benefits Enrolled</h3>
                  <p>{employee.benefits_enrolled?.length ? employee.benefits_enrolled.join(', ') : 'None'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Work Permit Number</h3>
                  <p>{employee.work_permit_number || 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Work Pass Expiry Date</h3>
                  <p>{employee.work_pass_expiry_date ? new Date(employee.work_pass_expiry_date).toLocaleDateString() : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Contract Signed</h3>
                  <p>{employee.contract_signed !== undefined ? (employee.contract_signed ? 'Yes' : 'No') : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Probation Status</h3>
                  <p>{employee.probation_status || 'Not available'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Last Performance Review</h3>
                  <p>{employee.last_performance_review ? new Date(employee.last_performance_review).toLocaleDateString() : 'Not available'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Performance Score</h3>
                  <p>{employee.performance_score !== undefined ? `${employee.performance_score}/10` : 'Not available'}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="whitespace-pre-line">{employee.notes || 'No notes available'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Document Management Coming Soon</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  The document management feature for employees is currently under development.
                  Check back soon to upload and manage employee documents.
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Employee Card Component for Card View
const EmployeeCard = ({ employee }: { employee: Employee }) => {
  return (
    <div className="bg-white rounded-lg shadow border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={employee.profile_picture || undefined} />
          <AvatarFallback className="bg-gray-200 text-gray-700">
            {employee.full_name?.split(' ').map(n => n?.[0]).join('') || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h3 className="font-medium">{employee.full_name}</h3>
          <p className="text-sm text-gray-500">{employee.job_title || 'No Job Title'}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="text-sm">
          <span className="text-gray-500">Department:</span> {employee.department || 'N/A'}
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Email:</span> {employee.email}
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Status:</span> <Badge variant={
            employee.employment_status === 'Active' ? 'success' :
            employee.employment_status === 'On Leave' ? 'warning' :
            employee.employment_status === 'Resigned' ? 'destructive' : 'outline'
          }>
            {employee.employment_status || 'Unknown'}
          </Badge>
        </div>
      </div>
      
      <div className="flex justify-end gap-1 border-t pt-2">
        <EmployeeDetailsModal employee={employee} />
        <Button variant="ghost" size="sm" className="px-2">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="px-2 text-red-500 hover:text-red-700">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ImportEmployeesDialog = ({ onImportSuccess }: { onImportSuccess?: () => void }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const downloadTemplate = () => {
    generateEmployeeTemplate();
    toast({
      title: "Template Downloaded",
      description: "The employee template has been downloaded to your device.",
    });
  };
  
  const importEmployees = async () => {
    if (!file || !user) return;
    
    setIsImporting(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const worksheetName = workbook.SheetNames[1];
          const worksheet = workbook.Sheets[worksheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            range: 2
          }) as any[][];
          
          const filteredData = jsonData.filter(row => 
            row.length > 0 && row.some(cell => cell !== undefined && cell !== '')
          );
          
          if (filteredData.length === 0) {
            throw new Error("No valid data found in the import file");
          }
          
          const headers = workbook.Sheets[worksheetName] ? 
            XLSX.utils.sheet_to_json(workbook.Sheets[worksheetName], { 
              header: 1, 
              range: 0, 
              blankrows: false 
            })[0] as string[] : [];
          
          const employees = filteredData.map(row => {
            const employee: any = { user_id: user.id };
            
            headers.forEach((header, index) => {
              if (header && row[index] !== undefined) {
                if (header === 'benefits_enrolled' && row[index]) {
                  employee[header] = row[index].toString().split(',').map((s: string) => s.trim());
                } else if (header === 'cpf_contribution' || header === 'contract_signed') {
                  const value = row[index].toString().toLowerCase();
                  employee[header] = value === 'true' || value === 'yes';
                } else if (['salary', 'leave_entitlement', 'leave_balance', 'medical_entitlement', 'performance_score'].includes(header) && row[index]) {
                  employee[header] = Number(row[index]);
                } else {
                  employee[header] = row[index];
                }
              }
            });
            
            if (!employee.full_name || !employee.email) {
              throw new Error("All employees must have a full name and email");
            }
            
            return employee;
          });
          
          for (const employee of employees) {
            const { error } = await supabase.from('employees').insert(employee);
            if (error) throw error;
          }
          
          toast({
            title: "Import Successful",
            description: `Successfully imported ${employees.length} employees.`,
          });
          
          if (onImportSuccess) onImportSuccess();
        } catch (error: any) {
          console.error("Error importing employees:", error);
          toast({
            title: "Import Failed",
            description: error.message || "An error occurred while importing employees.",
            variant: "destructive",
          });
        } finally {
          setIsImporting(false);
          setFile(null);
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      console.error("Error reading file:", error);
      toast({
        title: "Import Failed",
        description: error.message || "An error occurred while reading the file.",
        variant: "destructive",
      });
      setIsImporting(false);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Employees</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex flex-col items-center justify-center py-4 gap-4">
            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            
            <div className="border rounded-md p-6 w-full">
              <div className="flex flex-col items-center gap-2">
                <FileUp className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-500">
                  {file ? file.name : "Upload your employee data Excel file"}
                </p>
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" disabled={isImporting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={importEmployees} 
            disabled={!file || isImporting}
          >
            {isImporting ? "Importing..." : "Import Employees"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { toast } = useToast();
  const { user } = useAuth();
  
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        console.error('No authenticated user found');
        setError('You must be logged in to view employees');
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .order('full_name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setEmployees(data as Employee[]);
    } catch (err: any) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEmployees();
  }, [user, toast]);
  
  const exportEmployees = () => {
    if (employees.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no employees to export.",
        variant: "destructive",
      });
      return;
    }
    
    const headers = [
      "Full Name",
      "Email",
      "Job Title",
      "Department",
      "Employment Type",
      "Employment Status",
      "Date of Hire",
      "Phone Number",
      "Employee Code"
    ];
    
    const data = employees.map(employee => [
      employee.full_name,
      employee.email,
      employee.job_title || "",
      employee.department || "",
      employee.employment_type || "",
      employee.employment_status || "",
      employee.date_of_hire || "",
      employee.phone_number || "",
      employee.employee_code || ""
    ]);
    
    data.unshift(headers);
    
    generateExcel("employees_export", [
      {
        name: "Employees",
        data: data
      }
    ]);
    
    toast({
      title: "Export Successful",
      description: "Employees exported successfully.",
      duration: 3000,
    });
  };
  
  const departments = Array.from(new Set(employees.map(emp => emp.department).filter(Boolean) as string[]));
  
  const statuses = Array.from(new Set(employees.map(emp => emp.employment_status).filter(Boolean) as string[]));
  
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = selectedDepartments.length === 0 || 
      (employee.department && selectedDepartments.includes(employee.department));
      
    const matchesStatus = selectedStatuses.length === 0 || 
      (employee.employment_status && selectedStatuses.includes(employee.employment_status));
      
    return matchesSearch && matchesDepartment && matchesStatus;
  });
  
  const toggleDepartment = (department: string) => {
    setSelectedDepartments(prev => 
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };
  
  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  
  const StatusBadge = ({ status }: { status: string | null | undefined }) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    switch (status) {
      case 'Active':
        return <Badge variant="success" className="font-medium">Active</Badge>;
      case 'On Leave':
        return <Badge variant="warning" className="font-medium">On Leave</Badge>;
      case 'Resigned':
        return <Badge variant="destructive" className="font-medium">Resigned</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'card' : 'list');
  };
  
  return (
    <div className="px-4 sm:px-6 py-6">
      <AnimatedSection>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <NotificationBell />
            <p className="mt-1 text-gray-600">
              Manage your organization's employees
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <ImportEmployeesDialog onImportSuccess={fetchEmployees} />
            <Button variant="outline" size="sm" onClick={exportEmployees}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="primary" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>
      </AnimatedSection>
      
      <AnimatedSection delay={100}>
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search employees..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center justify-between w-full sm:w-auto">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleViewMode}
                className="flex gap-2 items-center"
              >
                {viewMode === 'list' ? (
                  <>
                    <Grid className="h-4 w-4" />
                    <span>Card View</span>
                  </>
                ) : (
                  <>
                    <ListFilter className="h-4 w-4" />
                    <span>List View</span>
                  </>
                )}
              </Button>
            
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Department
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {departments.length > 0 ? (
                    departments.map(department => (
                      <DropdownMenuItem 
                        key={department}
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleDepartment(department);
                        }}
                      >
                        <div className="rounded-sm border w-4 h-4 flex items-center justify-center">
                          {selectedDepartments.includes(department) ? 
                            <Check className="h-3 w-3" /> : null}
                        </div>
                        <span>{department}</span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No departments available
                    </DropdownMenuItem>
                  )}
                  {selectedDepartments.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setSelectedDepartments([])}
                      >
                        Clear filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Status
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {statuses.length > 0 ? (
                    statuses.map(status => (
                      <DropdownMenuItem 
                        key={status}
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleStatus(status);
                        }}
                      >
                        <div className="rounded-sm border w-4 h-4 flex items-center justify-center">
                          {selectedStatuses.includes(status) ? 
                            <Check className="h-3 w-3" /> : null}
                        </div>
                        <span>{status}</span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No statuses available
                    </DropdownMenuItem>
                  )}
                  {selectedStatuses.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setSelectedStatuses([])}
                      >
                        Clear filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {selectedDepartments.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1 bg-blue-50">
                  Departments: {selectedDepartments.length}
                  <X
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedDepartments([])}
                  />
                </Badge>
              )}
              
              {selectedStatuses.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1 bg-blue-50">
                  Statuses: {selectedStatuses.length}
                  <X
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedStatuses([])}
                  />
                </Badge>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>
      
      <AnimatedSection delay={200}>
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      
        {viewMode === 'list' ? (
          <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Employment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                          <span className="ml-2">Loading employees...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No Employees Found</h3>
                          <p className="text-gray-600 max-w-md text-center mb-4">
                            {employees.length === 0 
                              ? "You haven't added any employees yet. Click the 'Add Employee' button to get started."
                              : "No employees match your current search filters. Try adjusting your search or filters."}
                          </p>
                          <Button variant="primary">Add Employee</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={employee.profile_picture || undefined} />
                              <AvatarFallback className="bg-gray-200 text-gray-700">
                                {employee.full_name?.split(' ').map(n => n?.[0]).join('') || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{employee.full_name}</div>
                              <div className="text-sm text-gray-500">{employee.job_title || 'No Job Title'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{employee.email}</div>
                            <div className="text-gray-500">{employee.phone_number || 'No phone'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{employee.employment_type || 'N/A'}</div>
                            <div className="text-gray-500">Since {formatDate(employee.date_of_hire)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={employee.employment_status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <EmployeeDetailsModal employee={employee} />
                            <Button variant="ghost" size="sm" className="px-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="px-2 text-red-500 hover:text-red-700">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading employees...</span>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-white shadow-sm p-8 text-center">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Employees Found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  {employees.length === 0 
                    ? "You haven't added any employees yet. Click the 'Add Employee' button to get started."
                    : "No employees match your current search filters. Try adjusting your search or filters."}
                </p>
                <Button variant="primary">Add Employee</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEmployees.map(employee => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatedSection>
    </div>
  );
};

export default EmployeesPage;
