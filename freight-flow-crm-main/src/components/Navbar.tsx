import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Shield, Menu, X, GraduationCap } from 'lucide-react';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isAuthPage = location.pathname === '/auth' || location.pathname === '/reset-password';
  const isLanding = location.pathname === '/';

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-colors ${isLanding ? 'border-white/10 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/80' : 'border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate(user ? '/dashboard' : '/'); }}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <img src={logo} alt="Freight Flow CRM" className="h-10 w-10 object-contain" />
            <div className="hidden sm:block">
              <span className={`text-lg font-bold tracking-tight ${isLanding ? 'text-white' : 'text-foreground'}`}>
                Freight Flow CRM
              </span>
              <p className={`text-[10px] leading-tight -mt-0.5 ${isLanding ? 'text-white/60' : 'text-muted-foreground'}`}>
                Forwarding Agency Management
              </p>
            </div>
            <span className={`sm:hidden text-lg font-bold tracking-tight ${isLanding ? 'text-white' : 'text-foreground'}`}>
              Freight Flow
            </span>
          </a>

          {/* Landing nav */}
          {!user && isLanding && (
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-white/70 hover:text-white transition-colors">Features</button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate('/auth')}>Sign In</Button>
              <Button className="shadow-lg shadow-primary/30" onClick={() => navigate('/auth')}>Get Started</Button>
            </div>
          )}

          {/* Auth nav */}
          {user && !isAuthPage && (
            <div className="hidden md:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-3">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm max-w-[180px] truncate">{user.email}</span>
                    {isAdmin && (
                      <Badge variant="default" className="gap-1 text-[10px] py-0 px-1.5">
                        <Shield className="h-2.5 w-2.5" />
                        Admin
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{isAdmin ? 'Administrator' : 'Member'}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('show-tutorial'))}>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Tutorial
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {!user && isAuthPage && (
            <div className="hidden md:block">
              <span className="text-sm text-muted-foreground">Streamline your freight operations</span>
            </div>
          )}

          {/* Mobile menu button */}
          {(user || isLanding) && !isAuthPage && (
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${isLanding ? 'text-white hover:bg-white/10' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t py-4 space-y-3 animate-fade-in ${isLanding ? 'border-white/10' : 'border-border'}`}>
            {!user && isLanding && (
              <>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>Sign In</Button>
                <Button className="w-full" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>Get Started</Button>
              </>
            )}
            {user && (
              <>
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{isAdmin ? 'Administrator' : 'Member'}</p>
                  </div>
                  {isAdmin && <Badge variant="default" className="gap-1 text-xs"><Shield className="h-3 w-3" />Admin</Badge>}
                </div>
                <div className="border-t border-border pt-3 space-y-1">
                  <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => { window.dispatchEvent(new CustomEvent('show-tutorial')); setMobileMenuOpen(false); }}>
                    <GraduationCap className="h-4 w-4" />Tutorial
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />Sign Out
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
