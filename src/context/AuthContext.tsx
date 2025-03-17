
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  clearUserData: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  clearUserData: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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
        // Get initial session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession) {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          setUser(currentUser);
          
          // Clean up data on initial login
          clearUserData();
          
          // Set clean initial state for the app
          console.log('Setting up clean user environment');
        }
      } catch (error) {
        console.error('Error loading auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        
        if (newSession) {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          setUser(currentUser);
          
          // Clean data on new sign in
          if (event === 'SIGNED_IN') {
            clearUserData();
            toast({
              title: "Welcome back!",
              description: "You have been successfully logged in.",
            });
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [toast]);

  const logout = async () => {
    try {
      // Clear user data before logout
      clearUserData();
      
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
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
        isAuthenticated: !!user,
        logout,
        clearUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
