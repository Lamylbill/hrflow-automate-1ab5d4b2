
/**
 * Format a phone number into a readable format
 */
export const formatPhoneNumber = (phoneNumber?: string | null): string => {
  if (!phoneNumber) return 'N/A';
  
  // Simple formatting - could be expanded for different country codes
  if (phoneNumber.length === 10) {
    return `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
  }
  
  return phoneNumber;
};

/**
 * Format salary with currency symbol
 */
export const formatSalary = (salary?: number | null): string => {
  if (salary === undefined || salary === null) return 'N/A';
  
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2
  }).format(salary);
};

/**
 * Format a date string to localized format
 */
export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format file size in bytes to human-readable format
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
