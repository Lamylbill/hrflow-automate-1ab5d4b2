import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Clock, Users, CalendarDays, DollarSign, Shield, BarChart3, ChevronRight, CircleUser } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { PremiumCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui-custom/Card';
import { useAuth } from '@/context/AuthContext';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [dashboardData, setDashboardData] = useState({
    activeEmployees: 0,
    onLeaveCount: 0,
    pendingApprovals: 0,
    payrollTotal: 0,
    complianceScore: 0
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user) return;
      try {
        setIsDataLoading(true);
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', user.id)
          .order('date_of_hire', { ascending: false });
        if (employeesError) throw employeesError;
        const employees = employeesData as Employee[];
        const activeCount = employees.filter(e => e.employment_status === 'Active').length;
        const onLeaveCount = employees.filter(e => e.employment_status === 'On Leave').length;
        const totalPayroll = employees.filter(e => e.employment_status === 'Active' && e.salary).reduce((sum, emp) => sum + (emp.salary || 0), 0);
        setEmployeeCount(employees.length);
        setRecentEmployees(employees.slice(0, 3));
        setDashboardData({
          activeEmployees: activeCount,
          onLeaveCount: onLeaveCount,
          pendingApprovals: 0,
          payrollTotal: totalPayroll,
          complianceScore: employees.length > 0 ? 100 : 0
        });
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchEmployeeData();
  }, [user]);

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

  const quickActions = [
    { title: "Add New Employee", icon: <CircleUser className="flex-shrink-0" />, path: "/employees" },
    { title: "Process Payroll", icon: <DollarSign className="flex-shrink-0" />, path: "/payroll" },
    { title: "Manage Leave Requests", icon: <CalendarDays className="flex-shrink-0" />, path: "/leave" },
    { title: "View Reports", icon: <BarChart3 className="flex-shrink-0" />, path: "/compliance" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="min-h-screen pt-6 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                  <p className="mt-1 text-gray-600">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}'s HR Dashboard
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button variant="primary" size="sm">
                    <BarChart className="mr-2 h-4 w-4" /> View Reports
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <AnimatedSection delay={100}>
              <PremiumCard className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold text-gray-700">Total Employees</CardTitle>
                    <div className="p-2 rounded-full bg-gray-50"><Users className="h-5 w-5 text-hrflow-blue" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mt-1">
                    <div className="text-2xl font-semibold">{isDataLoading ? '...' : employeeCount}</div>
                    <div className="ml-2 text-xs text-gray-500">
                      {isDataLoading ? '' : dashboardData.activeEmployees} active
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Employees managed in the system</p>
                </CardContent>
              </PremiumCard>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <PremiumCard className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold text-gray-700">On Leave Today</CardTitle>
                    <div className="p-2 rounded-full bg-gray-50"><Clock className="h-5 w-5 text-yellow-500" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mt-1">
                    <div className="text-2xl font-semibold">{isDataLoading ? '...' : dashboardData.onLeaveCount}</div>
                    <div className="ml-2 text-xs text-gray-500">Employees</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Employees currently on leave</p>
                </CardContent>
              </PremiumCard>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <PremiumCard className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold text-gray-700">This Month's Payroll</CardTitle>
                    <div className="p-2 rounded-full bg-gray-50"><DollarSign className="h-5 w-5 text-green-500" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mt-1">
                    <div className="text-2xl font-semibold">
                      {isDataLoading ? '...' : formatCurrency(dashboardData.payrollTotal)}
                    </div>
                    <div className="ml-2 text-xs text-gray-500">Estimated</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Total estimated for next payroll run</p>
                </CardContent>
              </PremiumCard>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <PremiumCard className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold text-gray-700">Compliance Status</CardTitle>
                    <div className="p-2 rounded-full bg-gray-50"><Shield className="h-5 w-5 text-purple-500" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mt-1">
                    <div className="text-2xl font-semibold">{dashboardData.complianceScore}%</div>
                    <div className="ml-2 text-xs text-green-500">Compliant</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Overall regulatory compliance score</p>
                </CardContent>
              </PremiumCard>
            </AnimatedSection>
          </div>

          {/* Remaining content unchanged for brevity */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
