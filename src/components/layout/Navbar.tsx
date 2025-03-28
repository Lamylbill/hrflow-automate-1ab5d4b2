
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Menu, X, LogOut, Info, Users, Phone, Home, BarChart, FileText, Calendar, Shield, Settings, Camera } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNavItems, getFeaturesItems } from './NavItems';
import { toast } from "sonner";

interface NavbarProps {
  showLogo?: boolean;
}

// Fixed interface definition to properly handle ReactNode type for title
interface ListItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'title' | 'children'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-hrflow-blue hover:text-white focus:bg-hrflow-blue focus:text-white",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export const Navbar = ({ showLogo = true }: NavbarProps) => {
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

  const publicNavItems = getNavItems();
  const featuresItems = getFeaturesItems();

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      const nameParts = user.user_metadata.full_name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.user_metadata.full_name.substring(0, 2).toUpperCase();
    }
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return 'U';
  };

  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || null;
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    if (sectionId.startsWith('#')) {
      const targetId = sectionId.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100, // Offset for header
          behavior: 'smooth'
        });
        setIsMobileMenuOpen(false); // Close mobile menu after navigation
      } else {
        // If we're not on the home page, navigate to home with the hash
        if (location.pathname !== '/') {
          navigate('/' + sectionId);
          toast.info(`Navigating to ${targetId} section`);
        } else {
          // If we are on the home page but section doesn't exist, just notify
          toast.info(`Navigating to ${targetId} section`);
        }
      }
    } else {
      navigate(sectionId);
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // If on home page, scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Navigate to home page
      navigate('/');
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isAuthenticated || location.pathname !== '/' 
          ? 'bg-white shadow-md border-b border-hrflow-gray-medium' 
          : 'bg-white shadow-sm'
      )}
    >
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {showLogo && (
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-display font-bold px-2 py-1 rounded-md">HR</span>
              <span className="font-display font-bold text-xl text-indigo-800">Flow</span>
            </Link>
          )}

          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <a 
                    href="/" 
                    onClick={handleHomeClick}
                    className={cn(
                      navigationMenuTriggerStyle(), 
                      "font-medium text-indigo-800 hover:bg-indigo-600 hover:text-white"
                    )}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    <span>Home</span>
                  </a>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <a 
                    href="#features" 
                    onClick={(e) => scrollToSection(e, '#features')}
                    className={cn(
                      navigationMenuTriggerStyle(), 
                      "font-medium text-indigo-800 hover:bg-indigo-600 hover:text-white"
                    )}
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    <span>Features</span>
                  </a>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <a 
                    href="#pricing" 
                    onClick={(e) => scrollToSection(e, '#pricing')}
                    className={cn(
                      navigationMenuTriggerStyle(), 
                      "font-medium text-indigo-800 hover:bg-indigo-600 hover:text-white"
                    )}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Pricing</span>
                  </a>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <a 
                    href="#contact" 
                    onClick={(e) => scrollToSection(e, '#contact')}
                    className={cn(
                      navigationMenuTriggerStyle(), 
                      "font-medium text-indigo-800 hover:bg-indigo-600 hover:text-white"
                    )}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Contact</span>
                  </a>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <a 
                    href="#about" 
                    onClick={(e) => scrollToSection(e, '#about')}
                    className={cn(
                      navigationMenuTriggerStyle(), 
                      "font-medium text-indigo-800 hover:bg-indigo-600 hover:text-white"
                    )}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    <span>About</span>
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
                    <div className="flex items-center gap-2 border border-indigo-100 p-1 pl-3 pr-2 rounded-full bg-white hover:bg-indigo-50">
                      <span className="text-indigo-800 font-medium text-sm">My Account</span>
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
                    <Link 
                      to="/settings" 
                      state={{ from: location.pathname }}
                      className="flex w-full items-center"
                    >
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
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
                  onClick={(e) => item.name === 'Home' ? handleHomeClick(e) : scrollToSection(e, item.href)}
                  className={cn(
                    "px-3 py-2 rounded-md text-base font-medium flex items-center",
                    location.pathname === item.href
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-600/90 text-white hover:bg-indigo-700"
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
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <Link 
                    to="/settings" 
                    state={{ from: location.pathname }}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full mb-2 text-indigo-800 border-indigo-200">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                  </Link>
                  <Button onClick={() => logout()} variant="outline" className="w-full text-red-500 border-red-200">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
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
