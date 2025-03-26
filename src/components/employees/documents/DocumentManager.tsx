import React, { useState, useEffect } from 'react';
import {
  PlusCircle, Filter, Download, Trash, Edit, Eye, FileText,
  RotateCw, Upload, X
} from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase, STORAGE_BUCKET, ensureStorageBucket } from '@/integrations/supabase/client';
import {
  getDisplayLabel
} from './DocumentCategoryTypes';
import { DocumentUploader } from './DocumentUploader';
import { useAuth } from '@/context/AuthContext';

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
  notes?: string;
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
  refreshTrigger = 0
}) => {
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
    console.log('Bucket check temporarily bypassed in DocumentManager');
    setBucketError(null);
  }, []);

  const fetchDocuments = async () => {
    if (!employeeId || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data: dbDocuments, error: fetchError } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const docs: Document[] = await Promise.all(
        (dbDocuments || []).map(async (doc: DbDocument) => {
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(doc.file_path);

          return {
            id: doc.id,
            employee_id: doc.employee_id,
            file_name: doc.file_name,
            file_type: doc.file_type,
            file_size: doc.file_size,
            file_url: urlData.publicUrl,
            upload_date: doc.uploaded_at,
            document_category: doc.category,
            document_type: doc.document_type,
            notes: doc.notes
          };
        })
      );

      setDocuments(docs);
      setFilteredDocuments(docs);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch documents');
      toast({
        title: 'Error',
        description: 'Failed to load documents. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [employeeId, refreshTrigger, user]);

  const handleDelete = async (documentId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('employee_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (error) throw error;

      const { error: storageErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([data.file_path]);

      if (storageErr) throw storageErr;

      const { error: dbErr } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', documentId);

      if (dbErr) throw dbErr;

      toast({ title: 'Deleted', description: 'Document successfully deleted.' });
      fetchDocuments();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete document.',
        variant: 'destructive'
      });
    }
  };

  const formatBytes = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-SG', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Documents</h2>
        <Button onClick={() => setIsUploadDialogOpen(true)} size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </div>

      <div className="w-full sm:w-64">
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {bucketError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border">{bucketError}</div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <RotateCw className="h-6 w-6 animate-spin text-gray-500 mx-auto" />
          <p>Loading documents...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filteredDocuments.length === 0 ? (
        <p className="text-gray-500 text-center">No documents found.</p>
      ) : (
        <div className="overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium truncate">{doc.file_name}</TableCell>
                  <TableCell>
                    {doc.document_category && (
                      <Badge variant="outline">{doc.document_category}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{doc.document_type}</TableCell>
                  <TableCell>{formatBytes(doc.file_size)}</TableCell>
                  <TableCell>{formatDate(doc.upload_date)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => window.open(doc.file_url, '_blank')}
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(doc.id)}
                      title="Delete"
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Supported: PDF, JPG, DOCX, XLS, etc. Document metadata will be saved per employee.
            </DialogDescription>
          </DialogHeader>
          <DocumentUploader
            employeeId={employeeId}
            onUploadComplete={() => {
              fetchDocuments();
              setIsUploadDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
