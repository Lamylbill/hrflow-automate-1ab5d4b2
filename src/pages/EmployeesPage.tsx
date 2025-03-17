
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

// Employee Type Definition
interface Employee {
  id: string;
  fullName: string;
  profilePicture?: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  dateOfHire: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  salary: number;
  status: 'Active' | 'On Leave' | 'Resigned';
}

// Sample Employee Data
const sampleEmployees: Employee[] = [
  {
    id: '1',
    fullName: 'John Doe',
    profilePicture: '/lovable-uploads/3bf9aea9-07cc-4942-b0a6-e00cdb531f71.png',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    email: 'john.doe@hrflow.com',
    phone: '(555) 123-4567',
    dateOfHire: '2022-03-15',
    employmentType: 'Full-time',
    salary: 85000,
    status: 'Active',
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    profilePicture: '/lovable-uploads/16579a3d-78a9-4018-a007-abf6f8fc7c9c.png',
    jobTitle: 'UI/UX Designer',
    department: 'Design',
    email: 'jane.smith@hrflow.com',
    phone: '(555) 987-6543',
    dateOfHire: '2021-08-10',
    employmentType: 'Full-time',
    salary: 78000,
    status: 'Active',
  },
  {
    id: '3',
    fullName: 'Michael Johnson',
    jobTitle: 'Project Manager',
    department: 'Product',
    email: 'michael.johnson@hrflow.com',
    phone: '(555) 567-8901',
    dateOfHire: '2020-11-05',
    employmentType: 'Full-time',
    salary: 95000,
    status: 'On Leave',
  },
  {
    id: '4',
    fullName: 'Sarah Williams',
    jobTitle: 'HR Specialist',
    department: 'Human Resources',
    email: 'sarah.williams@hrflow.com',
    phone: '(555) 234-5678',
    dateOfHire: '2022-01-20',
    employmentType: 'Part-time',
    salary: 45000,
    status: 'Active',
  },
  {
    id: '5',
    fullName: 'Robert Brown',
    jobTitle: 'Frontend Developer',
    department: 'Engineering',
    email: 'robert.brown@hrflow.com',
    phone: '(555) 345-6789',
    dateOfHire: '2021-05-15',
    employmentType: 'Contract',
    salary: 70000,
    status: 'Resigned',
  },
];

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  
  // Fetch employees (simulated)
  useEffect(() => {
    const loadEmployees = () => {
      try {
        // In a real implementation, this would be an API call
        setEmployees(sampleEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(loadEmployees, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Extract unique departments
  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  
  // Extract unique statuses
  const statuses = Array.from(new Set(employees.map(emp => emp.status)));
  
  // Filter employees based on search term and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = selectedDepartments.length === 0 || 
      selectedDepartments.includes(employee.department);
      
    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.includes(employee.status);
      
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
  const StatusBadge = ({ status }: { status: string }) => {
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
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage src={employee.profilePicture} />
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              {employee.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.fullName}</div>
                            <div className="text-sm text-gray-500">{employee.jobTitle}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{employee.email}</div>
                          <div className="text-gray-500">{employee.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{employee.employmentType}</div>
                          <div className="text-gray-500">Since {new Date(employee.dateOfHire).toLocaleDateString()}</div>
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
