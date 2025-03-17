
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Types
type EmploymentType = 'Full-time' | 'Part-time' | 'Contract';
type EmployeeStatus = 'Active' | 'On Leave' | 'Resigned';

interface Employee {
  id: string;
  fullName: string;
  profilePicture?: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  employmentType: EmploymentType;
  salary: number;
  status: EmployeeStatus;
}

// Mock data for employees
const mockEmployees: Employee[] = [
  {
    id: '1',
    fullName: 'John Doe',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    jobTitle: 'Software Engineer',
    department: 'IT',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    hireDate: '2021-05-15',
    employmentType: 'Full-time',
    salary: 85000,
    status: 'Active',
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    jobTitle: 'UX Designer',
    department: 'Design',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    hireDate: '2020-11-03',
    employmentType: 'Full-time',
    salary: 78000,
    status: 'Active',
  },
  {
    id: '3',
    fullName: 'Michael Johnson',
    profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    jobTitle: 'Product Manager',
    department: 'Product',
    email: 'michael.j@example.com',
    phone: '+1 (555) 234-5678',
    hireDate: '2019-08-22',
    employmentType: 'Full-time',
    salary: 95000,
    status: 'On Leave',
  },
  {
    id: '4',
    fullName: 'Emily Wilson',
    profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
    jobTitle: 'HR Specialist',
    department: 'HR',
    email: 'emily.w@example.com',
    phone: '+1 (555) 456-7890',
    hireDate: '2022-01-10',
    employmentType: 'Part-time',
    salary: 45000,
    status: 'Active',
  },
  {
    id: '5',
    fullName: 'Robert Chen',
    profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
    jobTitle: 'Marketing Specialist',
    department: 'Marketing',
    email: 'robert.c@example.com',
    phone: '+1 (555) 567-8901',
    hireDate: '2020-06-15',
    employmentType: 'Contract',
    salary: 70000,
    status: 'Resigned',
  },
];

const EmployeesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resigned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employees..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" className="text-gray-700">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="text-gray-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Hire Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-gray-500">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={employee.profilePicture} alt={employee.fullName} />
                        <AvatarFallback>{getInitials(employee.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.fullName}</div>
                        <div className="text-sm text-gray-500">{employee.jobTitle}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                  <TableCell className="hidden lg:table-cell">{employee.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{employee.phone}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(employee.hireDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {employee.status === 'Active' && (
                        <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      )}
                      {employee.status === 'On Leave' && (
                        <div className="mr-1 h-4 w-4 rounded-full bg-yellow-400" />
                      )}
                      {employee.status === 'Resigned' && (
                        <XCircle className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
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
  );
};

export default EmployeesPage;
