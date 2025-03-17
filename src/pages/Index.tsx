import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Users, Clock, Calendar, BarChart, ShieldCheck, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { PremiumCard, CardContent } from '@/components/ui-custom/Card';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  // Features section data
  const features = [
    {
      icon: <Users className="h-10 w-10 text-hrflow-blue" />,
      title: "Employee Management",
      description: "Centralized database for all employee records with self-service portal and digital profiles.",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-hrflow-blue" />,
      title: "Recruitment & Onboarding",
      description: "AI-powered job matching with automated document collection for seamless onboarding.",
    },
    {
      icon: <Clock className="h-10 w-10 text-hrflow-blue" />,
      title: "Leave & Attendance",
      description: "Streamlined leave management with approval workflows and time tracking capabilities.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-hrflow-blue" />,
      title: "Performance Management",
      description: "Set and track performance goals with AI-driven productivity insights.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-hrflow-blue" />,
      title: "Payroll & Compensation",
      description: "Automated calculations with Singapore/Malaysia compliance for CPF, MOM, and IRAS.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-hrflow-blue" />,
      title: "Compliance & Security",
      description: "Meet regulatory requirements with secure document storage and automated compliance.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="flex flex-col">
              <div className="inline-flex items-center rounded-full border border-hrflow-blue/30 bg-hrflow-blue/5 px-3 py-1 text-sm mb-6 w-auto">
                <span className="text-hrflow-blue font-medium">AI-Powered HR Management</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-hrflow-dark mb-6 leading-tight">
                Simplify your <span className="text-hrflow-blue">HR operations</span> with AI
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
                HRFlow streamlines HR, payroll, and compliance for SMEs in Singapore and Malaysia. Perfect for businesses with 0-100 employees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg">
                      Go to Dashboard <ChevronRight className="h-5 w-5 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button size="lg">
                        Get Started <ChevronRight className="h-5 w-5 ml-1" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg">
                        Log In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300} className="relative">
              <div className="relative p-3 bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-hrflow-blue/5 to-blue-100/20"></div>
                <img 
                  src="/lovable-uploads/16579a3d-78a9-4018-a007-abf6f8fc7c9c.png" 
                  alt="HRFlow Dashboard" 
                  className="relative rounded-xl shadow-sm border border-gray-100 w-full"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-hrflow-dark mb-4">
                Comprehensive HR Management
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform simplifies every aspect of your HR operations with powerful, easy-to-use tools.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection delay={100 * index} key={index}>
                <PremiumCard variant="feature" className="h-full">
                  <CardContent className="pt-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </PremiumCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gray-50 border-t border-b border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <img 
                src="/lovable-uploads/3bf9aea9-07cc-4942-b0a6-e00cdb531f71.png" 
                alt="HR Automation Benefits" 
                className="rounded-xl shadow-lg"
              />
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold text-hrflow-dark mb-6">
                Why choose HRFlow?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We designed HRFlow specifically for SMEs in Singapore and Malaysia to solve the unique challenges they face.
              </p>
              
              <div className="space-y-4">
                {[
                  "Time-saving automation for HR tasks",
                  "Compliance with local regulations (CPF, MOM, IRAS)",
                  "AI-powered insights and analytics",
                  "User-friendly interface with minimal training",
                  "Affordable pricing for growing businesses",
                  "Comprehensive but not overwhelming"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-hrflow-blue" />
                    </div>
                    <p className="ml-3 text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                  <Button size="lg">
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"} <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection>
            <div className="bg-gradient-to-r from-hrflow-blue to-blue-500 rounded-3xl p-12 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your HR operations?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join hundreds of SMEs using HRFlow to save time, ensure compliance, and improve employee experience.
              </p>
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Your Free Trial"} <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-hrflow-blue text-white font-display font-bold px-2 py-1 rounded-md">HR</span>
                <span className="font-display font-bold text-xl">Flow</span>
              </div>
              <p className="text-gray-600 mb-4">
                AI-powered HR management for SMEs in Singapore and Malaysia.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Demo', 'Security'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-hrflow-blue">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About', 'Careers', 'Blog', 'Legal'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-hrflow-blue">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {['Help Center', 'Contact', 'Status', 'Guides'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-hrflow-blue">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} HRFlow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <a key={item} href="#" className="text-gray-500 text-sm hover:text-hrflow-blue">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
