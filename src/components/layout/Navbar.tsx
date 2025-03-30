import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Menu,
  X,
  LogOut,
  Info,
  Users,
  Phone,
  Home,
  BarChart,
  FileText,
  Calendar,
  Shield,
  Settings,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-custom/Button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getNavItems, getFeaturesItems } from './NavItems';
import { toast } from 'sonner';

export const Navbar = ({ showLogo = true }: { showLogo?: boolean }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getUserInitials = () => {
    const fullName = user?.user_metadata?.full_name;
    if (fullName) {
      const [first, second] = fullName.split(' ');
      return ((first?.[0] || '') + (second?.[0] || '')).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  const getUserAvatar = () => user?.user_metadata?.avatar_url || null;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/' + id);
    } else {
      const el = document.getElementById(id.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollBy(0, -80);
      }
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
  };

  const publicNavItems = getNavItems();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isAuthenticated || location.pathname !== '/'
          ? 'bg-white shadow-md border-b border-gray-200'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {showLogo && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 focus:outline-none"
            >
              <span className="bg-indigo-600 text-white font-display font-bold px-2 py-1 rounded-md">
                HR
              </span>
              <span className="font-display font-bold text-xl text-indigo-800 truncate">
                Flow
              </span>
            </button>
          )}

          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <a
                    href="/"
                    onClick={handleHomeClick}
                    className={cn(navigationMenuTriggerStyle(), 'text-indigo-800 hover:text-white hover:bg-indigo-600')}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a
                    href="#features"
                    onClick={(e) => scrollToSection(e, '#features')}
                    className={cn(navigationMenuTriggerStyle(), 'text-indigo-800 hover:text-white hover:bg-indigo-600')}
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    Features
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a
                    href="#pricing"
                    onClick={(e) => scrollToSection(e, '#pricing')}
                    className={cn(navigationMenuTriggerStyle(), 'text-indigo-800 hover:text-white hover:bg-indigo-600')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Pricing
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a
                    href="#contact"
                    onClick={(e) => scrollToSection(e, '#contact')}
                    className={cn(navigationMenuTriggerStyle(), 'text-indigo-800 hover:text-white hover:bg-indigo-600')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a
                    href="#about"
                    onClick={(e) => scrollToSection(e, '#about')}
                    className={cn(navigationMenuTriggerStyle(), 'text-indigo-800 hover:text-white hover:bg-indigo-600')}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full p-0">
                    <div className="flex items-center gap-2 border border-indigo-100 p-1 pl-3 pr-2 rounded-full bg-white hover:bg-indigo-50 overflow-hidden max-w-[200px]">
                      <span className="text-indigo-800 font-medium text-sm truncate">My Account</span>
                      <Avatar className="h-8 w-8 border-2 border-indigo-600/20">
                        <AvatarImage src={getUserAvatar()} />
                        <AvatarFallback className="bg-indigo-600 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/settings" state={{ from: location.pathname }} className="flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-indigo-800 border-indigo-200 hover:bg-indigo-50">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    Sign Up <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="text-indigo-800"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-3 animate-fade-in-up">
            <div className="flex flex-col space-y-2">
              {publicNavItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) =>
                    item.name === 'Home' ? handleHomeClick(e) : scrollToSection(e, item.href)
                  }
                  className={cn(
                    'px-3 py-2 rounded-md text-base font-medium flex items-center',
                    location.pathname === item.href
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-600/90 text-white hover:bg-indigo-700'
                  )}
                >
                  {item.icon}
                  {item.name}
                </a>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 mt-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full text-indigo-800 border-indigo-200">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Sign Up</Button>
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <Link to="/settings" state={{ from: location.pathname }} className="w-full">
                    <Button variant="outline" className="w-full mb-2 text-indigo-800 border-indigo-200">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </Button>
                  </Link>
                  <Button onClick={() => logout()} variant="outline" className="w-full text-red-500 border-red-200">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
