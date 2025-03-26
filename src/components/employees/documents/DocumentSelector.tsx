import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue
} from '@/components/ui/select';
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
  const [options, setOptions] = useState<DocumentType[]>([]);

  useEffect(() => {
    if (type === 'category') {
      setOptions(
        Object.values(DOCUMENT_CATEGORIES).map((cat) => ({
          value: cat,
          label: cat
        }))
      );
    } else if (type === 'documentType' && categoryValue && DOCUMENT_TYPES[categoryValue]) {
      setOptions(DOCUMENT_TYPES[categoryValue]);
    } else {
      setOptions([]);
    }
  }, [type, categoryValue]);

  return (
    <div>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={
          disabled || (type === 'documentType' && !categoryValue) || options.length === 0
        }
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue
            placeholder={
              type === 'category'
                ? 'Select a document category'
                : 'Select a document type'
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {type === 'documentType' && value && (
        <p className="text-xs text-gray-500 mt-1">
          {options.find((o) => o.value === value)?.description}
        </p>
      )}
    </div>
  );
};
