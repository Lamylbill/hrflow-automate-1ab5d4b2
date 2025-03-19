
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ error?: { message: string } }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({}),
  signup: async () => ({}),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Auth Provider Mounted');
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        if (!isMounted) return;
        
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (isMounted) setIsLoading(false);
          return;
        }
        
        if (sessionData?.session && isMounted) {
          console.log('Got session:', sessionData.session.user.id);
          setSession(sessionData.session);
          
          // Get current user
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('User error:', userError);
            if (isMounted) setIsLoading(false);
            return;
          }
          
          if (userData?.user && isMounted) {
            console.log('Got user:', userData.user.id);
            setUser(userData.user);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          console.log('Auth initialization complete');
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        if (!isMounted) return;
        
        try {
          if (newSession) {
            setSession(newSession);
            
            // Get updated user data
            const { data: userData, error: userError } = await supabase.auth.getUser();
            
            if (userError) {
              console.error('User error during auth change:', userError);
              return;
            }
            
            if (userData?.user && isMounted) {
              setUser(userData.user);
              
              if (event === 'SIGNED_IN') {
                toast({
                  title: "Login successful",
                  description: "Welcome to HRFlow!",
                });
              }
            }
          } else {
            if (isMounted) {
              setUser(null);
              setSession(null);
              
              if (event === 'SIGNED_OUT') {
                toast({
                  title: "Logged out",
                  description: "You have been logged out successfully.",
                });
                navigate('/');
              }
            }
          }
        } catch (error) {
          console.error('Error during auth state change:', error);
        }
      }
    );

    return () => {
      console.log('Auth Provider Unmounting');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return { error };
      }

      console.log('Login successful:', data.user?.id);
      setUser(data.user);
      setSession(data.session);
      
      navigate('/dashboard');
      return {};
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { 
        error: { 
          message: 'An unexpected error occurred during login',
        } 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting signup with email:', email);
      setIsLoading(true);
      
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
        console.error('Signup error:', error.message);
        return { error };
      }

      if (data?.user?.identities?.length === 0) {
        console.log('User already exists with this email');
        return {
          error: {
            message: 'An account with this email already exists. Please log in instead.',
          }
        };
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please log in.",
      });
      
      navigate('/login');
      return {};
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { 
        error: { 
          message: 'An unexpected error occurred during signup',
        } 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout');
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during logout:', error);
        toast({
          title: "Logout failed",
          description: "There was an error logging you out. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setUser(null);
      setSession(null);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Compute authentication state
  const isAuthenticated = !!user && !!session;
  console.log('Auth state:', { isLoading, isAuthenticated, userId: user?.id });

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
