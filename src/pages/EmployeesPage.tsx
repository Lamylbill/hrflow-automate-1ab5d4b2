
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
  Trash
} from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  employment_type?: 'Full-time' | 'Part-time' | 'Contract' | null;
  employment_status?: 'Active' | 'On Leave' | 'Resigned' | null;
  salary?: number | null;
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
  
  // Fetch employees from Supabase
  useEffect(() => {
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
        
        // Fetch employees from the database
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', user.id)
          .order('full_name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setEmployees(data || []);
      } catch (err: any) {
        console.error('Error fetching employees:', err);
        setError(err.message || 'An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, [user, toast]);
  
  // Generate CSV template for employee import
  const generateCSVTemplate = () => {
    // Header row with all employee fields
    const headers = [
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

    // Create a sample row
    const sampleRow = [
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

    return [headers.join(','), sampleRow.join(',')].join('\n');
  };

  // Download CSV template
  const downloadCSVTemplate = () => {
    const csvContent = generateCSVTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Employee template downloaded successfully.",
      duration: 3000,
    });
  };
  
  // Extract unique departments from employees
  const departments = Array.from(new Set(employees.map(emp => emp.department).filter(Boolean) as string[]));
  
  // Extract unique statuses from employees
  const statuses = Array.from(new Set(employees.map(emp => emp.employment_status).filter(Boolean) as string[]));
  
  // Filter employees based on search term and filters
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
  
  // Toggle department selection
  const toggleDepartment = (department: string) => {
    setSelectedDepartments(prev => 
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };
  
  // Toggle status selection
  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  
  // Status badge component
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
  
  // Format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Toggle view mode between list and card
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'card' : 'list');
  };
  
  return (
    <div className="px-4 sm:px-6 py-6">
      <AnimatedSection>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="mt-1 text-gray-600">
              Manage your organization's employees
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCSVTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Export Template
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
              {/* View Mode Toggle */}
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
            
              {/* Department Filter */}
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
              
              {/* Status Filter */}
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
              
              {/* Filter indicators */}
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
