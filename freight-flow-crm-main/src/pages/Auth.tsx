import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import WebsiteLayout from '@/components/WebsiteLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ship, Loader2, AlertCircle, Mail, Lock, Building2, CheckCircle2, ArrowLeft, Package, BarChart3, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

type AuthView = 'auth' | 'forgot-password';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<AuthView>('auth');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || 'Failed to sign in. Please try again.');
      console.error('Login error:', error);
      setIsLoading(false);
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const companyName = formData.get('companyName') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, companyName);

    if (error) {
      setError(error.message || 'Failed to create account. Please try again.');
      console.error('Sign up error:', error);
      setIsLoading(false);
    } else {
      toast.success('Account created! You can now sign in.');
      setIsLoading(false);
    }
  };

  // ✅ FIXED FUNCTION
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const { error } = await resetPassword(email);

    if (error) {
      console.error('Reset password error:', error);
      setError(error.message || 'Failed to send reset email. Please try again.');
      setIsLoading(false);
    } else {
      setResetEmailSent(true);
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Package, title: 'Shipment Tracking', desc: 'Track every container from origin to destination in real time.' },
    { icon: BarChart3, title: 'Reports & Analytics', desc: 'Visualize trends, export data, and make informed decisions.' },
    { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Enterprise-grade security with role-based access controls.' },
  ];

  if (view === 'forgot-password') {
    return (
      <WebsiteLayout>
        <section className="flex items-center justify-center py-16 md:py-24 px-4">
          <Card className="w-full max-w-md shadow-xl border-border/50">
            <CardHeader className="text-center space-y-4 pb-2">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg">
                  <Mail className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
              <CardDescription>
                Enter your email and we'll send you a reset link
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {resetEmailSent ? (
                <div className="text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
                  <p>Check your email for reset instructions.</p>
                </div>
              ) : (
                <>
                  {error && <p className="text-red-500">{error}</p>}

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <Input name="email" type="email" required placeholder="Enter your email" />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout>
      <div className="max-w-md mx-auto mt-10">
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input name="email" type="email" required placeholder="Email" />
              <Input name="password" type="password" required placeholder="Password" />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input name="email" type="email" required placeholder="Email" />
              <Input name="companyName" type="text" placeholder="Company Name" />
              <Input name="password" type="password" required placeholder="Password" />
              <Input name="confirmPassword" type="password" required placeholder="Confirm Password" />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </WebsiteLayout>
  );
};

export default Auth;