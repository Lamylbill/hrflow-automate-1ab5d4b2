
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Clock, Users, CalendarDays, DollarSign, Shield, BarChart3, ChevronRight, CircleUser } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { PremiumCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui-custom/Card';
import { useAuth } from '@/context/AuthContext';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  const statsCards = [
    { 
      title: "Total Employees", 
      value: "24", 
      change: "+2", 
      icon: <Users className="h-5 w-5 text-hrflow-blue" />, 
      description: "Employees managed in the system" 
    },
    { 
      title: "Pending Approvals", 
      value: "5", 
      change: "-3", 
      icon: <Clock className="h-5 w-5 text-yellow-500" />, 
      description: "Leave and requests waiting for review" 
    },
    { 
      title: "This Month's Payroll", 
      value: "$43,250", 
      change: "+5.3%", 
      icon: <DollarSign className="h-5 w-5 text-green-500" />, 
      description: "Total estimated for next payroll run" 
    },
    { 
      title: "Compliance Status", 
      value: "96%", 
      change: "+2%", 
      icon: <Shield className="h-5 w-5 text-purple-500" />, 
      description: "Overall regulatory compliance score" 
    },
  ];

  const quickActions = [
    { title: "Add New Employee", icon: <CircleUser /> },
    { title: "Process Payroll", icon: <DollarSign /> },
    { title: "Manage Leave Requests", icon: <CalendarDays /> },
    { title: "View Reports", icon: <BarChart3 /> },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Welcome Header */}
        <AnimatedSection>
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                <p className="mt-1 text-gray-600">
                  {user?.email ? user.email.split('@')[0] : 'User'}'s HR Dashboard
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="outline" size="sm" className="mr-2">
                  <Clock className="mr-2 h-4 w-4" /> May 15, 2023
                </Button>
                <Button variant="primary" size="sm">
                  <BarChart className="mr-2 h-4 w-4" /> View Reports
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statsCards.map((stat, index) => (
            <AnimatedSection key={index} delay={100 * index}>
              <PremiumCard className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                    <div className="p-2 rounded-full bg-gray-50">{stat.icon}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mt-1">
                    <div className="text-2xl font-semibold">{stat.value}</div>
                    <div className={`ml-2 text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                </CardContent>
              </PremiumCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <AnimatedSection className="lg:col-span-2">
            <PremiumCard>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Your HR operations at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-64">
                  <img 
                    src="/lovable-uploads/3c6c7cae-eeb7-4694-b27e-dd3e08d269de.png" 
                    alt="Activity Charts" 
                    className="max-h-full rounded-lg"
                  />
                </div>
              </CardContent>
            </PremiumCard>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <PremiumCard>
                <CardHeader>
                  <CardTitle>Recent Employees</CardTitle>
                  <CardDescription>Latest employees added to the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {['Sarah Johnson', 'Michael Chen', 'Priya Patel'].map((name, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-hrflow-blue/10 flex items-center justify-center text-hrflow-blue font-medium">
                            {name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{name}</p>
                            <p className="text-xs text-gray-500">Added on May {10 + i}, 2023</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </PremiumCard>
              
              <PremiumCard>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Calendar and important dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      { name: 'Payroll Processing', date: 'May 25', type: 'Finance' },
                      { name: 'Team Meeting', date: 'May 18', type: 'HR' },
                      { name: 'Alex\'s Birthday', date: 'May 20', type: 'Event' }
                    ].map((event, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                            <CalendarDays className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{event.name}</p>
                            <p className="text-xs text-gray-500">{event.date} • {event.type}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </PremiumCard>
            </div>
          </AnimatedSection>

          {/* Sidebar */}
          <AnimatedSection delay={200} className="space-y-5">
            <PremiumCard>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickActions.map((action, i) => (
                    <Button key={i} variant="outline" className="w-full justify-start" size="lg">
                      <span className="mr-2">{action.icon}</span>
                      {action.title}
                      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </PremiumCard>

            <PremiumCard>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>All systems operational</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Database', status: 'Operational', color: 'bg-green-500' },
                    { name: 'API Services', status: 'Operational', color: 'bg-green-500' },
                    { name: 'Authentication', status: 'Operational', color: 'bg-green-500' },
                    { name: 'Payment Processing', status: 'Maintenance', color: 'bg-yellow-500' },
                  ].map((system, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${system.color}`}></div>
                        <span className="ml-2 text-sm">{system.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{system.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </PremiumCard>

            <PremiumCard className="bg-gradient-to-br from-hrflow-blue to-hrflow-blue-light text-white">
              <CardHeader>
                <CardTitle className="text-white">Upgrade to Pro</CardTitle>
                <CardDescription className="text-blue-100">
                  Get access to advanced features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {[
                    'Advanced analytics and reporting',
                    'Unlimited employee profiles',
                    'Custom workflow automation',
                    'Priority customer support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 text-blue-100" />
                      <span className="text-sm text-blue-50">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="glass" className="w-full text-white bg-white/20 hover:bg-white/30 border-white/30">
                  Upgrade Now
                </Button>
              </CardContent>
            </PremiumCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Dashboard;
