
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormData } from '@/types/employee';

interface AttendanceTabProps {
  isViewOnly?: boolean;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ isViewOnly = false }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="attendance_calendar">Calendar</Label>
          <Input 
            id="attendance_calendar" 
            {...register('employee.attendance_calendar')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="ot_group">OT Group</Label>
          <Input 
            id="ot_group" 
            {...register('employee.ot_group')}
            disabled={isViewOnly}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="must_clock"
            {...register('employee.must_clock')}
            disabled={isViewOnly}
          />
          <Label htmlFor="must_clock">Must Clock</Label>
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="all_work_day"
            {...register('employee.all_work_day')}
            disabled={isViewOnly}
          />
          <Label htmlFor="all_work_day">All Work Day</Label>
        </div>
        
        <div>
          <Label htmlFor="badge_no">Badge No</Label>
          <Input 
            id="badge_no" 
            {...register('employee.badge_no')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="imei_uuid_no">IMEI/UUID No</Label>
          <Input 
            id="imei_uuid_no" 
            {...register('employee.imei_uuid_no')}
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="clock_codes">Clock Codes</Label>
          <Input 
            id="clock_codes" 
            {...register('employee.clock_codes')}
            placeholder="Comma-separated list of codes"
            disabled={isViewOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="clock_area_codes">Clock Area Codes</Label>
          <Input 
            id="clock_area_codes" 
            {...register('employee.clock_area_codes')}
            placeholder="Comma-separated list of codes"
            disabled={isViewOnly}
          />
        </div>
      </div>
    </div>
  );
};
