
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EmployeeFormData } from '@/types/employee';
import { DocumentManager } from '@/components/employees/documents/DocumentManager';
import { Button } from '@/components/ui-custom/Button';
import { AlertCircle, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';

interface DocumentsTabProps {
  isViewOnly?: boolean;
  employeeId?: string;
  onSaveRequested?: () => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ 
  isViewOnly = false, 
  employeeId,
  onSaveRequested 
}) => {
  const { control, register, formState: { errors } } = useFormContext<EmployeeFormData>();
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      {employeeId ? (
        <DocumentManager employeeId={employeeId} isTabbed={true} />
      ) : (
        <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-10 w-10 text-amber-500" />
          </div>
          <h3 className="font-bold" className="text-lg font-bold font-medium mb-2">Documents Require Saved Employee</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Please save the employee information first to enable document uploads. 
            All documents will be securely linked to this employee record.
          </p>
          
          {onSaveRequested && (
            <Button 
              variant="primary" 
              size={isMobile ? "lg" : "default"}
              className="mx-auto"
              onClick={onSaveRequested}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Employee Now
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
