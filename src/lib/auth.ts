import { supabase } from '@/integrations/supabase/client';

export const signIn = async (email: string, password: string) => {
  console.log('Attempting to sign in with:', email);
  
  try {
    // Clear any existing sessions first to prevent conflicts
    // This can help when there are lingering session issues
    await supabase.auth.signOut();
    console.log('Cleared any existing sessions before login attempt');
    
    // Attempt to sign in
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (response.error) {
      console.error('Sign in error:', response.error.message, response.error.status);
      // Add more detailed error logging to help with debugging
      if (response.error.status === 400) {
        console.log('This could be an incorrect email/password combination');
      } else if (response.error.status === 422) {
        console.log('Email/password format validation failed');
      }
    } else {
      console.log('Sign in successful, session established:', !!response.data.session);
      console.log('User ID:', response.data.user?.id);
      
      // Verify the session is active
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Session verification:', !!sessionData.session ? 'Valid session' : 'No active session');
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
      options: {
        // Explicitly set redirect URL
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    });
    
    if (response.error) {
      console.error('Sign up error:', response.error.message, response.error.status);
    } else {
      console.log('Sign up successful:', response.data);
      if (response.data.user?.identities?.length === 0) {
        console.log('User already exists with this email');
      }
      if (response.data.user?.confirmed_at) {
        console.log('Email already confirmed');
      } else {
        console.log('Email confirmation required');
      }
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
      // The created_at property doesn't exist on the Session type from Supabase
      // So we'll just log that the information is not available
      console.log('Session created: Creation time not available');
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
