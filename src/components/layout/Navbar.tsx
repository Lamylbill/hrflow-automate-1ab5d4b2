
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Menu, X, LogOut, Info, Users, Phone, Home, BarChart, FileText, Calendar, Shield } from 'lucide-react';
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  showLogo?: boolean;
}

export const Navbar = ({ showLogo = true }: NavbarProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
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

  const publicNavItems = [
    { name: 'Home', href: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'Features', href: '#features', icon: <BarChart className="h-4 w-4 mr-2" /> },
    { name: 'Pricing', href: '#pricing', icon: <FileText className="h-4 w-4 mr-2" /> },
    { name: 'Contact', href: '#contact', icon: <Phone className="h-4 w-4 mr-2" /> },
    { name: 'About', href: '#about', icon: <Info className="h-4 w-4 mr-2" /> },
  ];

  const featuresItems = [
    { 
      title: "Employee Management", 
      description: "Centralized database for employee records",
      icon: <Users className="h-5 w-5 text-hrflow-blue" />,
      href: "#features"
    },
    { 
      title: "Payroll & Compliance", 
      description: "Automated calculations with Singapore compliance",
      icon: <Calendar className="h-5 w-5 text-hrflow-blue" />,
      href: "#features"
    },
    { 
      title: "Leave Management", 
      description: "Streamlined approval workflows",
      icon: <Calendar className="h-5 w-5 text-hrflow-blue" />,
      href: "#features"
    },
    { 
      title: "Performance Tracking", 
      description: "Set and track performance goals",
      icon: <BarChart className="h-5 w-5 text-hrflow-blue" />,
      href: "#features"
    },
  ];

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (sectionId.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(sectionId.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
  });
  ListItem.displayName = "ListItem";

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isAuthenticated || location.pathname !== '/' 
          ? 'bg-white/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {showLogo && (
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-hrflow-blue text-white font-display font-bold px-2 py-1 rounded-md">HR</span>
              <span className="font-display font-bold text-xl">Flow</span>
            </Link>
          )}

          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={navigationMenuTriggerStyle()}>
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <BarChart className="h-4 w-4 mr-2" />
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {featuresItems.map((item, index) => (
                        <ListItem
                          key={index}
                          title={
                            <div className="flex items-center">
                              {item.icon}
                              <span className="ml-2">{item.title}</span>
                            </div>
                          }
                          href={item.href}
                          onClick={(e) => scrollToSection(e, item.href)}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <a 
                    href="#pricing" 
                    onClick={(e) => scrollToSection(e, '#pricing')}
                    className={navigationMenuTriggerStyle()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Pricing
                  </a>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <a 
                    href="#contact" 
                    onClick={(e) => scrollToSection(e, '#contact')}
                    className={navigationMenuTriggerStyle()}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </a>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <a 
                    href="#about" 
                    onClick={(e) => scrollToSection(e, '#about')}
                    className={navigationMenuTriggerStyle()}
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
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-hrflow-blue/20">
                      <AvatarFallback className="bg-hrflow-blue text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="flex w-full">Settings</Link>
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
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
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
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={cn(
                    "px-3 py-2 rounded-md text-base font-medium flex items-center",
                    location.pathname === item.href
                      ? "bg-hrflow-blue/10 text-hrflow-blue"
                      : "text-gray-700 hover:bg-gray-100 hover:text-hrflow-blue"
                  )}
                >
                  {item.icon}
                  {item.name}
                </a>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 mt-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <Button onClick={() => logout()} variant="outline" className="w-full text-red-500">
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
