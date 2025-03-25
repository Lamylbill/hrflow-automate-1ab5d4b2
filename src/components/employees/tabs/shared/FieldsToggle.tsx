
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FieldsToggleProps {
  showAdvanced: boolean;
  onToggle: (value: boolean) => void;
}

export const FieldsToggle: React.FC<FieldsToggleProps> = ({ 
  showAdvanced, 
  onToggle 
}) => {
  return (
    <div className="flex items-center justify-end space-x-2 mb-6 mt-2">
      <Label htmlFor="show-advanced" className="text-sm text-gray-500 flex items-center">
        {showAdvanced ? (
          <ChevronUp className="h-3 w-3 mr-1" />
        ) : (
          <ChevronDown className="h-3 w-3 mr-1" />
        )}
        {showAdvanced ? "Hide Advanced Fields" : "Show Advanced Fields"}
      </Label>
      <Switch
        id="show-advanced"
        checked={showAdvanced}
        onCheckedChange={onToggle}
      />
    </div>
  );
};
