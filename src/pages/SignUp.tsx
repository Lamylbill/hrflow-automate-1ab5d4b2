
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { signUp } from '@/lib/auth';
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up successful",
          description: "Please check your email to confirm your account.",
        });
        // Navigate to login page after successful signup
        navigate('/login');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Signup error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Extreme button style to ensure visibility
  const buttonStyleOverride = {
    color: 'white',
    backgroundColor: '#2563EB',
    fontWeight: 800,
    textShadow: '0 1px 3px rgba(0,0,0,0.7)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
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
                <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
                <p className="text-gray-600 mt-2">Sign up to get started with HRFlow</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-6">
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
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border-none shadow-none"
                      onClick={togglePasswordVisibility}
                      style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none', minWidth: 'auto' }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-white bg-hrflow-blue uppercase font-extrabold tracking-wide"
                  disabled={loading}
                  style={buttonStyleOverride}
                >
                  {loading ? 'Creating account...' : 'Sign up'} 
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-sm text-hrflow-blue font-medium hover:underline">
                    Log in
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

export default SignUp;
