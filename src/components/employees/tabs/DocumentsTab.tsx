
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EmployeeFormData } from '@/types/employee';
import { DocumentManager } from '@/components/employees/documents/DocumentManager';

interface DocumentsTabProps {
  isViewOnly?: boolean;
  employeeId?: string;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ isViewOnly = false, employeeId }) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();

  return (
    <div className="space-y-6">
      {employeeId ? (
        <DocumentManager employeeId={employeeId} isTabbed={true} />
      ) : (
        <div className="text-center p-8">
          <p className="text-gray-500">
            Documents can be uploaded after the employee record is created.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Please save the employee information first to enable document uploads.
          </p>
        </div>
      )}
    </div>
  );
};
