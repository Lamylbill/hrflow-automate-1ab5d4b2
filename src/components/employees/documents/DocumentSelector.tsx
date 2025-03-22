
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
  selectedCategory: string;
  selectedType: string;
  onCategoryChange: (category: string) => void;
  onTypeChange: (type: string) => void;
}

export const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  selectedCategory,
  selectedType,
  onCategoryChange,
  onTypeChange
}) => {
  const [availableTypes, setAvailableTypes] = useState<DocumentType[]>([]);
  
  useEffect(() => {
    if (selectedCategory && DOCUMENT_TYPES[selectedCategory]) {
      setAvailableTypes(DOCUMENT_TYPES[selectedCategory]);
    } else {
      setAvailableTypes([]);
    }
  }, [selectedCategory]);
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Document Category</label>
        <Select
          value={selectedCategory}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(DOCUMENT_CATEGORIES).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Document Type</label>
        <Select
          value={selectedType}
          onValueChange={onTypeChange}
          disabled={!selectedCategory || availableTypes.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a document type" />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedType && selectedCategory && (
          <p className="text-xs text-gray-500 mt-1">
            {availableTypes.find(t => t.value === selectedType)?.description}
          </p>
        )}
      </div>
    </div>
  );
};
