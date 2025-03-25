
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ezvdmuahwliqotnbocdd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6dmRtdWFod2xpcW90bmJvY2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjAzMTksImV4cCI6MjA1Nzc5NjMxOX0.NjZ8o0b71gTScc2B2yoB_dNzDXHZrV8RP1T13WX2I3U";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true
  },
  global: {
    headers: {
      'x-application-name': 'HRFlow'
    }
  }
});

// Bucket configuration for the application
// This must match exactly what was created in the SQL migration (employee-documents)
export const STORAGE_BUCKET = 'employee-documents';

// Helper function to ensure the bucket exists
export const ensureStorageBucket = async (): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error checking for buckets:', bucketsError);
      return false;
    }
    
    const bucketExists = buckets?.some(b => b.name === STORAGE_BUCKET);
    
    // If bucket doesn't exist, create it
    if (!bucketExists) {
      const { error: createError } = await supabase
        .storage
        .createBucket(STORAGE_BUCKET, {
          public: false,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/jpg',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ]
        });
        
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error ensuring storage bucket:', error);
    return false;
  }
};
