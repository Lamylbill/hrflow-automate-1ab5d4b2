import React, { useState, useEffect } from 'react';
import {
  Search, PlusCircle, Download, AlertCircle,
  ListFilter, Grid, Edit, Trash
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui-custom/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent
} from '@/components/ui/dialog';
import { exportEmployeesToExcel } from '@/utils/excelUtils';
import { AddEmployeeForm } from '@/components/employees/AddEmployeeForm';
import { EmployeeDetailsDialog } from '@/components/employees/EmployeeDetailsDialog';
import { Employee } from '@/types/employee';
import { EmployeeCard } from '@/components/employees/EmployeeCard';
import { ImportEmployeesDialog } from '@/components/employees/ImportEmployeesDialog';
import { AdvancedFilterDropdown } from '@/components/employees/AdvancedFilterDropdown';

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

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        setError('You must be logged in to view employees');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .order('full_name', { ascending: true });

      if (error) throw error;

      setEmployees(data as Employee[]);
      setFilteredEmployees(data as Employee[]);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [user]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const searchResults = employees.filter(employee =>
        employee.full_name?.toLowerCase().includes(lowerSearch) ||
        employee.email?.toLowerCase().includes(lowerSearch) ||
        employee.job_title?.toLowerCase().includes(lowerSearch)
      );
      setFilteredEmployees(searchResults);
    }
  }, [searchTerm, employees]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const exportEmployees = () => {
    if (employees.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no employees to export.",
        variant: "destructive",
      });
      return;
    }

    exportEmployeesToExcel(employees);
    toast({
      title: "Export Successful",
      description: "Employees exported successfully.",
      duration: 3000,
    });
  };

  const handleFilterChange = (results: Employee[]) => {
    setFilteredEmployees(results);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsAddEmployeeOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employee.id);

      if (error) throw error;

      toast({
        title: "Employee Deleted",
        description: `${employee.full_name} has been removed.`,
      });

      fetchEmployees();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="mt-1 text-gray-600">Manage your organization’s employees</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <ImportEmployeesDialog onImportSuccess={fetchEmployees} />
          <Button variant="outline" size="sm" onClick={exportEmployees}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddEmployee}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search employees..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() =>
            setViewMode(prev => prev === 'list' ? 'card' : 'list')
          }>
            {viewMode === 'list' ? <><Grid className="h-4 w-4" /> Card View</> : <><ListFilter className="h-4 w-4" /> List View</>}
          </Button>

          <AdvancedFilterDropdown
            employees={employees}
            onFiltersChange={handleFilterChange}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          <AlertCircle className="inline-block mr-2" />
          {error}
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="border rounded-md overflow-hidden bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map(emp => (
                <TableRow key={emp.id} onClick={() => handleViewDetails(emp)} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={emp.profile_picture || undefined} />
                        <AvatarFallback className="bg-hrflow-blue text-white">
                          {emp.full_name?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{emp.full_name}</div>
                        <div className="text-sm text-muted-foreground">{emp.job_title || 'No Job Title'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{emp.department || 'N/A'}</TableCell>
                  <TableCell>{emp.email}<br /><span className="text-sm text-muted-foreground">{emp.phone_number || 'N/A'}</span></TableCell>
                  <TableCell>{emp.employment_type || 'N/A'}<br /><span className="text-sm text-muted-foreground">{formatDate(emp.date_of_hire)}</span></TableCell>
                  <TableCell><StatusBadge status={emp.employment_status} /></TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleEditEmployee(emp);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEmployee(emp);
                    }}>
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map(emp => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onViewDetails={handleViewDetails}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>
      )}

      <Dialog
        open={isDetailsOpen || isAddEmployeeOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          setIsAddEmployeeOpen(open);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          {selectedEmployee ? (
            <EmployeeDetailsDialog
              employee={selectedEmployee}
              onEdit={() => {
                fetchEmployees();
                setIsDetailsOpen(false);
              }}
              onDelete={() => {
                fetchEmployees();
                setIsDetailsOpen(false);
              }}
            />
          ) : (
            <AddEmployeeForm
              onSuccess={() => {
                fetchEmployees();
                setIsAddEmployeeOpen(false);
              }}
              onCancel={() => {
                setIsAddEmployeeOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
