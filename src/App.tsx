
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

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Create a layout component that includes the sidebar
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col transition-all duration-300 overflow-auto"
           style={{ marginLeft: 'var(--sidebar-width, 250px)' }}>
        <div className="min-h-screen pt-6 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add a useEffect to update the CSS variable
const AppRoutes = () => {
  return (
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
            <h1 className="text-3xl font-bold mb-6">Payroll</h1>
            <p>Manage employee compensation and payments.</p>
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/leave" element={
        <ProtectedRoute>
          <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Leave Management</h1>
            <p>Track and approve employee time off and absences.</p>
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/compliance" element={
        <ProtectedRoute>
          <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Compliance</h1>
            <p>Ensure regulatory compliance and manage company policies.</p>
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Add this effect to set the CSS variable based on sidebar state
  React.useEffect(() => {
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
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
