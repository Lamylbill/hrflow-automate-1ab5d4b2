
import { supabase } from '@/integrations/supabase/client';

export const signIn = async (email: string, password: string) => {
  console.log('Attempting to sign in with:', email);
  
  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Sign in response:', 
      response.error ? `Error: ${response.error.message}` : 'Success');
    
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
    
    console.log('Sign up response:', 
      response.error ? `Error: ${response.error.message}` : 'Success');
    
    return response;
  } catch (error) {
    console.error('Unexpected error during sign up:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};
