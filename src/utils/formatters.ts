
/**
 * Format a phone number to display properly
 */
export const formatPhoneNumber = (phoneNumber?: string | null): string => {
  if (!phoneNumber) return 'N/A';
  
  // This is a simple formatter for Singapore, could be extended for other countries
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  } else if (cleaned.length > 8) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
  }
  
  return phoneNumber;
};

/**
 * Format a salary value for display
 */
export const formatSalary = (value?: number | null): string => {
  if (value === undefined || value === null) return 'N/A';
  
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a date for display
 */
export const formatDate = (date?: string | null): string => {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    
    // Check if date is valid
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }
    
    return d.toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

/**
 * Format a boolean value for display
 */
export const formatBoolean = (value?: boolean | null): string => {
  if (value === undefined || value === null) return 'N/A';
  
  return value ? 'Yes' : 'No';
};

/**
 * Truncate long text with ellipsis
 */
export const truncateText = (text?: string | null, maxLength = 100): string => {
  if (!text) return 'N/A';
  
  if (text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Convert string representation of boolean to actual boolean
 */
export const stringToBoolean = (value?: string | null): boolean | null => {
  if (value === undefined || value === null) return null;
  
  const lowerValue = value.toLowerCase();
  if (['yes', 'true', '1', 'y'].includes(lowerValue)) return true;
  if (['no', 'false', '0', 'n'].includes(lowerValue)) return false;
  
  return null;
};

/**
 * Type-safe way to access employee fields that might be null/undefined
 */
export const safeGetValue = <T extends Record<string, any>, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  defaultValue: T[K] | null = null
): T[K] | null => {
  if (!obj) return defaultValue;
  return obj[key] !== undefined ? obj[key] : defaultValue;
};
