import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WebsiteLayout from '../components/WebsiteLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Ship, Mail, CheckCircle2, Package, BarChart3, ShieldCheck } from 'lucide-react';
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
            <div className="px-6 pb-6 text-center">
              <button
                type="button"
                onClick={() => setView('auth')}
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Back to login
              </button>
            </div>
          </Card>
        </section>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout>
      <section className="min-h-[calc(100vh-6rem)] flex items-center py-10 px-4">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[1.2fr_0.9fr] items-center">
          <div className="space-y-10">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm shadow-primary/10">
                <Ship className="h-5 w-5" />
                Freight Flow CRM
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                  Simplify Your Freight Operations
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                  Freight Flow CRM gives you a single place to manage shipments, track containers, handle customs documentation, and generate reports — all from your browser.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4 rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm shadow-slate-900/5">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border/70 bg-card/95 p-6 shadow-xl shadow-slate-900/10">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold">Welcome</h2>
              <p className="text-sm text-muted-foreground">Sign in to your account or create a new one</p>
            </div>

            <div className="mt-6 rounded-[24px] border border-border/70 bg-background/80 p-2">
              <Tabs defaultValue="login">
                <TabsList className="grid grid-cols-2 rounded-[20px] bg-slate-200 p-1">
                  <TabsTrigger value="login" className="rounded-[18px]">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-[18px]">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  {error && <p className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input name="email" type="email" required placeholder="Email" />
                    <Input name="password" type="password" required placeholder="Password" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span />
                      <button type="button" onClick={() => setView('forgot-password')} className="font-medium text-primary transition-colors hover:text-primary/80">
                        Forgot password?
                      </button>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  {error && <p className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <Input name="email" type="email" required placeholder="Email" />
                    <Input name="companyName" type="text" placeholder="Company Name" />
                    <Input name="password" type="password" required placeholder="Password" />
                    <Input name="confirmPassword" type="password" required placeholder="Confirm Password" />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default Auth;