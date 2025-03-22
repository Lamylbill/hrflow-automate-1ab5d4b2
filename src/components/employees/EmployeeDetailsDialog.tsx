
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui-custom/Button';
import { Employee } from '@/types/employee';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit, Trash, Upload, FileText, Download, X, Pencil } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddEmployeeForm } from './AddEmployeeForm';

interface DetailsItemProps {
  label: string;
  value: React.ReactNode;
}

const DetailsItem = ({ label, value }: DetailsItemProps) => (
  <div className="space-y-1">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p>{value}</p>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div className="mb-6">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
    <Separator className="mt-6" />
  </div>
);

interface EmployeeDocumentProps {
  employeeId: string;
  userId: string;
  isEditable?: boolean;
  onDocumentsChange?: () => void;
}

const EmployeeDocuments = ({ employeeId, userId, isEditable = false, onDocumentsChange }: EmployeeDocumentProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [documentType, setDocumentType] = useState('contract');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedFileName, setEditedFileName] = useState('');
  const [editedDocType, setEditedDocType] = useState('');

  const documentTypes = [
    { id: 'contract', name: 'Employment Contract', category: 'HR' },
    { id: 'cpf', name: 'CPF Documents', category: 'Finance' },
    { id: 'id', name: 'Identification', category: 'HR' },
    { id: 'visa', name: 'Work Visa/Permit', category: 'Legal' },
    { id: 'medical', name: 'Medical Certificate', category: 'HR' },
    { id: 'performance', name: 'Performance Review', category: 'HR' },
    { id: 'other', name: 'Other Documents', category: 'Miscellaneous' }
  ];

  React.useEffect(() => {
    fetchDocuments();
  }, [employeeId]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load employee documents',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileType = file.type;
    const fileExt = file.name.split('.').pop();
    const fileName = file.name;
    const fileSize = file.size;
    
    try {
      setIsUploading(true);
      
      // Create a unique path for this file
      const filePath = `${employeeId}/${documentType}_${Date.now()}.${fileExt}`;
      
      // Upload file to default bucket
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get selected document type metadata
      const selectedDocType = documentTypes.find(dt => dt.id === documentType);
      
      // Record in the database
      const { error: dbError } = await supabase
        .from('employee_documents')
        .insert({
          employee_id: employeeId,
          user_id: userId,
          document_type: selectedDocType?.name || 'Other',
          category: selectedDocType?.category || 'Miscellaneous',
          file_path: filePath,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize
        });
      
      if (dbError) throw dbError;
      
      toast({
        title: 'Document Uploaded',
        description: 'The document has been successfully uploaded.',
      });
      
      fetchDocuments();
      if (onDocumentsChange) onDocumentsChange();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDocumentDelete = async (documentId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', documentId);
      
      if (dbError) throw dbError;
      
      // Update documents list
      setDocuments(documents.filter(doc => doc.id !== documentId));
      
      toast({
        title: 'Document Deleted',
        description: 'The document has been successfully deleted.',
      });
      
      if (onDocumentsChange) onDocumentsChange();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Deletion Failed',
        description: error.message || 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const handleEditStart = (document: any) => {
    setIsEditing(document.id);
    setEditedFileName(document.file_name);
    setEditedDocType(document.document_type);
  };

  const handleEditCancel = () => {
    setIsEditing(null);
    setEditedFileName('');
    setEditedDocType('');
  };

  const handleEditSave = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('employee_documents')
        .update({
          file_name: editedFileName,
          document_type: editedDocType
        })
        .eq('id', documentId);
      
      if (error) throw error;
      
      toast({
        title: 'Document Updated',
        description: 'The document has been successfully updated.',
      });
      
      setIsEditing(null);
      fetchDocuments();
      if (onDocumentsChange) onDocumentsChange();
    } catch (error: any) {
      console.error('Error updating document:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update document',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Download Failed',
        description: error.message || 'Failed to download document',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Employee Documents</h3>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Upload New Document</h4>
                <p className="text-sm text-muted-foreground">
                  Select document type and choose a file to upload
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="documentType" className="text-sm">
                    Document Type
                  </label>
                  <select
                    id="documentType"
                    className="col-span-2 p-2 border rounded"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    {documentTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="file" className="text-sm">
                    File
                  </label>
                  <Input
                    id="file"
                    type="file"
                    className="col-span-2"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </div>
              </div>
              {isUploading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-sm">Uploading...</span>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload employee documents using the button above
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
              {isEditing === doc.id ? (
                <div className="flex flex-col w-full gap-2">
                  <Input 
                    value={editedFileName}
                    onChange={(e) => setEditedFileName(e.target.value)}
                    placeholder="File name"
                    className="mb-1"
                  />
                  <select
                    className="p-2 border rounded w-full mb-2"
                    value={editedDocType}
                    onChange={(e) => setEditedDocType(e.target.value)}
                  >
                    {documentTypes.map(type => (
                      <option key={type.name} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleEditCancel}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleEditSave(doc.id)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-md">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{doc.file_name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{doc.document_type}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(doc.file_path, doc.file_name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    {isEditable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStart(doc)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDocumentDelete(doc.id, doc.file_path)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface EmployeeDetailsDialogProps {
  employee: Employee;
  trigger?: React.ReactNode;
  onEdit?: (employee: Employee) => void;
  onDelete?: () => void;
}

export const EmployeeDetailsDialog = ({ 
  employee, 
  trigger,
  onEdit,
  onDelete
}: EmployeeDetailsDialogProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditOpen(true);
  };
  
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditOpen(false);
  };
  
  const handleEditSuccess = () => {
    setIsEditing(false);
    setEditOpen(false);
    
    if (onEdit) {
      onEdit(employee);
    }
    
    toast({
      title: "Employee Updated",
      description: `${employee.full_name}'s information has been updated.`,
    });
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employee.id);
      
      if (error) throw error;
      
      toast({
        title: "Employee Deleted",
        description: `${employee.full_name} has been removed from the system.`,
      });
      
      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <>
      {trigger}
      <div className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={employee.profile_picture || undefined} />
              <AvatarFallback className="bg-hrflow-blue text-white">
                {employee.full_name?.split(' ').map(n => n?.[0]).join('') || '?'}
              </AvatarFallback>
            </Avatar>
            <span>{employee.full_name}</span>
            <Badge className="ml-2" variant={
              employee.employment_status === 'Active' ? 'success' :
              employee.employment_status === 'On Leave' ? 'warning' :
              employee.employment_status === 'Resigned' ? 'destructive' : 'outline'
            }>
              {employee.employment_status || 'Unknown'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="personal" className="flex-1 overflow-hidden">
          <TabsList className="grid grid-cols-6 mt-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 p-4 mt-4">
            <TabsContent value="personal" className="mt-0">
              <Section title="Personal Information">
                <DetailsItem label="Full Name" value={employee.full_name || 'Not available'} />
                <DetailsItem label="Gender" value={employee.gender || 'Not available'} />
                <DetailsItem label="Date of Birth" value={formatDate(employee.date_of_birth)} />
                <DetailsItem label="Nationality" value={employee.nationality || 'Not available'} />
                <DetailsItem label="Email" value={employee.email || 'Not available'} />
                <DetailsItem label="Phone Number" value={employee.phone_number || 'Not available'} />
              </Section>
            </TabsContent>
            
            <TabsContent value="employment" className="mt-0">
              <Section title="Employment Details">
                <DetailsItem label="Job Title" value={employee.job_title || 'Not available'} />
                <DetailsItem label="Department" value={employee.department || 'Not available'} />
                <DetailsItem label="Employee Code" value={employee.employee_code || 'Not available'} />
                <DetailsItem label="Employment Type" value={employee.employment_type || 'Not available'} />
                <DetailsItem label="Employment Status" value={employee.employment_status || 'Not available'} />
                <DetailsItem label="Date of Hire" value={formatDate(employee.date_of_hire)} />
                <DetailsItem label="Date of Exit" value={formatDate(employee.date_of_exit)} />
                <DetailsItem label="Reporting Manager" value={employee.reporting_manager || 'Not available'} />
                <DetailsItem label="Probation Status" value={employee.probation_status || 'Not available'} />
              </Section>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-0">
              <Section title="Contact Information">
                <DetailsItem label="Email" value={employee.email || 'Not available'} />
                <DetailsItem label="Phone Number" value={employee.phone_number || 'Not available'} />
                <DetailsItem label="Home Address" value={employee.home_address || 'Not available'} />
                <DetailsItem label="Postal Code" value={employee.postal_code || 'Not available'} />
                <DetailsItem label="Emergency Contact" value={employee.emergency_contact_name || 'Not available'} />
                <DetailsItem 
                  label="Emergency Contact Phone" 
                  value={employee.emergency_contact_phone || 'Not available'} 
                />
              </Section>
            </TabsContent>

            <TabsContent value="financial" className="mt-0">
              <Section title="Payroll & Financial Information">
                <DetailsItem 
                  label="Salary" 
                  value={employee.salary ? `$${employee.salary.toLocaleString()}` : 'Not available'} 
                />
                <DetailsItem label="Bank Name" value={employee.bank_name || 'Not available'} />
                <DetailsItem 
                  label="Bank Account Number" 
                  value={employee.bank_account_number || 'Not available'} 
                />
                <DetailsItem 
                  label="CPF Contribution" 
                  value={employee.cpf_contribution !== undefined ? 
                    (employee.cpf_contribution ? 'Yes' : 'No') : 'Not available'} 
                />
                <DetailsItem 
                  label="CPF Account Number" 
                  value={employee.cpf_account_number || 'Not available'} 
                />
                <DetailsItem 
                  label="Tax Identification Number" 
                  value={employee.tax_identification_number || 'Not available'} 
                />
                <DetailsItem 
                  label="Leave Entitlement" 
                  value={employee.leave_entitlement !== undefined ? 
                    `${employee.leave_entitlement} days` : 'Not available'} 
                />
                <DetailsItem 
                  label="Leave Balance" 
                  value={employee.leave_balance !== undefined ? 
                    `${employee.leave_balance} days` : 'Not available'} 
                />
                <DetailsItem 
                  label="Medical Entitlement" 
                  value={employee.medical_entitlement !== undefined ? 
                    `${employee.medical_entitlement} days` : 'Not available'} 
                />
                <DetailsItem 
                  label="Benefits Enrolled" 
                  value={employee.benefits_enrolled?.length ? 
                    employee.benefits_enrolled.join(', ') : 'None'} 
                />
              </Section>
            </TabsContent>

            <TabsContent value="compliance" className="mt-0">
              <Section title="Compliance & HR">
                <DetailsItem 
                  label="Work Permit Number" 
                  value={employee.work_permit_number || 'Not available'} 
                />
                <DetailsItem 
                  label="Work Pass Expiry Date" 
                  value={formatDate(employee.work_pass_expiry_date)} 
                />
                <DetailsItem 
                  label="Contract Signed" 
                  value={employee.contract_signed !== undefined ? 
                    (employee.contract_signed ? 'Yes' : 'No') : 'Not available'} 
                />
                <DetailsItem
                  label="Last Performance Review"
                  value={formatDate(employee.last_performance_review)}
                />
                <DetailsItem
                  label="Performance Score"
                  value={employee.performance_score !== undefined ?
                    employee.performance_score : 'Not available'}
                />
                <DetailsItem
                  label="Notes"
                  value={employee.notes || 'Not available'}
                />
              </Section>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-0">
              <EmployeeDocuments employeeId={employee.id} userId={employee.user_id} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this employee?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove {employee.full_name} from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                      I'm sure
                    </AlertDialogAction>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>This action is irreversible</AlertDialogTitle>
                      <AlertDialogDescription>
                        All employee data will be permanently deleted. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete Permanently"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </div>

      {/* Edit Employee Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Employee: {employee.full_name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <AddEmployeeForm 
              employeeData={employee} 
              onSuccess={handleEditSuccess} 
              onCancel={handleEditCancel} 
            />
            
            <div className="mt-8 border-t pt-6">
              <EmployeeDocuments 
                employeeId={employee.id} 
                userId={employee.user_id} 
                isEditable={true}
                onDocumentsChange={() => {
                  toast({
                    title: "Documents Updated",
                    description: "Employee documents have been updated successfully."
                  });
                }}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
