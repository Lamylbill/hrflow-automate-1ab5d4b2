
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Users, Clock, Calendar, BarChart, ShieldCheck, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { PremiumCard, CardContent } from '@/components/ui-custom/Card';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { getFeaturesItems } from '@/components/layout/NavItems';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const featuresItems = getFeaturesItems();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <Users className="h-10 w-10 text-white" />,
      title: "Employee Management",
      description: "Centralized database for all employee records with self-service portal and digital profiles.",
      id: "features-employee"
    },
    {
      icon: <Briefcase className="h-10 w-10 text-white" />,
      title: "Recruitment & Onboarding",
      description: "AI-powered job matching with automated document collection for seamless onboarding.",
      id: "features-recruitment"
    },
    {
      icon: <Clock className="h-10 w-10 text-white" />,
      title: "Leave & Attendance",
      description: "Streamlined leave management with approval workflows and time tracking capabilities.",
      id: "features-leave"
    },
    {
      icon: <BarChart className="h-10 w-10 text-white" />,
      title: "Performance Management",
      description: "Set and track performance goals with AI-driven productivity insights.",
      id: "features-performance"
    },
    {
      icon: <Calendar className="h-10 w-10 text-white" />,
      title: "Payroll & Compensation",
      description: "Automated calculations with Singapore/Malaysia compliance for CPF, MOM, and IRAS.",
      id: "features-payroll"
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-white" />,
      title: "Compliance & Security",
      description: "Meet regulatory requirements with secure document storage and automated compliance.",
      id: "features-compliance"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar showLogo={true} />
      
      {/* Hero Section - Modernized */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 px-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <AnimatedSection className="flex flex-col">
              <div className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm mb-6 w-auto">
                <span className="text-white font-medium">AI-Powered HR Management</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Simplify your <span className="text-blue-600">HR operations</span> with AI
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg leading-relaxed">
                HRFlow streamlines HR, payroll, and compliance for SMEs in Singapore and Malaysia. Perfect for businesses with 0-100 employees.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 px-8">
                      Go to Dashboard <ChevronRight className="h-5 w-5 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 px-8">
                        Get Started <ChevronRight className="h-5 w-5 ml-1" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="rounded-full border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 px-8">
                        Log In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300} className="relative hidden md:block">
              <div className="relative p-4 bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/20"></div>
                <img 
                  src="/lovable-uploads/347f020d-90bf-4f98-9f93-42bae2aa6a8f.png" 
                  alt="HRFlow Dashboard" 
                  className="relative rounded-xl shadow-md border border-gray-100 w-full"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section - Modernized */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
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
                <PremiumCard variant="feature" className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300" id={feature.id}>
                  <CardContent className="pt-8 pb-8">
                    <div className="mb-5 bg-blue-600 rounded-full p-3 inline-block">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </PremiumCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section - Modernized */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <img 
                src="/lovable-uploads/3bf9aea9-07cc-4942-b0a6-e00cdb531f71.png" 
                alt="HR Automation Benefits" 
                className="rounded-2xl shadow-xl border border-white"
              />
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why choose HRFlow?
              </h2>
              <p className="text-lg text-gray-700 mb-10 leading-relaxed">
                We designed HRFlow specifically for SMEs in Singapore and Malaysia to solve the unique challenges they face.
              </p>
              
              <div className="space-y-5">
                {[
                  "Time-saving automation for HR tasks",
                  "Compliance with local regulations (CPF, MOM, IRAS)",
                  "AI-powered insights and analytics",
                  "User-friendly interface with minimal training",
                  "Affordable pricing for growing businesses",
                  "Comprehensive but not overwhelming"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="ml-3 text-gray-700 font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                  <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 px-8">
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"} <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section - Modernized */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white text-center shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-5">Ready to transform your HR operations?</h2>
              <p className="text-xl opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join hundreds of SMEs using HRFlow to save time, ensure compliance, and improve employee experience.
              </p>
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Your Free Trial"} <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer - Modernized */}
      <footer id="about" className="py-16 px-6 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <span className="bg-blue-600 text-white font-display font-bold px-2 py-1 rounded-md">HR</span>
                <span className="font-display font-bold text-xl">Flow</span>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                AI-powered HR management for SMEs in Singapore and Malaysia.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-5 text-gray-900">Product</h3>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Demo', 'Security'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-5 text-gray-900">Company</h3>
              <ul className="space-y-3">
                {['About', 'Careers', 'Blog', 'Legal'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-5 text-gray-900">Support</h3>
              <ul className="space-y-3">
                {['Help Center', 'Contact', 'Status', 'Guides'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <Separator className="my-10 bg-gray-200" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} HRFlow. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
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
