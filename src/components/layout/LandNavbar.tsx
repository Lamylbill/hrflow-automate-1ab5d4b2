import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronRight, Menu, X, LogOut, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-custom/Button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getNavItems } from './NavItems';
import { toast } from 'sonner';

interface NavbarProps {
  showLogo?: boolean;
}

export const LandNavbar = ({ showLogo = true }: NavbarProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isCompact, setIsCompact] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setIsCompact(entry.contentRect.width < 880);
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleScroll = useCallback(() => {
    const currentScroll = window.scrollY;
    setIsScrolled(currentScroll > 10);

    if (currentScroll > lastScrollTop.current) {
      setScrollDirection('down');
    } else {
      setScrollDirection('up');
    }
    lastScrollTop.current = currentScroll <= 0 ? 0 : currentScroll;

    if (location.pathname === '/') {
      const sections = ['home', 'features', 'pricing', 'contact', 'about'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const publicNavItems = getNavItems();
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      const parts = user.user_metadata.full_name.split(' ');
      return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };
  const getUserAvatar = () => user?.user_metadata?.avatar_url || null;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const targetId = sectionId.startsWith('#') ? sectionId.substring(1) : sectionId;
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    } else if (location.pathname !== '/') {
      navigate('/' + sectionId);
      toast.info(`Navigating to ${targetId} section`);
    } else {
      toast.info(`Navigating to ${targetId} section`);
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
    } else {
      navigate('/');
    }
  };

  const isSectionActive = (section: string) => activeSection === section.toLowerCase();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform',
        isScrolled ? 'bg-white shadow-md border-b border-hrflow-gray-medium' : 'bg-white',
        scrollDirection === 'down' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      )}
    >
      <nav className="container mx-auto px-6 py-3" ref={containerRef}>
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
                {publicNavItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <a
                      href={item.href}
                      onClick={(e) => item.name === 'Home' ? handleHomeClick(e) : scrollToSection(e, item.href)}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isSectionActive(item.name.toLowerCase())
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'text-indigo-800 hover:bg-indigo-50 hover:text-indigo-700'
                      )}
                    >
                      {item.icon}
                      {!isCompact && <span className="ml-2">{item.name}</span>}
                    </a>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium text-indigo-800 border-indigo-200 hover:bg-indigo-50">
                    My Account
                    <Avatar className="h-7 w-7 border-2 border-indigo-600/20">
                      {getUserAvatar() ? (
                        <AvatarImage src={getUserAvatar()} alt="avatar" />
                      ) : (
                        <AvatarFallback className="bg-indigo-600 text-white text-sm font-medium">
                          {getUserInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border border-gray-200 z-50">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/settings" state={{ from: location.pathname }} className="flex w-full items-center text-gray-700 hover:text-indigo-700">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-indigo-700 border-indigo-200 hover:bg-indigo-50">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Sign Up <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-indigo-800">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};
