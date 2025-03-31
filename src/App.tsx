import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { DashNavbar } from "./components/layout/DashNavbar";
import { LandNavbar as Navbar } from "./components/layout/LandNavbar";
import { useEffect, Suspense, useState } from "react";
import { LoadingSpinner } from "./components/ui-custom/LoadingSpinner";
import Settings from "./pages/Settings";
import EmployeesPage from './pages/EmployeesPage';

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <DashNavbar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8 pt-20">
          <Suspense fallback={
            <div className="flex items-center justify-center h-[calc(100vh-128px)]">
              <LoadingSpinner size="lg" />
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

const SettingsWrapper = () => {
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  return <Settings returnTo={from} />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <Navbar />
          <Index />
        </>
      } />
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
      <Route path="/activity" element={
        <ProtectedRoute>
          <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Activity Log</h1>
            <p>Track all activities and changes in the system.</p>
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsWrapper />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
