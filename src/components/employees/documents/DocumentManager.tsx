
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [editDocumentName, setEditDocumentName] = useState('');
  const [editDocumentCategory, setEditDocumentCategory] = useState('');
  const [editDocumentType, setEditDocumentType] = useState('');
  const [editDocumentDescription, setEditDocumentDescription] = useState('');
  const [editDocumentNotes, setEditDocumentNotes] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
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
      
      const mappedDocuments: Document[] = (data || []).map((doc: DbDocument) => ({
        id: doc.id,
        employee_id: doc.employee_id,
        file_name: doc.file_name,
        file_type: doc.file_type || '',
        file_size: doc.file_size || 0,
        file_url: doc.file_path,
        upload_date: doc.uploaded_at,
        document_category: doc.category,
        document_type: doc.document_type,
        description: '',
        notes: doc.notes || '',
      }));
      
      setDocuments(mappedDocuments);
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
    setEditDocumentNotes(document.notes || '');
    setNewFile(null);
    setIsEditDialogOpen(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
    }
  };
  
  const handleSaveDocument = async () => {
    if (!currentDocument) return;
    
    try {
      setIsUploading(true);
      let filePath = currentDocument.file_url;
      let fileSize = currentDocument.file_size;
      let fileType = currentDocument.file_type;
      let fileName = currentDocument.file_name;
      
      // Upload new file if provided
      if (newFile) {
        // First remove the old file
        const { error: storageError } = await supabase.storage
          .from('employee-documents')
          .remove([`${employeeId}/${currentDocument.file_name}`]);
        
        if (storageError) {
          console.error('Error deleting old file:', storageError);
          // Continue anyway - we'll upload with the new name
        }
        
        // Upload the new file
        const timestamp = new Date().getTime();
        fileName = `${timestamp}-${newFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('employee-documents')
          .upload(`${employeeId}/${fileName}`, newFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = await supabase.storage
          .from('employee-documents')
          .getPublicUrl(`${employeeId}/${fileName}`);
          
        if (urlData) {
          filePath = urlData.publicUrl;
          fileSize = newFile.size;
          fileType = newFile.type;
        }
      }
      
      // Update document metadata
      const { error } = await supabase
        .from('employee_documents')
        .update({
          file_name: fileName,
          category: editDocumentCategory,
          document_type: editDocumentType,
          file_path: filePath,
          file_size: fileSize,
          file_type: fileType,
          notes: editDocumentNotes
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
        description: 'Failed to update document: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteDocument = async (document: Document) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('employee-documents')
        .remove([`${employeeId}/${document.file_name}`]);
      
      if (storageError) throw storageError;
      
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

  const handleUploadComplete = async (documentsToUpload: any[]) => {
    if (!user || !employeeId || documentsToUpload.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Process each document
      const uploadPromises = documentsToUpload.map(async (docData) => {
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${docData.file.name}`;
        
        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('employee-documents')
          .upload(`${employeeId}/${fileName}`, docData.file, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = await supabase.storage
          .from('employee-documents')
          .getPublicUrl(`${employeeId}/${fileName}`);
          
        if (!urlData) throw new Error('Failed to get file URL');
        
        // Insert document record
        const { data, error } = await supabase
          .from('employee_documents')
          .insert({
            employee_id: employeeId,
            file_name: fileName,
            file_type: docData.file.type,
            file_size: docData.file.size,
            file_path: urlData.publicUrl,
            category: docData.category,
            document_type: docData.documentType,
            notes: docData.notes,
            user_id: user.id
          });
          
        if (error) throw error;
        
        return data;
      });
      
      await Promise.all(uploadPromises);
      
      toast({
        title: 'Success',
        description: `${documentsToUpload.length} document${documentsToUpload.length > 1 ? 's' : ''} uploaded successfully`
      });
      
      fetchDocuments();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error('Error uploading documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload documents: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
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
      (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
      
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

          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Documents
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
          <Button 
            variant="primary"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Documents
          </Button>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Notes</TableHead>
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
                  <TableCell>
                    <p className="text-sm text-gray-600 line-clamp-2">{document.notes || '-'}</p>
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
      
      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <DocumentSelector 
              selectedCategory={editDocumentCategory}
              selectedType={editDocumentType}
              onCategoryChange={setEditDocumentCategory}
              onTypeChange={setEditDocumentType}
            />
            
            <div>
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                value={editDocumentNotes}
                onChange={(e) => setEditDocumentNotes(e.target.value)}
                placeholder="Add notes or context for this document..."
                className="mt-1"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Current File</label>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium truncate max-w-[200px]">
                    {currentDocument?.file_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentDocument && formatBytes(currentDocument.file_size)} • Uploaded {currentDocument && formatDate(currentDocument.upload_date)}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => currentDocument && downloadDocument(currentDocument)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload New File (Optional)</label>
              <div className="flex items-center gap-2">
                <Input 
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label 
                  htmlFor="file-upload" 
                  className="flex items-center justify-center gap-2 w-full p-3 border border-dashed rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-500" />
                  <span>{newFile ? newFile.name : "Select file to upload"}</span>
                </label>
              </div>
              {newFile && (
                <p className="text-xs text-gray-500">
                  {formatBytes(newFile.size)} • {newFile.type}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveDocument} disabled={isUploading}>
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <DocumentUploader 
              employeeId={employeeId}
              onUploadComplete={handleUploadComplete}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
