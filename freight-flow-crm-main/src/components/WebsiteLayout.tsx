import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface WebsiteLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const WebsiteLayout = ({ children, showFooter = true }: WebsiteLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default WebsiteLayout;
