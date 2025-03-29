
import React from 'react';
import { 
  User, Briefcase, Calendar, DollarSign, 
  Shield, FileText, Database, ChevronDown 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type TabOption = {
  value: string;
  label: string;
  icon: React.ElementType;
}

const TAB_OPTIONS: TabOption[] = [
  { value: 'personal-info', label: 'Personal Info', icon: User },
  { value: 'employment-info', label: 'Employment Info', icon: Briefcase },
  { value: 'contract-lifecycle', label: 'Contract & Lifecycle', icon: Calendar },
  { value: 'compensation-benefits', label: 'Compensation & Benefits', icon: DollarSign },
  { value: 'compliance', label: 'Compliance', icon: Shield },
  { value: 'documents', label: 'Documents', icon: FileText },
  // System Metadata is typically not visible to users
];

interface TabNavProps {
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TabNav: React.FC<TabNavProps> = ({ 
  activeTab, 
  onChange,
  className
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={cn("w-full p-4 sticky top-0 bg-white z-10 border-b", className)}>
        <Select value={activeTab} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tab" />
          </SelectTrigger>
          <SelectContent>
            {TAB_OPTIONS.map((tab) => {
              const Icon = tab.icon;
              return (
                <SelectItem key={tab.value} value={tab.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn("w-full sticky top-0 bg-white z-10 border-b px-4 py-3", className)}>
      <ToggleGroup 
        type="single" 
        value={activeTab}
        onValueChange={(value) => {
          if (value) onChange(value);
        }}
        className="flex flex-wrap justify-between w-full gap-1"
      >
        {TAB_OPTIONS.map((tab) => {
          const Icon = tab.icon;
          return (
            <ToggleGroupItem 
              key={tab.value} 
              value={tab.value}
              className={cn(
                "flex-1 min-w-fit px-3 py-2 rounded-md text-sm flex items-center justify-center gap-2 transition-colors",
                activeTab === tab.value 
                  ? "bg-hrflow-blue text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
};
