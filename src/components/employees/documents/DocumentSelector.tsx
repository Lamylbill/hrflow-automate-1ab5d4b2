
import React, { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOCUMENT_CATEGORIES, DOCUMENT_TYPES } from './DocumentCategoryTypes';

interface DocumentType {
  value: string;
  label: string;
  description?: string;
}

interface DocumentSelectorProps {
  id?: string;
  type: 'category' | 'documentType';
  value: string;
  categoryValue?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  id,
  type,
  value,
  categoryValue,
  onChange,
  disabled = false
}) => {
  const [availableOptions, setAvailableOptions] = useState<DocumentType[]>([]);
  
  useEffect(() => {
    if (type === 'category') {
      // For category selection, show all categories
      setAvailableOptions(
        Object.values(DOCUMENT_CATEGORIES).map(cat => ({
          value: cat,
          label: cat
        }))
      );
    } else if (type === 'documentType' && categoryValue && DOCUMENT_TYPES[categoryValue]) {
      // For document type selection, show types based on selected category
      setAvailableOptions(DOCUMENT_TYPES[categoryValue]);
    } else {
      setAvailableOptions([]);
    }
  }, [type, categoryValue]);
  
  return (
    <div>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || (type === 'documentType' && !categoryValue) || availableOptions.length === 0}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={type === 'category' ? "Select a category" : "Select a document type"} />
        </SelectTrigger>
        <SelectContent>
          {availableOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {type === 'documentType' && value && (
        <p className="text-xs text-gray-500 mt-1">
          {availableOptions.find(t => t.value === value)?.description}
        </p>
      )}
    </div>
  );
};
