
import { supabase } from '@/integrations/supabase/client';

/**
 * Signs in a user with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    console.log('Attempting sign in with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error.message);
      return { error };
    }

    console.log('Sign in successful:', data.user?.id);
    return { data };
  } catch (error) {
    console.error('Unexpected error during sign in:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred during sign in',
      } 
    };
  }
};

/**
 * Signs up a new user with email and password
 */
export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    console.log('Attempting sign up with email:', email);
    
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      console.error('Sign up error:', error.message);
      return { error };
    }

    if (data.user?.identities?.length === 0) {
      console.log('User already exists with this email');
      return {
        error: {
          message: 'An account with this email already exists. Please log in instead.',
        }
      };
    }

    console.log('Sign up successful:', data.user?.id);
    return { data };
  } catch (error) {
    console.error('Unexpected error during sign up:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred during sign up',
      } 
    };
  }
};

/**
 * Gets the current user's session
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return { error };
    }
    return { data: data.session };
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred while getting session',
      } 
    };
  }
};

/**
 * Gets the current authenticated user
 */
export const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error.message);
      return { error };
    }
    return { data: data.user };
  } catch (error) {
    console.error('Unexpected error getting user:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred while getting user',
      } 
    };
  }
};

/**
 * Signs out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      return { error };
    }
    return { success: true };
  } catch (error) {
    console.error('Unexpected error signing out:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred while signing out',
      } 
    };
  }
};

/**
 * Sends a password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Password reset error:', error.message);
      return { error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Unexpected error during password reset:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred during password reset',
      } 
    };
  }
};
