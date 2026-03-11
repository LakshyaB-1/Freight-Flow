import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import logo from '@/assets/logo.png';
import oceanShip from '@/assets/ocean-ship.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-secondary mt-auto overflow-hidden">
      {/* Subtle background image */}
      <div className="absolute inset-0 opacity-5">
        <img src={oceanShip} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Freight Flow CRM" className="h-10 w-10 object-contain" />
              <span className="font-bold text-lg text-secondary-foreground">Freight Flow CRM</span>
            </div>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed max-w-md">
              Your trusted partner for seamless freight forwarding, customs clearance, and end-to-end shipment management solutions. A product of{' '}
              <a href="https://freight-link-logistics-systems.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                Freight Link Logistics Systems
              </a>.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-secondary-foreground">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-secondary-foreground/70">
              <li><a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="/auth" className="hover:text-primary transition-colors">Sign In</a></li>
              <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-secondary-foreground">Contact</h3>
            <ul className="space-y-2.5 text-sm text-secondary-foreground/70">
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" />support.freightlink@gmail.com</li>
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" />+91 9818684545</li>
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />Bhikaji Cama Place, New Delhi-110066, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-secondary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary-foreground/50">
            &copy; {currentYear} Freight Flow CRM. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-secondary-foreground/50">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
