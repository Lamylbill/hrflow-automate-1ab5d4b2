
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import { DashboardSidebar } from "./components/layout/DashboardSidebar";
import EmployeesPage from "./pages/EmployeesPage";
import { useEffect } from "react";
import { LoadingSpinner } from "./components/ui-custom/LoadingSpinner";
import Settings from "./pages/Settings";

// Create a new QueryClient with better retry settings for Netlify
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create a component for protected routes with better loading handling
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Use useEffect to handle the navigation after state is confirmed
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  // Always show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

// Dashboard layout with sidebar
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col transition-all duration-300 overflow-auto"
           style={{ marginLeft: 'var(--sidebar-width, 250px)' }}>
        {children}
      </div>
    </div>
  );
};

// Settings wrapper to track originating location
const SettingsWrapper = () => {
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  
  return (
    <Settings returnTo={from} />
  );
};

// App component that sets up providers and routes
const App = () => {
  // Set up the CSS variable for sidebar width
  useEffect(() => {
    const updateSidebarVar = () => {
      const width = window.innerWidth < 768 ? '70px' : '250px';
      document.documentElement.style.setProperty('--sidebar-width', width);
    };
    
    window.addEventListener('resize', updateSidebarVar);
    updateSidebarVar();
    
    return () => window.removeEventListener('resize', updateSidebarVar);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected dashboard routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/employees" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EmployeesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/payroll" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <h1 className="text-3xl font-bold mb-6 pt-6 px-6">Payroll</h1>
                    <p className="px-6">Manage employee compensation and payments.</p>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/leave" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <h1 className="text-3xl font-bold mb-6 pt-6 px-6">Leave Management</h1>
                    <p className="px-6">Track and approve employee time off and absences.</p>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/compliance" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <h1 className="text-3xl font-bold mb-6 pt-6 px-6">Compliance</h1>
                    <p className="px-6">Ensure regulatory compliance and manage company policies.</p>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Settings page */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsWrapper />
                </ProtectedRoute>
              } />
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
