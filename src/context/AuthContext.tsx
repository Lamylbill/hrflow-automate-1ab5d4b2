
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { checkAuthStatus } from '@/lib/auth';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  clearUserData: () => void;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  clearUserData: () => {},
  refreshSession: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to manually refresh auth state
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      console.log('Manually refreshing session...');
      
      // Get the current session directly from Supabase
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        console.log('Session found during refresh:', currentSession.user.id);
        setSession(currentSession);
        
        // Also get user data
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser) {
          console.log('User data retrieved during refresh:', currentUser.id);
          setUser(currentUser);
        } else {
          console.log('No user data found despite having session');
          setUser(null);
        }
      } else {
        console.log('No valid session found during refresh');
        setSession(null);
        setUser(null);
      }
      
      // Don't return anything as the function is specified to return void
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced function to clear local user data
  const clearUserData = () => {
    console.log('Clearing user data...');
    
    // Clear app-specific data
    localStorage.removeItem('hrflow-user-settings');
    sessionStorage.removeItem('hrflow-temp-data');
    
    // Clear any data with hrflow prefix
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('hrflow-')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('hrflow-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear any employee-related data
    localStorage.removeItem('employeeList');
    localStorage.removeItem('employeeFilters');
    localStorage.removeItem('lastEmployeeView');
    
    // Clear any other app-specific caches
    try {
      const cacheKeys = Object.keys(localStorage)
        .concat(Object.keys(sessionStorage))
        .filter(key => 
          key.includes('cache') || 
          key.includes('temp') || 
          key.includes('data') ||
          key.includes('employee')
        );
      
      cacheKeys.forEach(key => {
        if (localStorage.getItem(key)) localStorage.removeItem(key);
        if (sessionStorage.getItem(key)) sessionStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing cached data:', error);
    }
    
    console.log('User data cleared successfully');
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        console.log('Setting up auth state...');
        setIsLoading(true);
        
        // Get initial session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          console.log('Initial session found with user ID:', currentSession.user.id);
          setSession(currentSession);
          
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            console.log('User data retrieved for ID:', currentUser.id);
            setUser(currentUser);
            
            // Clean up data on initial login
            clearUserData();
          } else {
            console.log('No user data found despite having session');
            setUser(null);
          }
        } else {
          console.log('No initial session found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading auth:', error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        if (newSession) {
          console.log('New session established for user:', newSession.user.id);
          setSession(newSession);
          
          try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser) {
              console.log('User data retrieved after auth state change:', currentUser.id);
              setUser(currentUser);
              
              // Clean data on new sign in
              if (event === 'SIGNED_IN') {
                console.log('Sign in event detected, clearing user data');
                clearUserData();
                toast({
                  title: "Welcome back!",
                  description: "You have been successfully logged in.",
                });
              }
            } else {
              console.log('No user data found despite having new session');
              setUser(null);
            }
          } catch (error) {
            console.error('Error getting user after auth state change:', error);
            setUser(null);
          }
        } else {
          console.log('No session after auth state change');
          setUser(null);
          setSession(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, [toast]);

  const logout = async () => {
    try {
      // Clear user data before logout
      clearUserData();
      
      console.log('Attempting to sign out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during logout:', error);
        toast({
          title: "Logout failed",
          description: "There was an error logging you out. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Logout successful');
        setUser(null);
        setSession(null);
        
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user && !!session,
        logout,
        clearUserData,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
