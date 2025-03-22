
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  BarChart,
  LogOut,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-custom/Button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationBell } from '@/components/ui-custom/NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const TopNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Employees', path: '/employees', icon: <Users className="h-5 w-5" /> },
    { name: 'Leave', path: '/leave', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Payroll', path: '/payroll', icon: <FileText className="h-5 w-5" /> },
    { name: 'Activity Log', path: '/activity', icon: <BarChart className="h-5 w-5" /> },
  ];

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    
    const metadata = user.user_metadata || {};
    if (metadata.full_name) {
      return metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
    }
    
    return user.email.substring(0, 2).toUpperCase();
  };

  const avatarImageUrl = user?.user_metadata?.avatar_url || null;

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 mr-10">
              <span className="bg-indigo-600 text-white font-display font-bold px-2 py-1 rounded-md">HR</span>
              <span className="font-display font-bold text-xl text-indigo-800">Flow</span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors",
                    location.pathname === item.path
                      ? "bg-indigo-600 text-white"
                      : "text-indigo-800 hover:bg-indigo-50 hover:text-indigo-600"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <NotificationBell className="text-indigo-700 hover:text-indigo-500" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full p-0">
                  <div className="flex items-center gap-2 border border-indigo-100 p-1 pl-3 pr-2 rounded-full bg-white hover:bg-indigo-50">
                    <span className="text-indigo-800 font-medium text-sm">My Account</span>
                    <Avatar className="h-8 w-8 border-2 border-indigo-600/20">
                      {avatarImageUrl ? (
                        <AvatarImage src={avatarImageUrl} alt="Profile" />
                      ) : (
                        <AvatarFallback className="bg-indigo-600 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/settings" className="flex w-full items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    {avatarImageUrl ? (
                      <AvatarImage src={avatarImageUrl} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.path}>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex w-full items-center",
                        location.pathname === item.path ? "text-indigo-600 font-medium" : ""
                      )}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/settings" className="flex w-full items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
