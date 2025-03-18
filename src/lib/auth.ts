
import { supabase } from '@/integrations/supabase/client';

export const signIn = async (email: string, password: string) => {
  console.log('Attempting to sign in with:', email);
  
  try {
    // Clear any existing sessions first to prevent conflicts
    await supabase.auth.signOut();
    console.log('Cleared any existing sessions before login attempt');
    
    // Attempt to sign in with more detailed error logging
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (response.error) {
      console.error('Sign in error:', response.error.message);
      console.error('Error details:', response.error);
      
      if (response.error.status === 400) {
        console.log('This could be an incorrect email/password combination');
      } else if (response.error.status === 422) {
        console.log('Email/password format validation failed');
      }
      
      return response;
    } 
    
    // Successfully signed in
    console.log('Sign in successful!');
    console.log('User data:', response.data.user);
    console.log('Session established:', !!response.data.session);
    
    // Double check that we have a valid session
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('Session verification:', !!sessionData.session ? 'Valid session' : 'No active session');
    
    if (!sessionData.session) {
      console.error('Session could not be established after successful login');
      return {
        data: response.data,
        error: {
          message: 'Session could not be established',
          status: 500
        }
      };
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
    // First check if a user with this email already exists in auth to provide better error messages
    // We need to use the auth API since we don't have a profiles table
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: {
        email: email
      }
    });
    
    // If we get an error here, we should just continue with the signup
    if (authError) {
      console.error('Error checking for existing user:', authError);
    } 
    // Check if the user exists in the auth system
    else if (authData && authData.users && authData.users.length > 0) {
      console.log('User already exists with this email');
      return {
        data: null,
        error: {
          message: 'An account with this email already exists. Please log in instead.',
          status: 400
        }
      };
    }
    
    // Alternatively, check if there's an employee with this email
    const { data: existingEmployees, error: checkError } = await supabase
      .from('employees')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing employee:', checkError);
    } else if (existingEmployees) {
      console.log('Employee already exists with this email');
      return {
        data: null,
        error: {
          message: 'An account with this email already exists. Please log in instead.',
          status: 400
        }
      };
    }
    
    // Proceed with signup
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Explicitly set redirect URL
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    });
    
    if (response.error) {
      console.error('Sign up error:', response.error.message, response.error.status);
      return response;
    } else {
      console.log('Sign up successful:', response.data);
      if (response.data.user?.identities?.length === 0) {
        console.log('User already exists with this email');
        return {
          data: response.data,
          error: {
            message: 'An account with this email already exists. Please log in instead.',
            status: 400
          }
        };
      }
      
      // Sign up was successful
      console.log('New user created successfully');
      return response;
    }
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
    console.log('Current user:', user ? `Authenticated (${user.id})` : 'Not authenticated');
    if (user) {
      console.log('User email:', user.email);
      console.log('User metadata:', user.user_metadata);
      console.log('Last sign in:', user.last_sign_in_at);
    }
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
    if (session) {
      console.log('Session expires at:', new Date(session.expires_at * 1000).toLocaleString());
      console.log('User ID from session:', session.user.id);
      
      // Check if session has access_token
      if (session.access_token) {
        console.log('Access token exists and is', session.access_token.length, 'characters long');
      } else {
        console.log('No access token found in session');
      }
    }
    return session;
  } catch (error) {
    console.error('Error fetching current session:', error);
    return null;
  }
};

// Add a specific function for debugging authentication issues
export const checkAuthStatus = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log('=== AUTH STATUS CHECK ===');
    console.log('Session exists:', !!session);
    console.log('User exists:', !!user);
    
    if (session) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      console.log('Session expired:', expiresAt < now);
      console.log('Session expires:', expiresAt.toLocaleString());
      // Note that creation time information is not available
      console.log('Session creation time not available');
    }
    
    if (user) {
      console.log('User ID:', user.id);
      console.log('User email:', user.email);
      console.log('Email confirmed:', !!user.confirmed_at);
    }
    
    console.log('=========================');
    
    return {
      isAuthenticated: !!session && !!user,
      session,
      user
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return {
      isAuthenticated: false,
      session: null,
      user: null
    };
  }
};
