
import React, { useState, useEffect } from 'react';
import { PlusCircle, Filter, Download, Trash, Edit, Eye, FileText, RotateCw, Upload, FilePlus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase, STORAGE_BUCKET, ensureStorageBucket } from '@/integrations/supabase/client';
import { DOCUMENT_CATEGORIES, getCategoryFromValue, getTypeFromValue, getDisplayLabel } from './DocumentCategoryTypes';
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

export const DocumentManager: React.FC<DocumentManagerProps> = ({ employeeId, refreshTrigger = 0, isTabbed = false }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
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

      if (fetchError) throw fetchError;

      if (!dbDocuments) {
        setDocuments([]);
        setFilteredDocuments([]);
        return;
      }

      const docs: Document[] = await Promise.all(dbDocuments.map(async (doc: DbDocument) => {
        const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(doc.file_path);
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
      toast({ title: 'Error', description: 'Failed to load documents. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!bucketError) fetchDocuments();
  }, [employeeId, refreshTrigger, user, bucketError]);

  const handleUploadComplete = () => {
    setIsUploadDialogOpen(false);
    fetchDocuments();
    toast({ title: 'Upload Complete', description: 'Documents have been uploaded successfully.' });
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
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Documents</h2>
        <Button onClick={() => setIsUploadDialogOpen(true)} variant="primary" size="sm" className="z-10" disabled={!!bucketError}>
          <Upload className="mr-2 h-4 w-4" /> Upload Documents
        </Button>
      </div>

      {isLoading ? <div className="p-8 text-center">Loading...</div> : null}

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Upload documents for this employee. Supported formats include PDF, Word, Excel, and images.
            </DialogDescription>
          </DialogHeader>
          <DocumentUploader employeeId={employeeId} onUploadComplete={handleUploadComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
