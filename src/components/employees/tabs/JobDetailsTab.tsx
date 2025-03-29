
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { FieldsToggle } from './shared/FieldsToggle';
import { employmentTypeOptions, employmentStatusOptions, jobDepartmentOptions, probationStatusOptions } from '../data/employeeOptions';

interface JobDetailsTabProps {
  isViewOnly?: boolean;
  showAdvancedFields: boolean;
  onToggleAdvanced: (value: boolean) => void;
}

export const JobDetailsTab: React.FC<JobDetailsTabProps> = ({ 
  isViewOnly = false,
  showAdvancedFields,
  onToggleAdvanced
}) => {
  const { control, register } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <FieldsToggle 
        showAdvanced={showAdvancedFields} 
        onToggle={onToggleAdvanced} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Fields */}
        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="date_of_hire">Join Date</Label>
            <Controller
              control={control}
              name="employee.date_of_hire"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isViewOnly}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="department">Department</Label>
            <Controller
              name="employee.department"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobDepartmentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="job_title">Designation</Label>
            <Input
              id="job_title"
              {...register('employee.job_title')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="employment_type">Employment Type</Label>
            <Controller
              name="employee.employment_type"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="font-bold" htmlFor="probation_period">Probation Period (days)</Label>
            <Input
              id="probation_period"
              type="number"
              {...register('employee.probation_period', { valueAsNumber: true })}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="reporting_manager">Manager</Label>
            <Input
              id="reporting_manager"
              {...register('employee.reporting_manager')}
              disabled={isViewOnly}
            />
          </div>

          <div>
            <Label className="font-bold" htmlFor="employment_status">Employment Status</Label>
            <Controller
              name="employee.employment_status"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isViewOnly}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <div>
            <Label className="font-bold" htmlFor="date_of_exit">Exit Date</Label>
            <Controller
              control={control}
              name="employee.date_of_exit"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isViewOnly}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>
      </div>

      {/* Advanced Fields */}
      {showAdvancedFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="join_date_for_leave">Join Date for Leave</Label>
              <Controller
                control={control}
                name="employee.join_date_for_leave"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewOnly}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="initial_join_date">Initial Join Date</Label>
              <Controller
                control={control}
                name="employee.initial_join_date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewOnly}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="recruitment_type">Recruitment Type</Label>
              <Input
                id="recruitment_type"
                {...register('employee.recruitment_type')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="probation_period_type">Probation Period Type</Label>
              <Input
                id="probation_period_type"
                {...register('employee.probation_period_type')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="probation_due">Probation Due Date</Label>
              <Controller
                control={control}
                name="employee.probation_due"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewOnly}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="confirmed_date">Confirmed Date</Label>
              <Controller
                control={control}
                name="employee.confirmed_date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewOnly}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="resignation_tender_date">Resignation Tender Date</Label>
              <Controller
                control={control}
                name="employee.resignation_tender_date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewOnly}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-bold" htmlFor="exit_reason">Exit Reason</Label>
              <Input
                id="exit_reason"
                {...register('employee.exit_reason')}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="exit_interview_date">Exit Interview Date</Label>
              <Controller
                control={control}
                name="employee.exit_interview_date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewOnly}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="notice_period">Notice Period (days)</Label>
              <Input
                id="notice_period"
                type="number"
                {...register('employee.notice_period', { valueAsNumber: true })}
                disabled={isViewOnly}
              />
            </div>

            <div>
              <Label className="font-bold" htmlFor="rehire">Rehire Eligibility</Label>
              <Controller
                name="employee.rehire"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={isViewOnly}
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value !== undefined ? String(field.value) : ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select eligibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="previous_employee_code">Previous Employee Code</Label>
              <Input
                id="previous_employee_code"
                {...register('employee.previous_employee_code')}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="probation_status">Probation Status</Label>
              <Controller
                name="employee.probation_status"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={isViewOnly}
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {probationStatusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            <div>
              <Label className="font-bold" htmlFor="last_working_date">Last Working Date</Label>
              <Controller
                control={control}
                name="employee.last_working_date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewOnly}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
