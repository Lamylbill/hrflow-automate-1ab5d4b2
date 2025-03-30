import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Settings,
  Menu,
  X,
  Bell,
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Shield
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui-custom/Button";
import { cn } from "@/lib/utils";

export const TopNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Employees', path: '/employees', icon: <Users className="h-5 w-5" /> },
    { name: 'Payroll', path: '/payroll', icon: <FileText className="h-5 w-5" /> },
    { name: 'Leave', path: '/leave', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Compliance', path: '/compliance', icon: <Shield className="h-5 w-5" /> },
  ];

  const getUserInitials = () => {
    if (!user?.email) return 'U';

    const metadata = user.user_metadata || {};
    if (metadata.full_name) {
      return metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }

    return user.email.substring(0, 2).toUpperCase();
  };

  const avatarImageUrl = user?.user_metadata?.avatar_url || null;

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
      <nav className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center min-w-0">
            <a
              href="/"
              onClick={handleHomeClick}
              className="flex items-center gap-2 min-w-fit"
            >
              <span className="bg-indigo-600 text-white font-display font-bold px-2 py-1 rounded-md text-lg">
                HR
              </span>
              <span className="font-display font-bold text-lg text-indigo-800">
                Flow
              </span>
            </a>

            <div className="hidden md:flex ml-10 space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                    location.pathname === item.path
                      ? "bg-indigo-600 text-white"
                      : "text-indigo-800 hover:text-indigo-600 hover:bg-indigo-50"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-4">
            <button className="text-indigo-700 hover:text-indigo-500 hidden md:inline-block">
              <Bell className="h-5 w-5" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full p-0"
                >
                  <div className="flex items-center gap-2 border border-indigo-100 p-1 pl-3 pr-2 rounded-full bg-white hover:bg-indigo-50 overflow-hidden">
                    <span className="text-indigo-800 font-medium text-sm truncate max-w-[100px]">
                      My Account
                    </span>
                    <Avatar className="h-8 w-8 border-2 border-indigo-600/20">
                      {avatarImageUrl ? (
                        <AvatarImage
                          src={avatarImageUrl}
                          alt="Profile"
                          className="object-cover w-full h-full rounded-full"
                        />
                      ) : (
                        <AvatarFallback className="bg-indigo-600 text-white text-sm font-medium">
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
                  <Link
                    to="/settings"
                    className="flex w-full items-center"
                    state={{ from: location.pathname }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                className="text-indigo-800"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
