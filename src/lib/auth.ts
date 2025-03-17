
import { supabase } from '@/integrations/supabase/client';

export const signIn = async (email: string, password: string) => {
  console.log('Attempting to sign in with:', email);
  
  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (response.error) {
      console.error('Sign in error:', response.error.message);
    } else {
      console.log('Sign in successful, session established:', !!response.data.session);
    }
    
    return response;
  } catch (error) {
    console.error('Unexpected error during sign in:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  console.log('Attempting to sign up with:', email);
  
  try {
    const response = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (response.error) {
      console.error('Sign up error:', response.error.message);
    } else {
      console.log('Sign up successful:', response.data);
    }
    
    return response;
  } catch (error) {
    console.error('Unexpected error during sign up:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  console.log('Attempting to reset password for:', email);
  
  try {
    const response = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (response.error) {
      console.error('Password reset error:', response.error.message);
    } else {
      console.log('Password reset email sent successfully');
    }
    
    return response;
  } catch (error) {
    console.error('Unexpected error during password reset:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user ? 'Authenticated' : 'Not authenticated');
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const getCurrentSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session ? 'Valid' : 'Invalid or expired');
    return session;
  } catch (error) {
    console.error('Error fetching current session:', error);
    return null;
  }
};
