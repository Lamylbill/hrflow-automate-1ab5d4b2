
import React, { useState } from 'react';
import { Upload, FilePlus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOCUMENT_CATEGORIES, DOCUMENT_TYPES } from './DocumentCategoryTypes';
import { DocumentSelector } from './DocumentSelector';
import { Badge } from '@/components/ui/badge';

interface DocumentFile {
  file: File;
  category: string;
  documentType: string;
  notes: string;
  id?: string; // For existing documents
}

interface DocumentUploaderProps {
  employeeId?: string;
  onUploadComplete?: (uploadedDocs: DocumentFile[]) => void;
  existingDocuments?: any[];
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  employeeId,
  onUploadComplete,
  existingDocuments = []
}) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentFile(e.target.files[0]);
    }
  };

  const handleAddDocument = () => {
    if (!currentFile || !selectedCategory || !selectedType) return;

    setDocuments([...documents, {
      file: currentFile,
      category: selectedCategory,
      documentType: selectedType,
      notes: notes
    }]);

    // Reset form
    setCurrentFile(null);
    setSelectedCategory('');
    setSelectedType('');
    setNotes('');

    // Reset the file input
    const fileInput = document.getElementById('document-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleRemoveDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {documents.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Documents to Upload ({documents.length})</h3>
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex-1 mr-4">
                  <div className="flex items-center">
                    <FilePlus className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium truncate">{doc.file.name}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 items-center text-xs text-gray-500">
                    <span>{formatBytes(doc.file.size)}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {doc.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {doc.documentType}
                    </Badge>
                  </div>
                  {doc.notes && (
                    <p className="mt-1 text-xs text-gray-600">{doc.notes}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDocument(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => onUploadComplete && onUploadComplete(documents)}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Documents
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 border border-dashed rounded-md space-y-4">
        <h3 className="text-sm font-medium">Add Document</h3>
        
        <DocumentSelector 
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          onCategoryChange={setSelectedCategory}
          onTypeChange={setSelectedType}
        />
        
        <div>
          <label className="text-sm font-medium">Notes (Optional)</label>
          <Textarea
            placeholder="Add any notes or context for this document..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Upload File</label>
          <div className="mt-1">
            <Input 
              type="file"
              id="document-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label 
              htmlFor="document-upload" 
              className={`flex items-center justify-center gap-2 p-4 border ${currentFile ? 'border-solid bg-gray-50' : 'border-dashed'} rounded-md hover:bg-gray-50 cursor-pointer transition-colors`}
            >
              <Upload className="h-5 w-5 text-gray-500" />
              <span>{currentFile ? currentFile.name : "Select file to upload"}</span>
            </label>
            {currentFile && (
              <p className="mt-1 text-xs text-gray-500">
                {formatBytes(currentFile.size)} • {currentFile.type}
              </p>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleAddDocument} 
          disabled={!currentFile || !selectedCategory || !selectedType}
          variant="outline"
          className="w-full"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Add Document to List
        </Button>
      </div>
    </div>
  );
};
