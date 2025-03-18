
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Shield, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Automatically collapse sidebar on smaller screens
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        // Auto-expand on larger screens
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update CSS variable whenever collapsed state changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      collapsed ? '70px' : '250px'
    );
  }, [collapsed]);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Employees', path: '/employees', icon: <Users className="h-5 w-5" /> },
    { name: 'Payroll', path: '/payroll', icon: <FileText className="h-5 w-5" /> },
    { name: 'Leave', path: '/leave', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Compliance', path: '/compliance', icon: <Shield className="h-5 w-5" /> },
  ];

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Function to download CSV template
  const downloadCSVTemplate = () => {
    const csvHeader = "Full Name,Job Title,Department,Email,Phone Number,Date of Hire,Employment Type,Salary,Status,Profile Picture";
    const csvContent = "data:text/csv;charset=utf-8," + csvHeader;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <aside
      className={cn(
        'h-screen fixed left-0 top-0 z-30 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-sm',
        collapsed ? 'w-[70px]' : 'w-[250px]'
      )}
    >
      {/* Sidebar Header with Logo */}
      <div className={cn(
        'h-16 flex items-center px-4 border-b border-gray-200',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="bg-hrflow-blue text-white font-display font-bold px-2 py-1 rounded-md">HR</span>
            <span className="font-display font-bold text-lg">Flow</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" className="flex items-center justify-center">
            <span className="bg-hrflow-blue text-white font-display font-bold px-2 py-1 rounded-md">HR</span>
          </Link>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse} 
          className={cn("text-gray-500", collapsed ? "hidden" : "")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Collapse Trigger (Only visible when collapsed) */}
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-gray-200 bg-white shadow-sm text-gray-500 z-40 flex items-center justify-center"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      )}

      {/* User Profile Section */}
      <div className={cn(
        'p-4 border-b border-gray-200 flex items-center',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <Avatar className={cn("border-2 border-hrflow-blue/20", collapsed ? "h-8 w-8" : "h-10 w-10")}>
          <AvatarFallback className="bg-hrflow-blue text-white">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email ? user.email.split('@')[0] : 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className={cn("space-y-1 px-2", collapsed ? "items-center" : "")}>
          <TooltipProvider delayDuration={0}>
            {navigationItems.map((item) => (
              <Tooltip key={item.path} disableHoverableContent={!collapsed}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      location.pathname === item.path 
                        ? "bg-hrflow-blue text-white" 
                        : "text-gray-700 hover:bg-hrflow-blue/10 hover:text-hrflow-blue",
                      collapsed ? "justify-center" : ""
                    )}
                  >
                    <div className={cn("flex-shrink-0", collapsed ? "" : "mr-3")}>
                      {item.icon}
                    </div>
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" align="center" className={collapsed ? "" : "hidden"}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>

          {/* Template Download Button */}
          {location.pathname === '/employees' && !collapsed && (
            <div className="mt-4 px-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-sm flex items-center justify-start"
                onClick={downloadCSVTemplate}
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Download Template</span>
              </Button>
            </div>
          )}
          
          {/* Template Download Button (Collapsed sidebar) */}
          {location.pathname === '/employees' && collapsed && (
            <Tooltip disableHoverableContent={!collapsed}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full mt-4 flex justify-center"
                  onClick={downloadCSVTemplate}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                Download Employee Template
              </TooltipContent>
            </Tooltip>
          )}
        </nav>
      </div>

      {/* Logout Button */}
      <div className={cn(
        "p-4 border-t border-gray-200",
        collapsed ? "flex justify-center" : ""
      )}>
        <TooltipProvider delayDuration={0}>
          <Tooltip disableHoverableContent={!collapsed}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "text-red-500 w-full justify-center",
                  !collapsed && "justify-start"
                )}
                onClick={() => logout()}
              >
                <LogOut className={cn("h-5 w-5", !collapsed && "mr-2")} />
                {!collapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className={collapsed ? "" : "hidden"}>
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
};

// Export a hook to get the current sidebar state for other components
export const useSidebarWidth = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return collapsed ? '70px' : '250px';
};
