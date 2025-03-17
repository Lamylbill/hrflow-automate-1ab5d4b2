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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/employees" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-50">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col ml-[250px] transition-all duration-300">
              <div className="min-h-screen pt-20 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold mb-6">Employees</h1>
                  <p>Manage your team members and their information.</p>
                </div>
              </div>
            </div>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/payroll" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-50">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col ml-[250px] transition-all duration-300">
              <div className="min-h-screen pt-20 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold mb-6">Payroll</h1>
                  <p>Manage employee compensation and payments.</p>
                </div>
              </div>
            </div>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/leave" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-50">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col ml-[250px] transition-all duration-300">
              <div className="min-h-screen pt-20 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold mb-6">Leave Management</h1>
                  <p>Track and approve employee time off and absences.</p>
                </div>
              </div>
            </div>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/compliance" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-50">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col ml-[250px] transition-all duration-300">
              <div className="min-h-screen pt-20 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold mb-6">Compliance</h1>
                  <p>Ensure regulatory compliance and manage company policies.</p>
                </div>
              </div>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
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

export default App;
