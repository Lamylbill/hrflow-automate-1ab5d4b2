
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

// Create a component for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
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
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
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
