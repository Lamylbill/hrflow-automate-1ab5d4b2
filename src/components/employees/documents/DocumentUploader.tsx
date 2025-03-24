
import React, { useState } from 'react';
import { Upload, FilePlus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DocumentSelector } from './DocumentSelector';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentFile(e.target.files[0]);
      setUploadError(null);
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

  const checkIfBucketExists = async () => {
    try {
      // Try to get metadata for the bucket to check if it exists
      const { data, error } = await supabase.storage.getBucket('employee-documents');
      
      if (error) {
        console.error('Error checking bucket:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking if bucket exists:', error);
      return false;
    }
  };

  const handleUploadDocuments = async () => {
    if (!employeeId || !user || documents.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    
    try {
      // First check if the bucket exists
      const bucketExists = await checkIfBucketExists();
      
      if (!bucketExists) {
        setUploadError('Storage bucket not found. Please contact an administrator.');
        toast({
          title: 'Upload Error',
          description: 'Storage bucket not found. Please contact an administrator.',
          variant: 'destructive',
        });
        setIsUploading(false);
        return;
      }
      
      const uploadedDocs: DocumentFile[] = [];

      for (const doc of documents) {
        // Create a unique file path
        const timestamp = new Date().getTime();
        const fileExt = doc.file.name.split('.').pop();
        const fileName = `${timestamp}_${doc.file.name.replace(/\.[^/.]+$/, '')}`;
        const filePath = `${user.id}/${employeeId}/${fileName}.${fileExt}`;

        // Upload to Supabase Storage
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('employee-documents')
          .upload(filePath, doc.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          
          if (uploadError.message.includes('bucket') || uploadError.statusCode === 404) {
            setUploadError(`Failed to upload document: Bucket not found`);
          } else {
            setUploadError(`Upload failed: ${uploadError.message}`);
          }
          
          toast({
            title: 'Upload Error',
            description: `Failed to upload document: ${uploadError.message}`,
            variant: 'destructive',
          });
          continue;
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('employee-documents')
          .getPublicUrl(filePath);

        // Insert metadata into the employee_documents table
        const { data: docData, error: insertError } = await supabase
          .from('employee_documents')
          .insert({
            employee_id: employeeId,
            user_id: user.id,
            file_name: doc.file.name,
            file_type: doc.file.type,
            file_size: doc.file.size,
            file_path: filePath,
            document_type: doc.documentType,
            category: doc.category,
            notes: doc.notes
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting document metadata:', insertError);
          setUploadError(`Database error: ${insertError.message}`);
          toast({
            title: 'Database Error',
            description: `Failed to save document metadata: ${insertError.message}`,
            variant: 'destructive',
          });
          continue;
        }

        uploadedDocs.push({
          ...doc,
          id: docData.id
        });
      }

      if (uploadedDocs.length > 0) {
        toast({
          title: 'Documents Uploaded',
          description: `Successfully uploaded ${uploadedDocs.length} document(s)`,
        });

        setDocuments([]);
        
        if (onUploadComplete) {
          onUploadComplete(uploadedDocs);
        }
      }
    } catch (error: any) {
      console.error('Unexpected error during upload:', error);
      setUploadError(`Unexpected error: ${error.message || 'Unknown error'}`);
      toast({
        title: 'Upload Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
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
          
          {uploadError && (
            <div className="p-3 rounded-md bg-red-50 border border-red-100 text-red-700 text-sm">
              {uploadError}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleUploadDocuments}
              disabled={isUploading || !employeeId}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Upload Documents
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
