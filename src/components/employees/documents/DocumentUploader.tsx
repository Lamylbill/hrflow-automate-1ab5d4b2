
import React, { useState, useEffect } from 'react';
import { Upload, FilePlus, X, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DocumentSelector } from './DocumentSelector';
import { useToast } from '@/hooks/use-toast';
import { supabase, STORAGE_BUCKET } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  isTempUpload?: boolean; // Flag for temporary uploads during employee creation
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  employeeId,
  onUploadComplete,
  existingDocuments = [],
  isTempUpload = false
}) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bucketStatus, setBucketStatus] = useState<'loading' | 'available' | 'error'>('loading');
  const { toast } = useToast();
  const { user } = useAuth();

  // Check bucket status on component mount
  useEffect(() => {
    checkBucketStatus();
  }, []);

  const checkBucketStatus = async () => {
    try {
      // First verify if the bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error checking buckets:", error);
        setBucketStatus('error');
        toast({
          title: 'Storage Error',
          description: 'Unable to access storage system. Please contact your administrator.',
          variant: 'destructive',
        });
        return;
      }
      
      const bucketExists = buckets.some(bucket => bucket.id === STORAGE_BUCKET);
      
      if (bucketExists) {
        console.log(`Storage bucket '${STORAGE_BUCKET}' is available`);
        setBucketStatus('available');
      } else {
        console.error(`Storage bucket '${STORAGE_BUCKET}' does not exist!`);
        setBucketStatus('error');
        toast({
          title: 'Storage Configuration Error',
          description: `Storage bucket '${STORAGE_BUCKET}' is not configured. Please contact your administrator.`,
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error("Unexpected error checking bucket status:", err);
      setBucketStatus('error');
      toast({
        title: 'Storage Error',
        description: 'Unexpected error accessing storage system. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleAddDocument = () => {
    if (!currentFile || !selectedCategory || !selectedType) return;

    const newDocuments = [...documents, {
      file: currentFile,
      category: selectedCategory,
      documentType: selectedType,
      notes: notes
    }];
    
    setDocuments(newDocuments);

    // Reset form
    setCurrentFile(null);
    setSelectedCategory('');
    setSelectedType('');
    setNotes('');

    // Reset the file input
    const fileInput = document.getElementById('document-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    
    // If in temp upload mode, immediately notify parent
    if (isTempUpload && onUploadComplete) {
      onUploadComplete(newDocuments);
    }
  };

  const handleRemoveDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
    
    // If in temp upload mode, immediately notify parent of change
    if (isTempUpload && onUploadComplete) {
      onUploadComplete(newDocuments);
    }
  };

  const handleUploadDocuments = async () => {
    if ((!employeeId && !isTempUpload) || !user || documents.length === 0) {
      return;
    }

    if (bucketStatus !== 'available' && !isTempUpload) {
      toast({
        title: 'Upload Error',
        description: 'Storage system is not available. Please try again later or contact your administrator.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    
    try {
      console.log("Starting document upload process. Bucket:", STORAGE_BUCKET);
      const uploadedDocs: DocumentFile[] = [];

      // If it's a temporary upload during employee creation, just return the documents
      if (isTempUpload) {
        console.log("Temporary upload mode - returning documents without storage upload");
        if (onUploadComplete) {
          onUploadComplete(documents);
        }
        setDocuments([]);
        setIsUploading(false);
        return;
      }

      for (const doc of documents) {
        // Create a unique file path
        const timestamp = new Date().getTime();
        const fileExt = doc.file.name.split('.').pop();
        const fileName = `${timestamp}_${doc.file.name.replace(/\.[^/.]+$/, '')}`;
        const filePath = `${user.id}/${employeeId}/${fileName}.${fileExt}`;
        
        console.log(`Uploading file to path: ${filePath}`);

        // Upload to Supabase Storage
        const { data: fileData, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, doc.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          
          // Check if it's a "bucket not found" or similar error
          if (uploadError.message && (
              uploadError.message.includes('bucket') || 
              uploadError.message.includes('not found') ||
              uploadError.message.includes('404')
            )) {
            throw new Error(`Storage bucket '${STORAGE_BUCKET}' not found or inaccessible. Please contact your administrator.`);
          } else {
            throw new Error(`Upload failed: ${uploadError.message}`);
          }
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
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
          throw new Error(`Database error: ${insertError.message}`);
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
          variant: 'default',
        });

        setDocuments([]);
        
        if (onUploadComplete) {
          onUploadComplete(uploadedDocs);
        }
      }
    } catch (error: any) {
      console.error('Error during upload:', error);
      setUploadError(error.message || 'An unexpected error occurred');
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
      {bucketStatus === 'error' && !isTempUpload && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Storage system is currently unavailable. Document uploads may not work. Please contact your administrator.
          </AlertDescription>
        </Alert>
      )}
      
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
              disabled={isUploading || (!employeeId && !isTempUpload) || bucketStatus === 'error'}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {isTempUpload ? 'Add Documents' : 'Upload Documents'}
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
