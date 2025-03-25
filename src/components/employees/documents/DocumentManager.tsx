import React, { useState, useEffect } from 'react';
import { PlusCircle, Filter, Download, Trash, Edit, Eye, FileText, RotateCw, Upload, FilePlus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase, STORAGE_BUCKET, ensureStorageBucket } from '@/integrations/supabase/client';
import { 
  DOCUMENT_CATEGORIES, 
  getCategoryFromValue, 
  getTypeFromValue,
  getDisplayLabel
} from './DocumentCategoryTypes';
import { DocumentSelector } from './DocumentSelector';
import { DocumentUploader } from './DocumentUploader';
import { useAuth } from '@/context/AuthContext';
import { DocumentPreview } from './DocumentPreview';

interface Document {
  id: string;
  employee_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  upload_date: string;
  document_category?: string;
  document_type?: string;
  status?: string;
  description?: string;
  notes?: string;
  tags?: string[];
}

interface DbDocument {
  id: string;
  employee_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
  category: string;
  document_type: string;
  user_id: string;
  notes?: string;
}

interface DocumentManagerProps {
  employeeId: string;
  refreshTrigger?: number;
  isTabbed?: boolean;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ 
  employeeId,
  refreshTrigger = 0,
  isTabbed = false
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDocumentDetailOpen, setIsDocumentDetailOpen] = useState(false);
  const [bucketError, setBucketError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkBucket = async () => {
      setBucketError(null);
      const bucketIsReady = await ensureStorageBucket();
      if (!bucketIsReady) {
        setBucketError("Document storage is not properly configured. Please contact your system administrator.");
      }
    };
    
    checkBucket();
  }, []);

  const fetchDocuments = async () => {
    if (!employeeId || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      await ensureStorageBucket();
      
      const { data: dbDocuments, error: fetchError } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('user_id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      if (!dbDocuments) {
        setDocuments([]);
        setFilteredDocuments([]);
        setIsLoading(false);
        return;
      }

      const docs: Document[] = await Promise.all(dbDocuments.map(async (doc: DbDocument) => {
        const { data: publicUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(doc.file_path);

        return {
          id: doc.id,
          employee_id: doc.employee_id,
          file_name: doc.file_name,
          file_type: doc.file_type,
          file_size: doc.file_size,
          file_url: publicUrlData.publicUrl,
          upload_date: doc.uploaded_at,
          document_category: doc.category,
          document_type: doc.document_type,
          notes: doc.notes
        };
      }));

      setDocuments(docs);
      setFilteredDocuments(docs);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Failed to load documents');
      toast({
        title: 'Error',
        description: 'Failed to load documents. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!bucketError) {
      fetchDocuments();
    }
  }, [employeeId, refreshTrigger, user, bucketError]);

  const handleDelete = async (documentId: string) => {
    if (!user) return;

    try {
      const { data: doc, error: fetchError } = await supabase
        .from('employee_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([doc.file_path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
      }

      const { error: deleteError } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: 'Document Deleted',
        description: 'The document has been deleted successfully.',
      });

      fetchDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: `Failed to delete document: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleUploadComplete = () => {
    setIsUploadDialogOpen(false);
    fetchDocuments();
    toast({
      title: 'Upload Complete',
      description: 'Documents have been uploaded successfully.',
    });
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Documents</h2>
        <Button 
          onClick={() => setIsUploadDialogOpen(true)} 
          variant="primary" 
          size="sm"
          className="z-10"
          disabled={!!bucketError}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
      </div>
      
      {bucketError ? (
        <div className="p-8 text-center border border-red-200 rounded-md bg-red-50">
          <p className="text-red-600 font-medium">{bucketError}</p>
          <p className="mt-2 text-sm text-red-500">
            The document storage bucket may not exist or you may not have proper permissions.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4" 
            onClick={() => location.reload()}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-10"
              />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {documents.length > 0 && (
              <div className="text-sm text-gray-500">
                Total: {documents.length} document{documents.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <RotateCw className="h-8 w-8 mx-auto animate-spin text-gray-400" />
              <p className="mt-2 text-gray-500">Loading documents...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="outline" 
               
