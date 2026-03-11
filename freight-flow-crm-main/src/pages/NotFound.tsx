import { Link } from 'react-router-dom';
import WebsiteLayout from '@/components/WebsiteLayout';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <WebsiteLayout>
      <section className="flex flex-col items-center justify-center py-24 md:py-32 px-4 text-center">
        <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </section>
    </WebsiteLayout>
  );
};

export default NotFound;
