import { Search } from 'lucide-react';
import logo from '@/assets/logo.png';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const Header = ({ searchTerm, onSearchChange }: HeaderProps) => {
  return (
    <header className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Freight Flow CRM" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Freight Flow CRM</h1>
              <p className="text-xs text-secondary-foreground/70">Forwarding Agency Management</p>
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
