import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  Check,
  RotateCw
} from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { DocumentSelector } from './DocumentSelector';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase, STORAGE_BUCKET, ensureStorageBucket } from '@/integrations/supabase/client';

interface DocumentUploaderProps {
  employeeId: string;
  onUploadComplete: () => void;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'waiting' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  category?: string;
  documentType?: string;
  notes?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  employeeId,
  onUploadComplete
}) => {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      progress: 0,
      status: 'waiting' as const,
      category: '',
      documentType: '',
      notes: ''
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: true
  });

  const updateFileField = (id: string, field: keyof UploadingFile, value: string) => {
    setFiles(prev => prev.map(file =>
      file.id === id ? { ...file, [field]: value } : file
    ));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const uploadFiles = async () => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to upload documents.',
        variant: 'destructive'
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: 'No Files',
        description: 'Please select at least one file to upload.',
        variant: 'destructive'
      });
      return;
    }

    const incompleteFiles = files.filter(f => !f.category || !f.documentType);
    if (incompleteFiles.length > 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select a category and document type for all files before uploading.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadComplete(false);

    try {
      const bucketExists = await ensureStorageBucket();
      if (!bucketExists) throw new Error('Storage bucket not available.');

      let successCount = 0;

      for (const fileItem of files) {
        if (fileItem.status === 'success') {
          successCount++;
          continue;
        }

        setFiles(prev => prev.map(f =>
          f.id === fileItem.id ? { ...f, status: 'uploading' } : f
        ));

        try {
          const fileExt = fileItem.file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 11)}_${Date.now()}.${fileExt}`;
          const filePath = `${employeeId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, fileItem.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          const { error: dbError } = await supabase
            .from('employee_documents')
            .insert({
              employee_id: employeeId,
              user_id: user.id,
              file_name: fileItem.file.name,
              file_type: fileItem.file.type,
              file_size: fileItem.file.size,
              file_path: filePath,
              category: fileItem.category,
              document_type: fileItem.documentType,
              notes: fileItem.notes
            });

          if (dbError) throw dbError;

          setFiles(prev => prev.map(f =>
            f.id === fileItem.id ? { ...f, status: 'success', progress: 100 } : f
          ));

          successCount++;
        } catch (error: any) {
          console.error('Upload error:', error);
          setFiles(prev => prev.map(f =>
            f.id === fileItem.id
              ? { ...f, status: 'error', errorMessage: error.message || 'Upload failed' }
              : f
          ));
        }
      }

      if (successCount > 0) {
        setUploadComplete(true);
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${successCount} of ${files.length} document(s).`
        });

        if (successCount === files.length) {
          setTimeout(() => onUploadComplete(), 1500);
        }
      } else {
        setUploadError('Failed to upload any documents.');
      }
    } catch (error: any) {
      setUploadError(error.message || 'Unexpected upload error.');
      toast({
        title: 'Upload Error',
        description: error.message || 'Unexpected upload error.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <h3 className="text-lg font-medium">Drag and drop files here</h3>
          <p className="text-sm text-gray-500">or click to select files</p>
          <p className="text-xs text-gray-400 mt-1">
            Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <ul className="divide-y">
            {files.map(fileItem => (
              <li key={fileItem.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">{fileItem.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(fileItem.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="text-gray-400 hover:text-red-500"
                    disabled={isUploading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {fileItem.status === 'uploading' && (
                  <Progress value={fileItem.progress} className="h-1 mb-2" />
                )}
                {fileItem.status === 'success' && (
                  <p className="text-sm text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> Upload complete
                  </p>
                )}
                {fileItem.status === 'error' && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {fileItem.errorMessage}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label>Document Category *</Label>
                    <DocumentSelector
                      type="category"
                      value={fileItem.category || ''}
                      onChange={(val) => updateFileField(fileItem.id, 'category', val)}
                      disabled={isUploading || fileItem.status === 'success'}
                    />
                  </div>
                  <div>
                    <Label>Document Type *</Label>
                    <DocumentSelector
                      type="documentType"
                      categoryValue={fileItem.category || ''}
                      value={fileItem.documentType || ''}
                      onChange={(val) => updateFileField(fileItem.id, 'documentType', val)}
                      disabled={!fileItem.category || isUploading || fileItem.status === 'success'}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={fileItem.notes || ''}
                    onChange={(e) => updateFileField(fileItem.id, 'notes', e.target.value)}
                    placeholder="Add additional notes..."
                    className="resize-none h-20"
                    disabled={isUploading || fileItem.status === 'success'}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600">
          <AlertCircle className="h-5 w-5 mr-2 inline" />
          {uploadError}
        </div>
      )}

      {uploadComplete && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-600">
          <Check className="h-5 w-5 mr-2 inline" />
          Documents uploaded successfully!
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onUploadComplete} disabled={isUploading}>
          Cancel
        </Button>
        <Button type="button" onClick={uploadFiles} disabled={isUploading || files.length === 0}>
          {isUploading ? (
            <>
              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
