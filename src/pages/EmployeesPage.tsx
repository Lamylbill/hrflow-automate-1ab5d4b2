
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  Download, 
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  Dialog, 
  DialogContent,
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
      setFilteredEmployees(data as Employee[]);
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
  
  useEffect(() => {
    // Apply text search filter on filteredEmployees
    if (!searchTerm) {
      return; // No need to filter further if search term is empty
    }
    
    const searchResults = filteredEmployees.filter(employee => 
      employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredEmployees(searchResults);
  }, [searchTerm]);
  
  // Handle search input clearing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If search is cleared, reset to current filtered employees (with filters still applied)
    if (!value) {
      handleFilterChange(employees);
    }
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
      description: "Employees exported successfully with all fields.",
      duration: 3000,
    });
  };
  
  const handleFilterChange = (filteredResults: Employee[]) => {
    setFilteredEmployees(filteredResults);
    
    // Apply text search if it exists
    if (searchTerm) {
      const searchResults = filteredResults.filter(employee => 
        employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(searchResults);
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

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsDetailsOpen(true);
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
        description: `${employee.full_name} has been removed from the system.`
      });

      fetchEmployees();
    } catch (error: any) {
      console.error("Error deleting employee:", error);
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
      <AnimatedSection>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
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
            <Button variant="primary" size="sm" onClick={handleAddEmployee}>
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
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center justify-between w-full sm:w-auto">
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
          
            <AdvancedFilterDropdown 
              employees={employees}
              onFiltersChange={handleFilterChange}
            />
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
                          <Button variant="primary" onClick={handleAddEmployee}>Add Employee</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleViewDetails(employee)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={employee.profile_picture || undefined} />
                              <AvatarFallback className="bg-hrflow-blue text-white">
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
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEmployee(employee);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="px-2 text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEmployee(employee);
                              }}
                            >
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
                <Button variant="primary" onClick={handleAddEmployee}>Add Employee</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEmployees.map(employee => (
                  <EmployeeCard 
                    key={employee.id} 
                    employee={employee}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditEmployee}
                    onDelete={handleDeleteEmployee}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatedSection>

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
            <div>
              <AddEmployeeForm 
                onSuccess={() => {
                  fetchEmployees();
                  setIsAddEmployeeOpen(false);
                  setIsDetailsOpen(false);
                }}
                onCancel={() => {
                  setIsAddEmployeeOpen(false);
                  setIsDetailsOpen(false);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
