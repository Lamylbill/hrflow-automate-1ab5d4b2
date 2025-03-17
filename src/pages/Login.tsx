
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { signIn, getCurrentSession, checkAuthStatus } from '@/lib/auth';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, clearUserData } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Run a comprehensive auth check
        const { isAuthenticated, session } = await checkAuthStatus();
        
        if (isAuthenticated && session) {
          console.log('User already has a valid session, redirecting to dashboard');
          navigate('/dashboard');
        } else {
          console.log('No valid session found, staying on login page');
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      }
    };

    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      checkAuth();
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Clear any existing data to ensure a clean state
      clearUserData();
      
      console.log('Starting login process...');
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        let errorMessage = error.message;
        
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Incorrect email or password. Please try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email before logging in. Check your inbox for a confirmation email.';
        }
        
        setError(errorMessage);
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.session) {
        console.log('Login successful, session established');
        
        // Double-check session validity
        const currentSession = await getCurrentSession();
        if (currentSession) {
          console.log('Session verified, redirecting to dashboard');
          toast({
            title: "Login successful",
            description: "Welcome back to HRFlow!",
          });
          navigate('/dashboard');
        } else {
          console.error('Session verification failed');
          setError('Authentication succeeded but session verification failed. Please try again.');
          toast({
            title: "Login issue",
            description: "Session verification failed. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // This case handles when there's no error but also no valid session
        console.error('No session established after login');
        setError('Authentication failed. Please try again.');
        toast({
          title: "Login failed",
          description: "Authentication failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setEmail('demo@hrflow.com');
    setPassword('demopassword');
  };

  // Fixed TypeScript issue with textTransform
  const buttonStyleOverride = {
    color: 'white',
    backgroundColor: '#2563EB',
    fontWeight: 800,
    textShadow: '0 1px 3px rgba(0,0,0,0.7)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    padding: '10px 16px',
  };

  // Fixed TypeScript issue with textTransform
  const outlineButtonStyleOverride = {
    color: '#2563EB',
    backgroundColor: 'transparent',
    fontWeight: 800,
    textShadow: 'none',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '2px solid #2563EB',
    padding: '10px 16px',
  };

  return (
    <>
      <Navbar showLogo={true} />
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 pt-24">
        <div className="w-full max-w-md">
          <AnimatedSection>
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
              <div className="mb-8 text-center">
                <Link to="/" className="inline-flex items-center gap-2 mb-6">
                  <span className="bg-hrflow-blue text-white font-display font-bold px-2 py-1 rounded-md">HR</span>
                  <span className="font-display font-bold text-xl">Flow</span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                <p className="text-gray-600 mt-2">Log in to your account</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-hrflow-blue hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-hrflow-blue text-white uppercase font-extrabold tracking-wide"
                  variant="premium"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log in'} 
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-hrflow-blue hover:text-white uppercase font-extrabold tracking-wide"
                  onClick={fillTestCredentials}
                >
                  Use demo credentials
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-hrflow-blue font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
};

export default Login;
