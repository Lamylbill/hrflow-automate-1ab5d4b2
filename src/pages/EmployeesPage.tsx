
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
  AlertCircle
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
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

// Placeholder Employee Type Definition for future implementation
interface Employee {
  id: string;
  full_name: string;
  profile_pic?: string | null;
  job_title: string;
  department: string;
  email: string;
  phone_number: string | null;
  date_of_hire: string;
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | null;
  salary: number;
  status: 'Active' | 'On Leave' | 'Resigned' | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
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
        
        console.log('User is authenticated, but employees functionality is not yet implemented');
        
        // Placeholder until employee tables are created
        setEmployees([]);
        
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, [toast, user]);
  
  // Extract unique departments (placeholder)
  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  
  // Extract unique statuses (placeholder)
  const statuses = Array.from(new Set(employees.map(emp => emp.status).filter(Boolean) as string[]));
  
  // Filter employees based on search term and filters (placeholder)
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.job_title.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = selectedDepartments.length === 0 || 
      selectedDepartments.includes(employee.department);
      
    const matchesStatus = selectedStatuses.length === 0 || 
      (employee.status && selectedStatuses.includes(employee.status));
      
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
  const StatusBadge = ({ status }: { status: string | null }) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    switch (status) {
      case 'Active':
        return <Badge variant="success" className="font-medium">Active</Badge>;
      case 'On Leave':
        return <Badge variant="warning" className="font-medium">On Leave</Badge>;
      case 'Resigned':
        return <Badge variant="danger" className="font-medium">Resigned</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="px-2 sm:px-0">
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
            <Button variant="outline" size="sm">
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
          
          <div className="flex flex-wrap gap-2">
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
                {departments.map(department => (
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
                ))}
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
                {statuses.map(status => (
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
                ))}
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
      </AnimatedSection>
      
      <AnimatedSection delay={200}>
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      
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
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Employee Management Coming Soon</h3>
                        <p className="text-gray-600 max-w-md text-center mb-4">
                          The employee management feature is currently under development. 
                          Check back soon to add and manage your organization's employees.
                        </p>
                        <Button variant="outline">Back to Dashboard</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage src={employee.profile_pic} />
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              {employee.full_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.full_name}</div>
                            <div className="text-sm text-gray-500">{employee.job_title}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{employee.email}</div>
                          <div className="text-gray-500">{employee.phone_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{employee.employment_type}</div>
                          <div className="text-gray-500">Since {formatDate(employee.date_of_hire)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={employee.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Employee</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default EmployeesPage;
