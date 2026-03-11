# Freight Link Logistics - Complete Source Code Export

A production-ready freight forwarding management system built with React, TypeScript, Tailwind CSS, and Supabase.

## Table of Contents
1. [Folder Structure](#folder-structure)
2. [Setup Instructions](#setup-instructions)
3. [Database Schema](#database-schema)
4. [Frontend Code](#frontend-code)
5. [Backend Code](#backend-code)

---

## Folder Structure

```
freight-link-logistics/
├── public/
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── AdminUserManagement.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── ExcelImport.tsx
│   │   ├── Header.tsx
│   │   ├── MobileShipmentCard.tsx
│   │   ├── NavLink.tsx
│   │   ├── ReportsAnalytics.tsx
│   │   ├── ShipmentDetails.tsx
│   │   ├── ShipmentForm.tsx
│   │   ├── ShipmentTable.tsx
│   │   ├── ShipmentTimeline.tsx
│   │   └── StatCard.tsx
│   ├── data/
│   │   └── mockShipments.ts
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useAuth.tsx
│   │   ├── useDocuments.tsx
│   │   ├── useShipments.tsx
│   │   ├── useShipmentTimeline.tsx
│   │   └── useUserRole.tsx
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Auth.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── types/
│   │   └── shipment.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   ├── functions/
│   │   └── send-notification/
│   │       └── index.ts
│   └── migrations/
│       └── (SQL migration files)
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (or self-hosted Supabase)

### 1. Clone and Install

```bash
git clone <repository-url>
cd freight-link-logistics
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### 3. Database Setup

Run the SQL migrations in order (see Database Schema section).

### 4. Edge Functions

Deploy the edge functions to Supabase:

```bash
supabase functions deploy send-notification
```

Add the required secret:
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
```

---

## Database Schema

### SQL Migrations

```sql
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email TEXT,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert roles" ON public.user_roles
    FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON public.user_roles
    FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete roles" ON public.user_roles
    FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- 5. Create shipments table
CREATE TABLE public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    bl_date DATE,
    consignee TEXT NOT NULL,
    shipper TEXT NOT NULL,
    commodity TEXT NOT NULL,
    container_no TEXT,
    container_size TEXT,
    shipping_line TEXT,
    type TEXT,
    forwarder TEXT,
    cha TEXT,
    no_of_packets INTEGER,
    weight NUMERIC,
    cbm NUMERIC,
    status TEXT DEFAULT 'pending',
    be_no TEXT,
    be_date DATE,
    current_status TEXT,
    iec_no TEXT,
    is_airway BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shipments" ON public.shipments
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own shipments" ON public.shipments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shipments" ON public.shipments
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shipments" ON public.shipments
    FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all shipments" ON public.shipments
    FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Create shipment_timeline table
CREATE TABLE public.shipment_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL,
    user_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    old_status TEXT,
    new_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shipment_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shipment timeline" ON public.shipment_timeline
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own timeline events" ON public.shipment_timeline
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all timeline events" ON public.shipment_timeline
    FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Create shipment_documents table
CREATE TABLE public.shipment_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL,
    user_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shipment_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents" ON public.shipment_documents
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own documents" ON public.shipment_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON public.shipment_documents
    FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all documents" ON public.shipment_documents
    FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. Create notification_preferences table
CREATE TABLE public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email_on_status_change BOOLEAN DEFAULT true,
    email_on_document_upload BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences" ON public.notification_preferences
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.notification_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.notification_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- 9. Create handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email)
    VALUES (NEW.id, NEW.email);
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    INSERT INTO public.notification_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$;

-- 10. Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 12. Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('shipment-documents', 'shipment-documents', false);

-- 13. Storage policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'shipment-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'shipment-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
    FOR DELETE USING (bucket_id = 'shipment-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Frontend Code

### Configuration Files

#### package.json
```json
{
  "name": "freight-link-logistics",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "@fontsource/geist-sans": "^5.2.5",
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@supabase/supabase-js": "^2.86.2",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.462.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "xlsx": "^0.18.5",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@types/node": "^20.12.7",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.7.2",
    "autoprefixer": "^10.4.19",
    "eslint": "^9.9.1",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
```

#### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

#### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Freight Link Logistics</title>
    <meta name="description" content="Freight forwarding management system for logistics operations" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Source Files

#### src/main.tsx
```tsx
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
```

#### src/App.tsx
```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
```

#### src/index.css
```css
@import '@fontsource/geist-sans/400.css';
@import '@fontsource/geist-sans/500.css';
@import '@fontsource/geist-sans/600.css';
@import '@fontsource/geist-sans/700.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 20% 98%;
    --foreground: 222 47% 11%;

    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;

    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    --primary: 199 89% 48%;
    --primary-foreground: 0 0% 100%;

    --secondary: 215 25% 27%;
    --secondary-foreground: 210 40% 98%;

    --muted: 214 32% 91%;
    --muted-foreground: 215 16% 47%;

    --accent: 172 66% 50%;
    --accent-foreground: 222 47% 11%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;

    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 199 89% 48%;

    --radius: 0.5rem;

    --success: 142 71% 45%;
    --success-foreground: 0 0% 100%;
    
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;

    --sidebar-background: 215 25% 15%;
    --sidebar-foreground: 210 40% 98%;
    --sidebar-primary: 199 89% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 215 25% 22%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 215 25% 22%;
    --sidebar-ring: 199 89% 48%;
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;

    --card: 215 25% 15%;
    --card-foreground: 210 40% 98%;

    --popover: 215 25% 15%;
    --popover-foreground: 210 40% 98%;

    --primary: 199 89% 48%;
    --primary-foreground: 0 0% 100%;

    --secondary: 215 25% 27%;
    --secondary-foreground: 210 40% 98%;

    --muted: 215 25% 22%;
    --muted-foreground: 215 20% 65%;

    --accent: 172 66% 50%;
    --accent-foreground: 222 47% 11%;

    --destructive: 0 62% 30%;
    --destructive-foreground: 210 40% 98%;

    --border: 215 25% 22%;
    --input: 215 25% 22%;
    --ring: 199 89% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-family: 'Geist Sans', system-ui, sans-serif;
  }
}

@layer utilities {
  .glass-card {
    @apply bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg;
  }
  
  .status-pending {
    @apply bg-warning/10 text-warning border border-warning/20;
  }
  
  .status-done {
    @apply bg-success/10 text-success border border-success/20;
  }
}
```

#### src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### src/types/shipment.ts
```typescript
export interface Shipment {
  id: string;
  date: string;
  blDate: string;
  consignee: string;
  shipper: string;
  commodity: string;
  containerNo: string;
  containerSize: '20' | '40';
  shippingLine: string;
  type: 'FCL' | 'LCL';
  forwarder: string;
  cha: string;
  noOfPackets: number;
  weight: number;
  cbm: number;
  status: 'PENDING' | 'DONE';
  beNo: string;
  beDate: string;
  currentStatus: string;
  iecNo: string;
  isAirway: boolean;
}

export type ShipmentFormData = Omit<Shipment, 'id'>;
```

#### src/integrations/supabase/client.ts
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

#### src/hooks/useAuth.tsx
```tsx
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### src/hooks/useUserRole.tsx
```tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'admin' | 'user';

export const useUserRole = () => {
  const [role, setRole] = useState<AppRole>('user');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole('user');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching role:', error);
        }

        setRole((data?.role as AppRole) || 'user');
      } catch (error) {
        console.error('Error fetching role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  const isAdmin = role === 'admin';

  return { role, isAdmin, loading };
};
```

#### src/hooks/useShipments.tsx
```tsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Shipment, ShipmentFormData } from '@/types/shipment';
import { useToast } from '@/hooks/use-toast';

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchShipments = useCallback(async () => {
    if (!user) {
      setShipments([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedShipments: Shipment[] = (data || []).map(row => ({
        id: row.id,
        date: row.date,
        blDate: row.bl_date || '',
        consignee: row.consignee,
        shipper: row.shipper,
        commodity: row.commodity,
        containerNo: row.container_no || '',
        containerSize: row.container_size === "40'" ? '40' : '20',
        shippingLine: row.shipping_line || '',
        type: (row.type as 'FCL' | 'LCL') || 'FCL',
        forwarder: row.forwarder || '',
        cha: row.cha || '',
        noOfPackets: row.no_of_packets || 0,
        weight: Number(row.weight) || 0,
        cbm: Number(row.cbm) || 0,
        status: row.status === 'done' ? 'DONE' : 'PENDING',
        beNo: row.be_no || '',
        beDate: row.be_date || '',
        currentStatus: row.current_status || '',
        iecNo: row.iec_no || '',
        isAirway: row.is_airway || false,
      }));

      setShipments(mappedShipments);
    } catch (error: any) {
      toast({
        title: 'Error fetching shipments',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const addTimelineEvent = async (
    shipmentId: string,
    eventType: string,
    description: string,
    oldStatus?: string,
    newStatus?: string
  ) => {
    if (!user) return;
    
    try {
      await supabase.from('shipment_timeline').insert({
        shipment_id: shipmentId,
        user_id: user.id,
        event_type: eventType,
        description,
        old_status: oldStatus || null,
        new_status: newStatus || null,
      });
    } catch (error) {
      console.error('Error adding timeline event:', error);
    }
  };

  const sendStatusNotification = async (
    shipmentId: string,
    oldStatus: string,
    newStatus: string,
    containerNo: string,
    consignee: string
  ) => {
    if (!user) return;

    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          user_id: user.id,
          shipment_id: shipmentId,
          old_status: oldStatus,
          new_status: newStatus,
          container_no: containerNo,
          consignee,
        },
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const addShipment = async (data: ShipmentFormData) => {
    if (!user) return;

    try {
      const { data: inserted, error } = await supabase.from('shipments').insert({
        user_id: user.id,
        date: data.date,
        bl_date: data.blDate || null,
        consignee: data.consignee,
        shipper: data.shipper,
        commodity: data.commodity,
        container_no: data.containerNo,
        container_size: data.containerSize === '40' ? "40'" : "20'",
        shipping_line: data.shippingLine,
        type: data.type,
        forwarder: data.forwarder,
        cha: data.cha,
        no_of_packets: data.noOfPackets,
        weight: data.weight,
        cbm: data.cbm,
        status: data.status.toLowerCase(),
        be_no: data.beNo,
        be_date: data.beDate || null,
        current_status: data.currentStatus,
        iec_no: data.iecNo,
        is_airway: data.isAirway,
      }).select().single();

      if (error) throw error;

      if (inserted) {
        await addTimelineEvent(
          inserted.id,
          'created',
          `Shipment created with container ${data.containerNo}`
        );
      }

      toast({
        title: 'Shipment Added',
        description: `Container ${data.containerNo} has been added successfully.`,
      });

      await fetchShipments();
    } catch (error: any) {
      toast({
        title: 'Error adding shipment',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateShipment = async (id: string, data: ShipmentFormData) => {
    if (!user) return;
    
    const oldShipment = shipments.find(s => s.id === id);
    const oldStatus = oldShipment?.status.toLowerCase() || 'pending';
    const newStatus = data.status.toLowerCase();

    try {
      const { error } = await supabase
        .from('shipments')
        .update({
          date: data.date,
          bl_date: data.blDate || null,
          consignee: data.consignee,
          shipper: data.shipper,
          commodity: data.commodity,
          container_no: data.containerNo,
          container_size: data.containerSize === '40' ? "40'" : "20'",
          shipping_line: data.shippingLine,
          type: data.type,
          forwarder: data.forwarder,
          cha: data.cha,
          no_of_packets: data.noOfPackets,
          weight: data.weight,
          cbm: data.cbm,
          status: newStatus,
          be_no: data.beNo,
          be_date: data.beDate || null,
          current_status: data.currentStatus,
          iec_no: data.iecNo,
          is_airway: data.isAirway,
        })
        .eq('id', id);

      if (error) throw error;

      if (oldStatus !== newStatus) {
        await addTimelineEvent(
          id,
          'status_change',
          `Status changed from ${oldStatus} to ${newStatus}`,
          oldStatus,
          newStatus
        );

        await sendStatusNotification(
          id,
          oldStatus,
          newStatus,
          data.containerNo,
          data.consignee
        );
      } else {
        await addTimelineEvent(
          id,
          'edit',
          `Shipment details updated`
        );
      }

      toast({
        title: 'Shipment Updated',
        description: `Container ${data.containerNo} has been updated successfully.`,
      });

      await fetchShipments();
    } catch (error: any) {
      toast({
        title: 'Error updating shipment',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteShipment = async (id: string) => {
    const shipment = shipments.find(s => s.id === id);
    
    try {
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Shipment Deleted',
        description: `Container ${shipment?.containerNo} has been removed.`,
        variant: 'destructive',
      });

      await fetchShipments();
    } catch (error: any) {
      toast({
        title: 'Error deleting shipment',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    shipments,
    loading,
    addShipment,
    updateShipment,
    deleteShipment,
    refetch: fetchShipments,
  };
};
```

#### src/hooks/useShipmentTimeline.tsx
```tsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TimelineEvent {
  id: string;
  shipment_id: string;
  event_type: string;
  description: string;
  old_status: string | null;
  new_status: string | null;
  created_at: string;
}

export const useShipmentTimeline = (shipmentId: string | null) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchTimeline = useCallback(async () => {
    if (!shipmentId || !user) {
      setEvents([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipment_timeline')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setLoading(false);
    }
  }, [shipmentId, user]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  useEffect(() => {
    if (!shipmentId) return;

    const channel = supabase
      .channel(`timeline-${shipmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shipment_timeline',
          filter: `shipment_id=eq.${shipmentId}`,
        },
        (payload) => {
          setEvents((prev) => [payload.new as TimelineEvent, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shipmentId]);

  const addTimelineEvent = async (
    event_type: string,
    description: string,
    old_status?: string,
    new_status?: string
  ) => {
    if (!shipmentId || !user) return;

    try {
      const { error } = await supabase.from('shipment_timeline').insert({
        shipment_id: shipmentId,
        user_id: user.id,
        event_type,
        description,
        old_status: old_status || null,
        new_status: new_status || null,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding timeline event:', error);
    }
  };

  return { events, loading, addTimelineEvent, refetch: fetchTimeline };
};
```

#### src/hooks/useDocuments.tsx
```tsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ShipmentDocument {
  id: string;
  shipment_id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

export const useDocuments = (shipmentId: string | null) => {
  const [documents, setDocuments] = useState<ShipmentDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    if (!shipmentId || !user) {
      setDocuments([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [shipmentId, user, toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = async (file: File) => {
    if (!shipmentId || !user) return null;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${shipmentId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('shipment-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data, error: insertError } = await supabase
        .from('shipment_documents')
        .insert({
          shipment_id: shipmentId,
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: 'Document uploaded',
        description: `${file.name} has been uploaded successfully.`,
      });

      await fetchDocuments();
      return data;
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string, filePath: string) => {
    if (!user) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('shipment-documents')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      const { error: dbError } = await supabase
        .from('shipment_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      toast({
        title: 'Document deleted',
        description: 'The document has been removed.',
        variant: 'destructive',
      });

      await fetchDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getDownloadUrl = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('shipment-documents')
      .createSignedUrl(filePath, 3600);

    return data?.signedUrl || null;
  };

  return {
    documents,
    loading,
    uploading,
    uploadDocument,
    deleteDocument,
    getDownloadUrl,
    refetch: fetchDocuments,
  };
};
```

---

*The complete source code continues in the actual project files. This export includes all essential files for a production-ready deployment. shadcn/ui components (in src/components/ui/) should be generated using the shadcn CLI.*

---

## Backend Code

### Edge Functions

#### supabase/functions/send-notification/index.ts
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  user_id: string;
  shipment_id: string;
  old_status: string;
  new_status: string;
  container_no: string;
  consignee: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { user_id, shipment_id, old_status, new_status, container_no, consignee }: NotificationRequest = await req.json();

    console.log("Processing notification for user:", user_id, "shipment:", shipment_id);

    const { data: prefs, error: prefsError } = await supabase
      .from("notification_preferences")
      .select("email_on_status_change")
      .eq("user_id", user_id)
      .maybeSingle();

    if (prefsError) {
      console.error("Error fetching preferences:", prefsError);
      throw prefsError;
    }

    if (prefs && !prefs.email_on_status_change) {
      console.log("User has disabled status change notifications");
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("user_id", user_id)
      .maybeSingle();

    if (profileError || !profile?.email) {
      console.error("Error fetching profile or no email:", profileError);
      return new Response(JSON.stringify({ success: false, error: "No email found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Sending email to:", profile.email);

    const statusColor = new_status === "done" ? "#22c55e" : "#f59e0b";
    const statusText = new_status === "done" ? "COMPLETED" : "PENDING";

    const emailResponse = await resend.emails.send({
      from: "Freight Link Logistics <onboarding@resend.dev>",
      to: [profile.email],
      subject: `Shipment Status Update: ${container_no}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">📦 Shipment Status Update</h1>
            </div>
            <div style="padding: 30px;">
              <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
                Your shipment status has been updated:
              </p>
              
              <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Container No:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${container_no}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Consignee:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${consignee}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Previous Status:</td>
                    <td style="padding: 8px 0; color: #6b7280; text-align: right; text-transform: uppercase;">${old_status}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">New Status:</td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                        ${statusText}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                Log in to Freight Link Logistics to view full details.
              </p>
            </div>
            <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Freight Link Logistics - Your Trusted Logistics Partner
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

---

## Notes

1. **shadcn/ui Components**: The `src/components/ui/` directory contains shadcn/ui components. These should be generated using the shadcn CLI (`npx shadcn-ui@latest add <component-name>`).

2. **Database Types**: The `src/integrations/supabase/types.ts` file should be auto-generated from your Supabase schema using `supabase gen types typescript`.

3. **Environment Variables**: Never commit `.env` files with real credentials. Use `.env.example` as a template.

4. **Supabase Setup**: Enable Row Level Security (RLS) on all tables and configure authentication in your Supabase dashboard.

5. **Email Notifications**: The send-notification edge function requires a valid Resend API key for email delivery.
