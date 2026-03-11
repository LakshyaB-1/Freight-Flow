import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Package, UserCircle, ListTodo, Sparkles, BarChart3, Users,
  Plus, Search, FileSpreadsheet, Bot, ArrowRight, ArrowLeft, X, Rocket
} from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  tip?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Welcome to Your CRM Dashboard!',
    description: 'This is your central hub for managing shipments, customers, tasks, and reports. Let\'s walk through each feature so you can get started quickly.',
    icon: <Rocket className="h-8 w-8" />,
    tip: 'You can replay this tutorial anytime from the dashboard.',
  },
  {
    title: 'Shipments Tab',
    description: 'View, create, edit, and delete shipments. Each shipment tracks details like consignee, shipper, container number, commodity, and status (Pending or Done).',
    icon: <Package className="h-8 w-8" />,
    tip: 'Use the status filter tabs (All / Pending / Completed) to quickly find shipments.',
  },
  {
    title: 'Adding Shipments',
    description: 'Click the "Add Shipment" button to create one manually, or import multiple shipments at once from an Excel file using the "Import from Excel" option.',
    icon: <Plus className="h-8 w-8" />,
    tip: 'Excel import supports bulk uploads — great for migrating existing data.',
  },
  {
    title: 'Search & Filter',
    description: 'Use the search bar at the top to find shipments by consignee, shipper, container number, commodity, or BE number. Results update instantly as you type.',
    icon: <Search className="h-8 w-8" />,
  },
  {
    title: 'Shipment Details & Status',
    description: 'Click on any shipment to view its full details, milestones, documents, and timeline. To change status from Pending to Done, click the edit button and update the Status field.',
    icon: <FileSpreadsheet className="h-8 w-8" />,
    tip: 'Setting the "Current Status" to a logistics stage (e.g. Delivered) auto-updates milestones.',
  },
  {
    title: 'Customers Tab',
    description: 'Manage your contacts — importers, exporters, and agents. Store their company, email, phone, address, and notes for quick reference when creating shipments.',
    icon: <UserCircle className="h-8 w-8" />,
  },
  {
    title: 'Tasks Tab',
    description: 'Create and track tasks linked to shipments or customers. Set priorities (Low, Medium, High, Urgent), due dates, and mark them as completed when done.',
    icon: <ListTodo className="h-8 w-8" />,
    tip: 'Tasks help you stay on top of follow-ups and deadlines.',
  },
  {
    title: 'Insights Tab',
    description: 'Get AI-powered insights about your shipment data — trends, patterns, and suggestions to optimize your operations.',
    icon: <Sparkles className="h-8 w-8" />,
  },
  {
    title: 'Reports Tab',
    description: 'View detailed analytics and charts about your shipment volumes, status breakdowns, top commodities, and more. Export data when needed.',
    icon: <BarChart3 className="h-8 w-8" />,
  },
  {
    title: 'AI Assistant',
    description: 'The floating chat button in the bottom-right corner opens your AI assistant. Ask questions about your shipments, get summaries, or request help with any feature.',
    icon: <Bot className="h-8 w-8" />,
    tip: 'Try asking: "How many pending shipments do I have?"',
  },
  {
    title: 'You\'re All Set!',
    description: 'Start by adding your first shipment or importing your existing data. The more data you add, the more powerful the insights and reports become.',
    icon: <Rocket className="h-8 w-8" />,
    tip: 'Need help? The AI assistant is always available in the bottom-right corner.',
  },
];

const STORAGE_KEY = 'crm_onboarding_completed';

interface OnboardingTutorialProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

const OnboardingTutorial = ({ forceShow = false, onComplete }: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
      setCurrentStep(0);
      return;
    }
    // Only auto-show for brand new signups
    const justSignedUp = sessionStorage.getItem('crm_just_signed_up');
    if (justSignedUp) {
      sessionStorage.removeItem('crm_just_signed_up');
      setIsVisible(true);
    }
  }, [forceShow]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirst = currentStep === 0;
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={handleSkip} />

      {/* Card */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Skip tutorial"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 pt-6">
          {/* Step counter */}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </span>

          {/* Icon & Title */}
          <div className="flex items-center gap-3 mt-4 mb-3">
            <div className="flex-shrink-0 p-2.5 rounded-lg bg-primary/10 text-primary">
              {step.icon}
            </div>
            <h2 className="text-xl font-bold text-card-foreground leading-tight">
              {step.title}
            </h2>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Tip */}
          {step.tip && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 p-3">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-card-foreground/80">{step.tip}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 pb-6">
          <div className="flex gap-2">
            {!isFirst && (
              <Button variant="ghost" size="sm" onClick={handlePrev} className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            )}
            {isFirst && (
              <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
                Skip Tour
              </Button>
            )}
          </div>
          <Button onClick={handleNext} size="sm" className="gap-1">
            {isLast ? 'Get Started' : 'Next'}
            {!isLast && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 pb-4">
          {TUTORIAL_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-6 bg-primary'
                  : i < currentStep
                  ? 'w-1.5 bg-primary/40'
                  : 'w-1.5 bg-muted'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
