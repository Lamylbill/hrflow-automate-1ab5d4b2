
import React from 'react';
import { Eye, X, Download, ExternalLink } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui-custom/Button';

interface DocumentPreviewProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  fileUrl, 
  fileName,
  fileType
}) => {
  const isImage = fileType?.startsWith('image/');
  const isPdf = fileType === 'application/pdf' || fileUrl?.endsWith('.pdf');
  const isPreviewable = isImage || isPdf;
  
  const openInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:ml-1">Preview</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-md p-0" align="end">
        <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-t-md">
          <h3 className="font-medium text-sm truncate max-w-[240px]">{fileName}</h3>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={openInNewTab}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Open in new tab</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 ml-1"
              onClick={() => window.open(fileUrl, '_blank')}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
            <Popover.Close className="h-8 w-8 p-0 ml-1 rounded-full inline-flex items-center justify-center text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Popover.Close>
          </div>
        </div>
        <div className="p-1 bg-gray-50 rounded-b-md">
          {isPreviewable ? (
            <div className="overflow-hidden rounded border border-gray-200 bg-white">
              {isImage ? (
                <img 
                  src={fileUrl} 
                  alt={fileName} 
                  className="max-h-[500px] w-full object-contain" 
                />
              ) : isPdf ? (
                <iframe 
                  src={`${fileUrl}#toolbar=0&navpanes=0`} 
                  className="w-full h-[500px]" 
                  title={fileName}
                />
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-gray-500 mb-4">This file type cannot be previewed.</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(fileUrl, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download to view
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
