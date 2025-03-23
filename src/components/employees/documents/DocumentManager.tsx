
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
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDocuments = async () => {
    if (!employeeId || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch documents from the database
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

      // Transform the database documents to the Document interface
      const docs: Document[] = await Promise.all(dbDocuments.map(async (doc: DbDocument) => {
        // Get the public URL for the file
        const { data: publicUrlData } = supabase.storage
          .from('employee-documents')
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
    fetchDocuments();
  }, [employeeId, refreshTrigger, user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = documents.filter(doc => 
        doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.document_category && doc.document_category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.document_type && doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.notes && doc.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(documents);
    }
  }, [searchTerm, documents]);

  const handleDelete = async (documentId: string) => {
    if (!user) return;

    try {
      // Get document details to know the file path
      const { data: doc, error: fetchError } = await supabase
        .from('employee_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('employee-documents')
        .remove([doc.file_path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue to delete the metadata even if the file deletion fails
      }

      // Delete document metadata from the database
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

      // Refresh documents
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

  // Component rendering
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Documents</h2>
        <Button onClick={() => setIsUploadDialogOpen(true)} variant="primary" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
      </div>
      
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
              size="sm" 
              className="mt-4" 
              onClick={fetchDocuments}
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-300" />
            <p className="mt-2 text-lg font-medium">No documents found</p>
            <p className="text-gray-500 mb-4">
              {documents.length === 0 
                ? "This employee doesn't have any documents yet."
                : "No documents match your search criteria."}
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-1 rounded">
                          <FileText className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium truncate max-w-[200px]">{doc.file_name}</div>
                          <div className="text-xs text-gray-500">{formatBytes(doc.file_size)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {doc.document_category || 'Uncategorized'}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.document_type || 'N/A'}</TableCell>
                    <TableCell>{formatDate(doc.upload_date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <DocumentPreview 
                          fileUrl={doc.file_url} 
                          fileName={doc.file_name}
                          fileType={doc.file_type}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => window.open(doc.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-1">Download</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-1">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <DocumentUploader 
              employeeId={employeeId} 
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
