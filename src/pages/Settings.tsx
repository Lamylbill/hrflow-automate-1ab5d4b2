import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui-custom/Button';
import { LoadingSpinner } from '@/components/ui-custom/LoadingSpinner';
import { User, Shield, Image, Settings as SettingsIcon, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      setProfileForm({
        fullName: metadata.full_name || '',
        email: user.email || '',
        phone: metadata.phone || '',
        jobTitle: metadata.job_title || '',
      });
      
      if (metadata.avatar_url) {
        setAvatarUrl(metadata.avatar_url);
      }
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileForm.fullName,
          phone: profileForm.phone,
          job_title: profileForm.jobTitle,
        }
      });
      
      if (error) throw error;
      
      if (avatarFile) {
        const fileName = `avatar-${user.id}-${Date.now()}.${avatarFile.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        
        if (data) {
          const { error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: data.publicUrl }
          });
          
          if (updateError) throw updateError;
        }
      }
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwordForm.newPassword 
      });
      
      if (error) throw error;
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast.success("Password updated successfully!");
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(`Failed to update password: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full max-w-[150px] mx-auto md:mx-0">
                      <div className="relative group">
                        <Avatar className="h-32 w-32 border-4 border-hrflow-gray-light">
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt="Profile" />
                          ) : (
                            <AvatarFallback className="bg-hrflow-blue text-white text-4xl">
                              {user?.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute bottom-0 right-0">
                          <label htmlFor="avatar-upload" className="cursor-pointer">
                            <div className="rounded-full bg-hrflow-blue text-white p-2 shadow-md hover:bg-hrflow-blue-light">
                              <Camera className="h-5 w-5" />
                            </div>
                            <input 
                              id="avatar-upload" 
                              type="file" 
                              accept="image/*" 
                              className="hidden"
                              onChange={handleAvatarChange}
                            />
                          </label>
                        </div>
                      </div>
                      <p className="text-xs text-center mt-2 text-gray-500">
                        Click the camera icon to update your profile picture
                      </p>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            placeholder="Your full name"
                            value={profileForm.fullName}
                            onChange={handleProfileChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Your email"
                            value={profileForm.email}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="Your phone number"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            name="jobTitle"
                            placeholder="Your job title"
                            value={profileForm.jobTitle}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating} className="min-w-[120px]">
                      {isUpdating ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Update your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isUpdating || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      className="min-w-[120px]"
                    >
                      {isUpdating ? <LoadingSpinner size="sm" /> : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>
                  Customize your application experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Theme & Display</h3>
                    <p className="text-sm text-gray-500 mb-4">Coming soon! Theme preferences will be available in a future update.</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Notifications</h3>
                    <p className="text-sm text-gray-500 mb-4">Coming soon! Notification preferences will be available in a future update.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
