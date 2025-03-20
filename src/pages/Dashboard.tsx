import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Clock, Users, CalendarDays, DollarSign, Shield, BarChart3, ChevronRight, CircleUser } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { PremiumCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui-custom/Card';
import { useAuth } from '@/context/AuthContext';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [dashboardData, setDashboardData] = useState({
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
    const fetchUserProfile = async () => {
      if (user) {
        try {
          console.log('Fetching profile for user:', user.id);
          const { data, error, count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .eq('id', user.id);
            
          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            console.log('Fetched profile:', data);
            setEmployeeCount(0);
          }
        } catch (error) {
          console.error('Error in profile fetch:', error);
        } finally {
          setIsDataLoading(false);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
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
                    <CardTitle className="text-sm font-medium text-gray-500">Total Employees</CardTitle>
                    <div className="p-2 rounded-full bg-gray-50"><Users className="h-5 w-5 text-hrflow-blue" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mt-1">
                    <div className="text-2xl font-semibold">{isDataLoading ? '...' : employeeCount}</div>
                    <div className="ml-2 text-xs text-gray-500">
                      {employeeCount === 0 ? 'No employees yet' : 'Employees'}
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
                    <CardTitle className="text-sm font-medium text-gray-500">Pending Approvals</CardTitle>
                    <div className="p-2 rounded-full bg-gray-50"><Clock className="h-5 w-5 text-yellow-500" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mt-1">
                    <div className="text-2xl font-semibold">0</div>
                    <div className="ml-2 text-xs text-gray-500">Requests</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Leave and requests waiting for review</p>
                </CardContent>
              </PremiumCard>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <PremiumCard className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-gray-500">This Month's Payroll</CardTitle>
                    <div className="p-2 rounded-full bg-gray-50"><DollarSign className="h-5 w-5 text-green-500" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mt-1">
                    <div className="text-2xl font-semibold">${isDataLoading ? '0' : employeeCount > 0 ? employeeCount * 1000 : 0}</div>
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
                    <CardTitle className="text-sm font-medium text-gray-500">Compliance Status</CardTitle>
                    <div className="p-2 rounded-full bg-gray-50"><Shield className="h-5 w-5 text-purple-500" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mt-1">
                    <div className="text-2xl font-semibold">100%</div>
                    <div className="ml-2 text-xs text-green-500">Compliant</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Overall regulatory compliance score</p>
                </CardContent>
              </PremiumCard>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedSection className="lg:col-span-2">
              <PremiumCard>
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                  <CardDescription>Your HR operations at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  {employeeCount === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Users className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800">No employee data yet</h3>
                      <p className="text-gray-500 mt-2 max-w-sm">
                        Add your first employee to start tracking your HR operations and see activity data.
                      </p>
                      <Button 
                        variant="primary" 
                        className="mt-4"
                        onClick={() => navigate('/employees')}
                      >
                        Add Employees
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <img 
                        src="/lovable-uploads/3c6c7cae-eeb7-4694-b27e-dd3e08d269de.png" 
                        alt="Activity Charts" 
                        className="max-h-full rounded-lg"
                      />
                    </div>
                  )}
                </CardContent>
              </PremiumCard>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <PremiumCard>
                  <CardHeader>
                    <CardTitle>Recent Employees</CardTitle>
                    <CardDescription>Latest employees added to the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {employeeCount === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No employees added yet</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => navigate('/employees')}
                        >
                          Add Employee
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center text-gray-500 mr-3">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Loading employees...</p>
                            <p className="text-xs text-gray-500">View the Employees page for details</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </PremiumCard>
                
                <PremiumCard>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks you can perform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {quickActions.map((action, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          className="justify-between h-auto py-3 px-4 normal-case font-medium flex items-center"
                          onClick={() => action.path && navigate(action.path)}
                        >
                          <div className="flex items-center">
                            <span className="mr-3 text-blue-500">{action.icon}</span>
                            <span className="text-blue-600">{action.title}</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-blue-500" />
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </PremiumCard>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <PremiumCard>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Your scheduled activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {employeeCount === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No events scheduled</p>
                      <p className="text-xs text-gray-500 mt-1">Events will appear here once you add employees</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 rounded-lg p-2 text-blue-500 mr-3">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Team Meeting</h4>
                          <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • 10:00 AM</p>
                          <p className="text-xs text-gray-500 mt-1">Discussion about new HR policies</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-green-100 rounded-lg p-2 text-green-500 mr-3">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Payroll Processing</h4>
                          <p className="text-xs text-gray-500">{new Date(new Date().setDate(new Date().getDate() + 10)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • All Day</p>
                          <p className="text-xs text-gray-500 mt-1">Monthly salary processing</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </PremiumCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
