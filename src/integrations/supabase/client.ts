
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

// Helper function to check if the buckets exist and create them if they don't
export const ensureStorageBucket = async (bucketName: string = STORAGE_BUCKET): Promise<boolean> => {
  try {
    console.log(`Checking for bucket: ${bucketName}`);
    
    // Step 1: Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error checking for buckets:', bucketsError);
      return false;
    }
    
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    // Step 2: If the bucket doesn't exist, create it
    if (!bucketExists) {
      console.log(`Bucket ${bucketName} not found. Creating it now...`);
      
      const { error: createError } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true, // Make the bucket public by default
          fileSizeLimit: 10485760, // 10MB limit
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        });
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
        return false;
      }
      
      console.log(`Successfully created bucket: ${bucketName}`);
      return true;
    }
    
    console.log(`Bucket ${bucketName} exists`);
    return true;
  } catch (error) {
    console.error('Unexpected error ensuring storage bucket:', error);
    return false;
  }
};

// Helper function to specifically ensure the avatar bucket exists
export const ensureAvatarBucket = async (): Promise<boolean> => {
  return ensureStorageBucket(AVATAR_BUCKET);
};

