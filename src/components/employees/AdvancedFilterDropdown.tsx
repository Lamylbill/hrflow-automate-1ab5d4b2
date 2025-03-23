
import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Plus, 
  X, 
  ChevronDown, 
  CalendarIcon 
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui-custom/Button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Checkbox
} from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Employee } from '@/types/employee';

// Define supported filter fields and their types
export type FilterField = {
  key: keyof Employee | string;
  label: string;
  type: 'select' | 'text' | 'number' | 'boolean' | 'date-range';
  options?: string[];
};

// Define a filter rule
export type FilterRule = {
  id: string;
  field: string;
  operator: string;
  value: any;
  valueEnd?: any; // For date ranges
};

// Props for the component
interface AdvancedFilterDropdownProps {
  employees: Employee[];
  onFiltersChange: (filteredEmployees: Employee[]) => void;
}

export const AdvancedFilterDropdown: React.FC<AdvancedFilterDropdownProps> = ({
  employees,
  onFiltersChange
}) => {
  // State for filter rules
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Define available fields for filtering
  const filterFields: FilterField[] = [
    { 
      key: 'department', 
      label: 'Department', 
      type: 'select',
      options: Array.from(new Set(employees.map(emp => emp.department).filter(Boolean) as string[]))
    },
    { 
      key: 'employment_status', 
      label: 'Status', 
      type: 'select',
      options: Array.from(new Set(employees.map(emp => emp.employment_status).filter(Boolean) as string[]))
    },
    { 
      key: 'job_title', 
      label: 'Job Title', 
      type: 'select',
      options: Array.from(new Set(employees.map(emp => emp.job_title).filter(Boolean) as string[]))
    },
    { 
      key: 'employment_type', 
      label: 'Employment Type', 
      type: 'select',
      options: Array.from(new Set(employees.map(emp => emp.employment_type).filter(Boolean) as string[]))
    },
    { 
      key: 'gender', 
      label: 'Gender', 
      type: 'select',
      options: Array.from(new Set(employees.map(emp => emp.gender).filter(Boolean) as string[]))
    },
    { 
      key: 'nationality', 
      label: 'Nationality', 
      type: 'select',
      options: Array.from(new Set(employees.map(emp => emp.nationality).filter(Boolean) as string[]))
    },
    { 
      key: 'cpf_contribution', 
      label: 'CPF Eligible', 
      type: 'boolean'
    },
    { 
      key: 'date_of_hire', 
      label: 'Date of Hire', 
      type: 'date-range'
    },
  ];

  // Add a new filter rule
  const addFilterRule = () => {
    const newRule: FilterRule = {
      id: `rule-${Date.now()}`,
      field: filterFields[0].key as string,
      operator: 'equals',
      value: ''
    };
    setFilterRules([...filterRules, newRule]);
  };

  // Remove a filter rule
  const removeFilterRule = (id: string) => {
    setFilterRules(filterRules.filter(rule => rule.id !== id));
  };

  // Update a filter rule
  const updateFilterRule = (id: string, updates: Partial<FilterRule>) => {
    setFilterRules(filterRules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  // Get field definition by key
  const getFieldByKey = (key: string): FilterField | undefined => {
    return filterFields.find(field => field.key === key);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterRules([]);
    onFiltersChange(employees);
    setIsOpen(false);
  };

  // Apply filters
  useEffect(() => {
    if (filterRules.length === 0) {
      onFiltersChange(employees);
      return;
    }

    const filteredEmployees = employees.filter(employee => {
      return filterRules.every(rule => {
        const field = rule.field as keyof Employee;
        const value = employee[field];
        
        const fieldDef = getFieldByKey(rule.field);
        if (!fieldDef) return true;

        switch (fieldDef.type) {
          case 'boolean':
            return rule.value === null || value === (rule.value === 'true');
          
          case 'date-range':
            if (!value) return false;
            const dateValue = new Date(value as string);
            
            if (rule.value && !rule.valueEnd) {
              // Single date comparison
              const ruleDate = new Date(rule.value);
              return dateValue.toDateString() === ruleDate.toDateString();
            } else if (rule.value && rule.valueEnd) {
              // Date range comparison
              const startDate = new Date(rule.value);
              const endDate = new Date(rule.valueEnd);
              return dateValue >= startDate && dateValue <= endDate;
            }
            return true;
          
          default:
            if (rule.value === '') return true;
            if (value === null || value === undefined) return false;
            
            // Case insensitive string comparison
            return String(value).toLowerCase().includes(String(rule.value).toLowerCase());
        }
      });
    });

    onFiltersChange(filteredEmployees);
  }, [filterRules, employees]);

  // Get a count of active filters
  const activeFilterCount = filterRules.length;

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="relative flex items-center"
            size="sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 bg-gray-100 text-gray-700"
              >
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[350px] p-0" 
          align="start"
        >
          <div className="flex flex-col p-4 gap-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Filter Employees</h3>
              {filterRules.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-8 px-2 text-xs"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {filterRules.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                <p>No filters applied</p>
                <p>Click "Add Filter" to create a filter rule</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto py-1">
                {filterRules.map((rule) => {
                  const fieldDef = getFieldByKey(rule.field);
                  if (!fieldDef) return null;

                  return (
                    <div key={rule.id} className="flex flex-col gap-2 bg-gray-50 p-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <Select
                          value={rule.field}
                          onValueChange={(value) => {
                            // Reset value when field changes
                            updateFilterRule(rule.id, { 
                              field: value, 
                              value: '',
                              valueEnd: undefined
                            });
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterFields.map((field) => (
                              <SelectItem key={field.key as string} value={field.key as string}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFilterRule(rule.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Input based on field type */}
                      {fieldDef.type === 'select' && (
                        <Select
                          value={rule.value}
                          onValueChange={(value) => updateFilterRule(rule.id, { value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder={`Select ${fieldDef.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldDef.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {fieldDef.type === 'text' && (
                        <Input
                          placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
                          value={rule.value || ''}
                          onChange={(e) => updateFilterRule(rule.id, { value: e.target.value })}
                          className="h-8 text-xs"
                        />
                      )}

                      {fieldDef.type === 'boolean' && (
                        <div className="flex items-center space-x-2">
                          <Select
                            value={rule.value}
                            onValueChange={(value) => updateFilterRule(rule.id, { value })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {fieldDef.type === 'date-range' && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs mb-1 block">Start Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="h-8 text-xs w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                    {rule.value ? (
                                      format(new Date(rule.value), 'PP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={rule.value ? new Date(rule.value) : undefined}
                                    onSelect={(date) => updateFilterRule(rule.id, { value: date?.toISOString() })}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div>
                              <Label className="text-xs mb-1 block">End Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="h-8 text-xs w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                    {rule.valueEnd ? (
                                      format(new Date(rule.valueEnd), 'PP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={rule.valueEnd ? new Date(rule.valueEnd) : undefined}
                                    onSelect={(date) => updateFilterRule(rule.id, { valueEnd: date?.toISOString() })}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <Button 
              variant="outline" 
              size="sm" 
              onClick={addFilterRule}
              className="mt-2"
            >
              <Plus className="mr-2 h-3 w-3" />
              Add Filter
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filter badges displayed outside the dropdown */}
      {filterRules.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filterRules.map(rule => {
            const fieldDef = getFieldByKey(rule.field);
            if (!fieldDef || !rule.value) return null;

            let displayValue = '';
            
            if (fieldDef.type === 'boolean') {
              displayValue = rule.value === 'true' ? 'Yes' : 'No';
            } else if (fieldDef.type === 'date-range') {
              displayValue = format(new Date(rule.value), 'PP');
              if (rule.valueEnd) {
                displayValue += ` - ${format(new Date(rule.valueEnd), 'PP')}`;
              }
            } else {
              displayValue = String(rule.value);
            }

            return (
              <Badge 
                key={rule.id} 
                variant="outline" 
                className="flex items-center gap-1 bg-blue-50"
              >
                {fieldDef.label}: {displayValue}
                <X
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilterRule(rule.id)}
                />
              </Badge>
            );
          })}
          {filterRules.length > 0 && (
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 bg-gray-50 cursor-pointer"
              onClick={clearFilters}
            >
              Clear All
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
