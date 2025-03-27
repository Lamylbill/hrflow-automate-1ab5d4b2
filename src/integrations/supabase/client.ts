
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

// Bucket configurations for the application
// These must match exactly what was created in the SQL migration
export const STORAGE_BUCKET = 'employee-documents';
export const AVATAR_BUCKET = 'employee-photos';

// Helper function to check if the buckets exist and are accessible
export const ensureStorageBucket = async (bucketName: string = STORAGE_BUCKET): Promise<boolean> => {
  try {
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error checking for buckets:', bucketsError);
      return false;
    }
    
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      console.error(`Bucket ${bucketName} not found. Please check Supabase Storage setup.`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error ensuring storage bucket:', error);
    return false;
  }
};
