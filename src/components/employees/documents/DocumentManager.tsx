
import React, { useState, useEffect } from 'react';
import { PlusCircle, Filter, Download, Trash, Edit, Eye, FileText, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
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
  tags?: string[];
}

interface DocumentManagerProps {
  employeeId: string;
  refreshTrigger?: number;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ 
  employeeId,
  refreshTrigger = 0
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [editDocumentName, setEditDocumentName] = useState('');
  const [editDocumentCategory, setEditDocumentCategory] = useState('');
  const [editDocumentType, setEditDocumentType] = useState('');
  const [editDocumentDescription, setEditDocumentDescription] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    if (employeeId) {
      fetchDocuments();
    }
  }, [employeeId, refreshTrigger]);
  
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId);
        
      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load employee documents',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditDocument = (document: Document) => {
    setCurrentDocument(document);
    setEditDocumentName(document.file_name);
    setEditDocumentCategory(document.document_category || '');
    setEditDocumentType(document.document_type || '');
    setEditDocumentDescription(document.description || '');
    setIsEditDialogOpen(true);
  };
  
  const handleSaveDocument = async () => {
    if (!currentDocument) return;
    
    try {
      const { error } = await supabase
        .from('employee_documents')
        .update({
          file_name: editDocumentName,
          document_category: editDocumentCategory,
          document_type: editDocumentType,
          description: editDocumentDescription
        })
        .eq('id', currentDocument.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Document updated successfully'
      });
      
      fetchDocuments();
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating document:', error);
      toast({
        title: 'Error',
        description: 'Failed to update document',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteDocument = async (document: Document) => {
    try {
      // First delete from storage
      const { error: storageError } = await supabase.storage
        .from('employee-documents')
        .remove([`${employeeId}/${document.file_name}`]);
      
      if (storageError) throw storageError;
      
      // Then delete the record
      const { error } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', document.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Document deleted successfully'
      });
      
      fetchDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive'
      });
    }
  };
  
  const downloadDocument = async (document: Document) => {
    try {
      window.open(document.file_url, '_blank');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive'
      });
    }
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === '' || 
      doc.document_category === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Eye className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedCategory('')}
            className={selectedCategory ? 'bg-blue-50' : ''}
          >
            <Filter className="mr-2 h-4 w-4" />
            {selectedCategory ? 'Clear Filter' : 'Filter Category'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchDocuments}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {selectedCategory === '' && (
        <div className="flex flex-wrap gap-2">
          {Object.values(DOCUMENT_CATEGORIES).map((category) => (
            <Badge 
              key={category}
              variant="outline"
              className="cursor-pointer hover:bg-blue-50"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No Documents Found</h3>
          <p className="text-gray-500 mb-4">
            {documents.length === 0
              ? "This employee doesn't have any documents uploaded yet."
              : "No documents match your current search filters."}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    {document.file_name}
                    {document.description && (
                      <p className="text-xs text-gray-500 mt-1">{document.description}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {document.document_category && document.document_type ? (
                      <div>
                        <Badge className="mb-1" variant="outline">
                          {document.document_category.split(' ').slice(1).join(' ')}
                        </Badge>
                        <div className="text-xs">
                          {getTypeFromValue(document.document_category, document.document_type)?.label || document.document_type}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline">Uncategorized</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatBytes(document.file_size)}</TableCell>
                  <TableCell>{formatDate(document.upload_date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadDocument(document)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDocument(document)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteDocument(document)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Document Name</label>
              <Input 
                value={editDocumentName}
                onChange={(e) => setEditDocumentName(e.target.value)}
              />
            </div>
            
            <DocumentSelector 
              selectedCategory={editDocumentCategory}
              selectedType={editDocumentType}
              onCategoryChange={setEditDocumentCategory}
              onTypeChange={setEditDocumentType}
            />
            
            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input 
                value={editDocumentDescription}
                onChange={(e) => setEditDocumentDescription(e.target.value)}
                placeholder="Add a brief description"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveDocument}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
