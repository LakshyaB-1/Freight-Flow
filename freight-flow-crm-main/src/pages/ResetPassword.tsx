import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import WebsiteLayout from '@/components/WebsiteLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { updatePassword, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Invalid or expired reset link. Please request a new one.');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    if (password !== confirmPassword) { setError('Passwords do not match'); setIsLoading(false); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); setIsLoading(false); return; }
    const { error } = await updatePassword(password);
    if (error) { setError(error.message); setIsLoading(false); }
    else { setSuccess(true); toast.success('Password updated successfully!'); setTimeout(() => navigate('/'), 2000); }
  };

  if (loading) {
    return (
      <WebsiteLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout>
      <section className="flex items-center justify-center py-16 md:py-24 px-4">
        <Card className="w-full max-w-md shadow-xl border-border/50">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg">
                <KeyRound className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
              <CardDescription className="mt-2">Enter your new password below</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {success ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-success/10 p-4 rounded-full">
                    <CheckCircle2 className="h-12 w-12 text-success" />
                  </div>
                </div>
                <p className="text-muted-foreground">Your password has been updated. Redirecting...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={isLoading} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required disabled={isLoading} className="h-11" />
                  </div>
                  <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</> : 'Update Password'}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <Button variant="ghost" onClick={() => navigate('/auth')} className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />Back to Login
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </WebsiteLayout>
  );
};

export default ResetPassword;
