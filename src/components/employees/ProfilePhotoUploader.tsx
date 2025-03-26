
import React, { useState, useRef } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui-custom/Button';

interface ProfilePhotoUploaderProps {
  employeeId?: string;
  currentPhotoUrl?: string;
  disabled?: boolean;
}

const AVATAR_BUCKET = 'employee-photos';

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  employeeId,
  currentPhotoUrl,
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentPhotoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Ensure the avatar bucket exists
  const ensureAvatarBucket = async (): Promise<boolean> => {
    try {
      // Check if bucket exists
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketsError) {
        console.error('Error checking for buckets:', bucketsError);
        return false;
      }
      
      const bucketExists = buckets?.some(b => b.name === AVATAR_BUCKET);
      
      // If bucket doesn't exist, create it
      if (!bucketExists) {
        const { error: createError } = await supabase
          .storage
          .createBucket(AVATAR_BUCKET, {
            public: true,
            fileSizeLimit: 2097152, // 2MB
            allowedMimeTypes: [
              'image/jpeg',
              'image/png',
              'image/jpg'
            ]
          });
          
        if (createError) {
          console.error('Error creating avatar bucket:', createError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error ensuring avatar bucket:', error);
      return false;
    }
  };

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
      // Ensure avatar bucket exists
      const bucketExists = await ensureAvatarBucket();
      if (!bucketExists) {
        throw new Error('Could not ensure avatar storage bucket exists.');
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
      
      {!disabled && (
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
    </div>
  );
};
