
import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

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

  return (
    <div
      className={cn(
        'h-screen fixed left-0 top-0 z-30 flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
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
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-gray-200 bg-white shadow-sm text-gray-500"
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
                    <div className={cn("", collapsed ? "" : "mr-3")}>
                      {item.icon}
                    </div>
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className={collapsed ? "" : "hidden"}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
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
    </div>
  );
};
