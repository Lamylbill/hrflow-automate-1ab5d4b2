
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BarChart, FileText, Phone, Info, Calendar, Users } from 'lucide-react';
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

// Simple navigation item component
export const NavItem = ({ 
  item, 
  onClick 
}: { 
  item: { name: string; href: string; icon: React.ReactNode }; 
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void 
}) => {
  return (
    <NavigationMenuItem>
      <Link 
        to={item.href.startsWith('#') ? '/' + item.href : item.href} 
        className={navigationMenuTriggerStyle()}
        onClick={(e) => onClick && onClick(e, item.href)}
      >
        {item.icon}
        {item.name}
      </Link>
    </NavigationMenuItem>
  );
};

export default NavItem;
