import React from 'react';
import { DocumentManager } from '@/components/employees/documents/DocumentManager';

interface DocumentsTabProps {
  employeeId: string;
  isViewOnly?: boolean; // Changed from isReadOnly to isViewOnly for consistency
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ 
  employeeId, 
  isViewOnly = false 
}) => {
  return (
    <div className="h-full">
      <DocumentManager 
        employeeId={employeeId} 
        refreshTrigger={0}
        isTabbed={true}
        isReadOnly={isViewOnly} // Pass as isReadOnly to match DocumentManager props
      />
    </div>
  );
};
