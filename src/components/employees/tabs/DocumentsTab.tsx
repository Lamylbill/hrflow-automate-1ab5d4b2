
import React from 'react';
import { DocumentManager } from '@/components/employees/documents/DocumentManager';

interface DocumentsTabProps {
  employeeId: string;
  isReadOnly?: boolean;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ 
  employeeId, 
  isReadOnly = false 
}) => {
  return (
    <div className="h-full">
      <DocumentManager 
        employeeId={employeeId} 
        refreshTrigger={0}
        isTabbed={true}
        isViewOnly={isReadOnly} // This prop name needs to match what DocumentManager expects
      />
    </div>
  );
};
