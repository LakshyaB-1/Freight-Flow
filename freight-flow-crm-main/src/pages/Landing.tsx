import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import WebsiteLayout from '@/components/WebsiteLayout';
import { Button } from '@/components/ui/button';
import {
  Ship, Package, BarChart3, ShieldCheck, Users, Globe, Clock, ArrowRight,
  Container, FileText, Sparkles, CheckCircle2, Anchor, MapPin
} from 'lucide-react';
import heroPort from '@/assets/hero-port.jpg';
import oceanShip from '@/assets/ocean-ship.jpg';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect is handled by PublicOnlyRoute in App.tsx

  const features = [
    { icon: Package, title: 'Shipment Tracking', desc: 'Track every container from booking to delivery with 7-stage milestone tracking and real-time status updates.' },
    { icon: Users, title: 'Customer Management', desc: 'Manage consignees, shippers, and contacts in one place. Link customers directly to shipments.' },
    { icon: FileText, title: 'Document Vault', desc: 'Upload, tag, and manage Bills of Lading, invoices, packing lists, and customs documents.' },
    { icon: BarChart3, title: 'Reports & Analytics', desc: 'Visualize trends with interactive charts. Export reports as PDF or Excel for stakeholders.' },
    { icon: Sparkles, title: 'AI Assistant', desc: 'Get instant shipment summaries, draft customer emails, and receive proactive risk alerts.' },
    { icon: ShieldCheck, title: 'Role-Based Security', desc: 'Enterprise-grade security with admin controls, row-level policies, and audit trails.' },
  ];

  const stats = [
    { value: '10,000+', label: 'Shipments Managed' },
    { value: '50+', label: 'Shipping Lines' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={heroPort} alt="Container port at sunset" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 text-sm text-primary-foreground">
              <Anchor className="h-4 w-4" />
              <span>Trusted by logistics professionals worldwide</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Navigate Your
              <span className="block text-primary mt-1">Freight Operations</span>
              With Confidence
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-xl">
              The all-in-one CRM platform built for freight forwarders, customs brokers, and logistics teams. 
              Manage shipments, documents, customers, and analytics — from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-base font-semibold gap-2 shadow-xl shadow-primary/30" onClick={() => navigate('/auth')}>
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" className="h-14 px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Features
              </Button>
            </div>
          </div>
        </div>

        {/* Floating stat badges */}
        <div className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 text-center min-w-[160px]">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar (mobile) */}
      <section className="xl:hidden bg-secondary border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-secondary-foreground/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 text-sm text-primary font-medium mb-4">
              <Globe className="h-4 w-4" />
              Everything You Need
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Built for Modern Freight Forwarding
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              From shipment creation to final delivery, every tool your team needs in one powerful platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="bg-primary/10 p-3 rounded-xl w-fit mb-5 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ocean visual section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={oceanShip} alt="Cargo ship on open ocean" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-secondary/85 backdrop-blur-sm" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Your Shipments Deserve Better Visibility
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Our 7-stage milestone tracking gives you pinpoint accuracy on every shipment — from booking confirmation 
              through customs clearance to final delivery. Never lose sight of your cargo again.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {['Booking Confirmed', 'Cargo Picked Up', 'Export Cleared', 'Departed', 'Arrived', 'Import Cleared', 'Delivered'].map((m) => (
                <div key={m} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm text-white font-medium">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FLLS Parent Company Section */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 text-sm text-primary font-medium mb-4">
              <Anchor className="h-4 w-4" />
              Our Parent Company
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Powered by Freight Link Logistics Systems
            </h2>
            <p className="mt-6 text-muted-foreground text-base leading-relaxed">
              Freight Link Logistics Systems is a global logistics and freight forwarding company specializing in international shipping, cargo management, customs clearance, and end-to-end supply chain solutions. With years of industry experience and a network of partners across multiple countries, the company provides reliable and efficient logistics services to businesses worldwide. From handling complex freight movements to ensuring seamless cargo delivery, Freight Link Logistics Systems focuses on transparency, operational excellence, and customer-centric logistics solutions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Globe, title: 'Global Freight Forwarding', desc: 'Comprehensive freight solutions connecting businesses to markets across every continent.' },
              { icon: Ship, title: 'Air & Ocean Cargo Services', desc: 'Flexible air and ocean freight options tailored for speed, cost, and reliability.' },
              { icon: ShieldCheck, title: 'Customs Clearance & Compliance', desc: 'Expert customs brokerage ensuring smooth, regulation-compliant cargo movement.' },
              { icon: Container, title: 'Warehousing & Distribution', desc: 'Secure storage and efficient distribution networks for seamless supply chains.' },
              { icon: BarChart3, title: 'International Trade Logistics', desc: 'End-to-end trade facilitation from documentation to final-mile delivery.' },
              { icon: Users, title: 'Reliable Global Partner Network', desc: 'Trusted partnerships with carriers and agents spanning 50+ countries.' },
            ].map((item) => (
              <div
                key={item.title}
                className="group bg-background border border-border rounded-2xl p-8 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="bg-primary/10 p-3 rounded-xl w-fit mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-semibold gap-2 border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => window.open('https://freight-link-logistics-systems.vercel.app/', '_blank')}
            >
              Visit Freight Link Logistics Systems
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-secondary to-secondary/90 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <MapPin className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Ready to Streamline Your Logistics?
              </h2>
              <p className="text-white/70 text-lg">
                Join hundreds of freight forwarders who trust our platform for their daily operations.
              </p>
              <Button size="lg" className="h-14 px-10 text-base font-semibold gap-2 shadow-xl shadow-primary/30" onClick={() => navigate('/auth')}>
                Start Free Today
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default Landing;
