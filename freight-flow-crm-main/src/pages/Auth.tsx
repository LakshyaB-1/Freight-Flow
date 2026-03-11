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

  // Redirect handled by wrapping with PublicOnlyRoute or useEffect
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
      setError(error.message);
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
      setError(error.message);
      setIsLoading(false);
    } else {
      toast.success('Account created! Please check your email to verify your account.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const { error } = await resetPassword(email);
    if (error) {
      setError(error.message);
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
              <div>
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription className="mt-2">
                  Enter your email and we'll send you a reset link
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {resetEmailSent ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-success/10 p-4 rounded-full">
                      <CheckCircle2 className="h-12 w-12 text-success" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Check your email</p>
                    <p className="text-sm text-muted-foreground">
                      We've sent a password reset link to your email address. Please check your inbox and spam folder.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => { setView('auth'); setResetEmailSent(false); }}
                    className="mt-4"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="reset-email" name="email" type="email" placeholder="you@company.com" required disabled={isLoading} className="pl-10 h-11" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : 'Send Reset Link'}
                    </Button>
                  </form>
                  <div className="mt-6 text-center">
                    <Button variant="ghost" onClick={() => setView('auth')} className="text-muted-foreground hover:text-foreground">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </div>
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
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left — Marketing panel */}
            <div className="hidden md:flex flex-col gap-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  Simplify Your Freight Operations
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Freight Flow CRM gives you a single place to manage shipments, track containers, handle customs documentation, and generate reports — all from your browser.
                </p>
              </div>

              <div className="space-y-5">
                {features.map((f) => (
                  <div key={f.title} className="flex gap-4 items-start">
                    <div className="bg-primary/10 p-2.5 rounded-lg shrink-0">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{f.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Auth form */}
            <Card className="shadow-xl border-border/50">
              <CardHeader className="text-center space-y-4 pb-2">
                <div className="flex justify-center md:hidden">
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg">
                    <Ship className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
                  <CardDescription className="mt-1">Sign in to your account or create a new one</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Tabs defaultValue="login" className="w-full" onValueChange={() => setError(null)}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="font-medium">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="font-medium">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="login-email" name="email" type="email" placeholder="you@company.com" required disabled={isLoading} className="pl-10 h-11" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password">Password</Label>
                          <button type="button" onClick={() => setView('forgot-password')} className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors">
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="login-password" name="password" type="password" placeholder="••••••••" required disabled={isLoading} className="pl-10 h-11" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="signup-email" name="email" type="email" placeholder="you@company.com" required disabled={isLoading} className="pl-10 h-11" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="company-name" name="companyName" type="text" placeholder="Your Company Ltd." disabled={isLoading} className="pl-10 h-11" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="signup-password" name="password" type="password" placeholder="••••••••" required disabled={isLoading} className="pl-10 h-11" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="confirm-password" name="confirmPassword" type="password" placeholder="••••••••" required disabled={isLoading} className="pl-10 h-11" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-center text-xs text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default Auth;
