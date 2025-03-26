
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  X, 
  User, 
  RotateCw, 
  Check, 
  Camera,
  ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase, AVATAR_BUCKET } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui-custom/Button';

interface ProfilePhotoUploaderProps {
  employeeId?: string;
  currentPhotoUrl?: string;
  disabled?: boolean;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  employeeId,
  currentPhotoUrl,
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentPhotoUrl);
  const [bucketError, setBucketError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if the bucket exists
  useEffect(() => {
    const checkBucket = async () => {
      try {
        setBucketError(null);
        
        // Check if bucket exists
        const { data: buckets, error: bucketsError } = await supabase
          .storage
          .listBuckets();
        
        if (bucketsError) {
          console.error('Error checking for buckets:', bucketsError);
          setBucketError('Error checking for avatar storage bucket');
          return false;
        }
        
        const bucketExists = buckets?.some(b => b.name === AVATAR_BUCKET);
        
        if (!bucketExists) {
          console.error(`Bucket ${AVATAR_BUCKET} not found, it should be created by SQL migration`);
          setBucketError(`Avatar storage bucket (${AVATAR_BUCKET}) not found`);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error('Unexpected error ensuring avatar bucket:', error);
        setBucketError('Unexpected error accessing avatar storage');
        return false;
      }
    };
    
    checkBucket();
  }, []);

  const uploadPhoto = async (file: File) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to upload a profile photo.',
        variant: 'destructive',
      });
      return;
    }

    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please select an image to upload.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select a JPG or PNG image.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Profile photo must be less than 2MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Verify the bucket exists before uploading
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        throw new Error('Failed to check storage buckets: ' + bucketsError.message);
      }
      
      const bucketExists = buckets?.some(b => b.name === AVATAR_BUCKET);
      
      if (!bucketExists) {
        throw new Error(`Storage bucket "${AVATAR_BUCKET}" does not exist. Please contact an administrator.`);
      }
      
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const tempId = employeeId || 'temp_' + Math.random().toString(36).substring(2, 11);
      const fileName = `${tempId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // Update component state
      setAvatarUrl(publicUrl);
      
      // If we have an employee ID, update the profile picture in the database
      if (employeeId) {
        const { error: updateError } = await supabase
          .from('employees')
          .update({ profile_picture: publicUrl })
          .eq('id', employeeId);
          
        if (updateError) throw updateError;
      }
      
      toast({
        title: 'Photo Uploaded',
        description: 'Profile photo has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error uploading profile photo:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'An error occurred while uploading the profile photo.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPhoto(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const initials = employeeId 
    ? currentPhotoUrl 
      ? '' 
      : '?' 
    : 'New';

  return (
    <div className="relative">
      <Avatar className="h-20 w-20 border-2 border-gray-200">
        <AvatarImage src={avatarUrl || currentPhotoUrl} />
        <AvatarFallback className="bg-hrflow-blue text-white text-xl">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {!disabled && !bucketError && (
        <div className="absolute -bottom-2 -right-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg,image/png,image/jpg"
          />
          
          <Button
            type="button"
            size="sm"
            variant="primary"
            className="rounded-full w-8 h-8 p-0"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <RotateCw className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      
      {bucketError && (
        <div className="absolute -bottom-2 -right-2">
          <div className="bg-red-100 text-red-600 text-xs p-1 rounded">
            <span role="img" aria-label="Error">⚠️</span>
          </div>
        </div>
      )}
    </div>
  );
};
