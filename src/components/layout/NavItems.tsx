
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, BarChart, FileText, Phone, Info, Calendar, Users, Briefcase, ShieldCheck } from 'lucide-react';
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Export the navigation items for reuse
export const getNavItems = () => [
  { name: 'Home', href: '/', icon: <Home className="h-4 w-4 mr-2" /> },
  { name: 'Features', href: '#features', icon: <BarChart className="h-4 w-4 mr-2" /> },
  { name: 'Pricing', href: '#pricing', icon: <FileText className="h-4 w-4 mr-2" /> },
  { name: 'Contact', href: '#contact', icon: <Phone className="h-4 w-4 mr-2" /> },
  { name: 'About', href: '#about', icon: <Info className="h-4 w-4 mr-2" /> },
];

export const getFeaturesItems = () => [
  { 
    title: "Employee Management", 
    description: "Centralized database for employee records",
    icon: <Users className="h-5 w-5 text-hrflow-blue" />,
    href: "#features-employee"
  },
  { 
    title: "Payroll & Compliance", 
    description: "Automated calculations with Singapore compliance",
    icon: <Calendar className="h-5 w-5 text-hrflow-blue" />,
    href: "#features-payroll"
  },
  { 
    title: "Leave Management", 
    description: "Streamlined approval workflows",
    icon: <Calendar className="h-5 w-5 text-hrflow-blue" />,
    href: "#features-leave"
  },
  { 
    title: "Performance Tracking", 
    description: "Set and track performance goals",
    icon: <BarChart className="h-5 w-5 text-hrflow-blue" />,
    href: "#features-performance"
  },
  { 
    title: "Recruitment & Onboarding", 
    description: "AI-powered job matching with automated document collection",
    icon: <Briefcase className="h-5 w-5 text-hrflow-blue" />,
    href: "#features-recruitment"
  },
  { 
    title: "Compliance & Security", 
    description: "Meet regulatory requirements with secure document storage",
    icon: <ShieldCheck className="h-5 w-5 text-hrflow-blue" />,
    href: "#features-compliance"
  },
];

// Simple navigation item component
export const NavItem = ({ 
  item, 
  onClick 
}: { 
  item: { name: string; href: string; icon: React.ReactNode }; 
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void 
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href.startsWith('#')) {
      // Handle hash navigation (scroll to section)
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100, // Offset for header
          behavior: 'smooth'
        });
      } else {
        // If element doesn't exist on current page, navigate to home with hash
        navigate('/' + href);
      }
    } else {
      // For regular routes
      navigate(href);
    }
    
    // Call the additional onClick handler if provided
    if (onClick) {
      onClick(e, href);
    }
  };
  
  return (
    <NavigationMenuItem>
      <Link 
        to={item.href} 
        className={navigationMenuTriggerStyle()}
        onClick={(e) => handleClick(e, item.href)}
      >
        {item.icon}
        <span className="font-medium">{item.name}</span>
      </Link>
    </NavigationMenuItem>
  );
};

export default NavItem;
