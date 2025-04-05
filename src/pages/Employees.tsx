import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  UserPlus,
  Filter,
  Download,
  MoreHorizontal,
  ChevronDown,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import {
  PremiumCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui-custom/Card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

// Placeholder data
const employees = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', department: 'Marketing', position: 'Marketing Director', status: 'Active', joinDate: '2021-05-12' },
  { id: 2, name: 'Michael Chen', email: 'michael.c@example.com', department: 'Engineering', position: 'Senior Developer', status: 'Active', joinDate: '2022-01-15' },
  { id: 3, name: 'Priya Patel', email: 'priya.p@example.com', department: 'HR', position: 'HR Manager', status: 'Active', joinDate: '2020-11-03' },
  { id: 4, name: 'David Kim', email: 'david.k@example.com', department: 'Finance', position: 'Financial Analyst', status: 'On Leave', joinDate: '2022-03-22' },
  { id: 5, name: 'Lisa Wong', email: 'lisa.w@example.com', department: 'Sales', position: 'Sales Representative', status: 'Active', joinDate: '2021-08-07' }
];

const sortFunctions = {
  name: (a, b, dir) => dir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  department: (a, b, dir) => dir === 'asc' ? a.department.localeCompare(b.department) : b.department.localeCompare(a.department),
  position: (a, b, dir) => dir === 'asc' ? a.position.localeCompare(b.position) : b.position.localeCompare(a.position),
  status: (a, b, dir) => dir === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status),
  joinDate: (a, b, dir) => dir === 'asc' ? new Date(a.joinDate) - new Date(b.joinDate) : new Date(b.joinDate) - new Date(a.joinDate)
};

const Employees = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selected, setSelected] = useState<number[]>([]);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/login');
  }, [isAuthenticated, isLoading, navigate]);

  const toggleSelectAll = () => {
    if (selected.length === filteredEmployees.length) setSelected([]);
    else setSelected(filteredEmployees.map(emp => emp.id));
  };

  const toggleSelectOne = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredEmployees = employees
    .filter(e => [e.name, e.email, e.department, e.position].some(v => v.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a, b) => sortFunctions[sortBy](a, b, sortDirection));

  const SortIndicator = ({ column }) => sortBy === column ? (sortDirection === 'asc' ? <SortAsc className="inline h-4 w-4 ml-1" /> : <SortDesc className="inline h-4 w-4 ml-1" />) : null;

  const getStatusColor = status => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
              <p className="text-gray-600">Manage your employee directory</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
              <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
              <Button variant="primary" size="sm"><UserPlus className="mr-2 h-4 w-4" /> Add Employee</Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <PremiumCard className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search employees..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </CardContent>
          </PremiumCard>
        </AnimatedSection>

        {selected.length > 0 && (
          <div className="mb-3 text-sm font-medium text-gray-700">
            {selected.length} employee{selected.length > 1 ? 's' : ''} selected
          </div>
        )}

        <AnimatedSection delay={200}>
          <PremiumCard>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><Checkbox checked={selected.length === filteredEmployees.length} onCheckedChange={toggleSelectAll} /></TableHead>
                      <TableHead onClick={() => setSortBy('name')} className="cursor-pointer">Name <SortIndicator column="name" /></TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead onClick={() => setSortBy('department')} className="cursor-pointer">Department <SortIndicator column="department" /></TableHead>
                      <TableHead onClick={() => setSortBy('position')} className="cursor-pointer">Position <SortIndicator column="position" /></TableHead>
                      <TableHead onClick={() => setSortBy('status')} className="cursor-pointer">Status <SortIndicator column="status" /></TableHead>
                      <TableHead onClick={() => setSortBy('joinDate')} className="cursor-pointer">Join Date <SortIndicator column="joinDate" /></TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map(emp => (
                      <TableRow key={emp.id} className={selected.includes(emp.id) ? 'bg-indigo-50' : ''}>
                        <TableCell><Checkbox checked={selected.includes(emp.id)} onCheckedChange={() => toggleSelectOne(emp.id)} /></TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-hrflow-blue/10 flex items-center justify-center text-hrflow-blue font-medium mr-2">
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {emp.name}
                          </div>
                        </TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{emp.position}</TableCell>
                        <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>{emp.status}</span></TableCell>
                        <TableCell>{new Date(emp.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Change Status</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </PremiumCard>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Employees;
