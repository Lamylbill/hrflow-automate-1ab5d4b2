
import React from 'react';
import { DocumentManager } from '../documents/DocumentManager';
import { EmployeeFormData } from '@/types/employee';

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
  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      {!employeeId && onSaveRequested ? (
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-4">Please save the employee record first before adding documents.</p>
          <button 
            className="bg-hrflow-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onSaveRequested}
          >
            Save Employee Record
          </button>
        </div>
      ) : (
        <DocumentManager
          employeeId={employeeId || ''}
          isReadOnly={isViewOnly}
        />
      )}
    </div>
  );
};
