import { useState } from 'react';
import { useMilestones, MILESTONE_TYPES, Milestone, MilestoneStatus } from '@/hooks/useMilestones';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BookCheck,
  Truck,
  FileCheck,
  PlaneTakeoff,
  PlaneLanding,
  ClipboardCheck,
  PackageCheck,
  Pencil,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MilestoneTimelineProps {
  shipmentId: string;
}

const milestoneIcons: Record<string, React.ElementType> = {
  booking_confirmed: BookCheck,
  cargo_picked_up: Truck,
  export_customs_cleared: FileCheck,
  departed: PlaneTakeoff,
  arrived: PlaneLanding,
  import_customs_cleared: ClipboardCheck,
  delivered: PackageCheck,
};

const statusConfig: Record<MilestoneStatus, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-muted-foreground', label: 'Pending' },
  completed: { icon: CheckCircle2, color: 'text-success', label: 'Completed' },
  delayed: { icon: AlertTriangle, color: 'text-warning', label: 'Delayed' },
};

const MilestoneEditor = ({
  milestone,
  onSave,
}: {
  milestone: Milestone;
  onSave: (status: MilestoneStatus, date?: string | null, notes?: string | null) => void;
}) => {
  const [status, setStatus] = useState<MilestoneStatus>(milestone.status);
  const [date, setDate] = useState(milestone.milestoneDate ? milestone.milestoneDate.slice(0, 16) : '');
  const [notes, setNotes] = useState(milestone.notes || '');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave(status, date || null, notes || null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-3" align="end">
        <p className="text-sm font-semibold">
          {MILESTONE_TYPES.find((m) => m.key === milestone.milestoneType)?.label}
        </p>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v as MilestoneStatus)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Date & Time</label>
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
            className="text-xs min-h-[60px]"
          />
        </div>
        <Button size="sm" className="w-full" onClick={handleSave}>
          Save
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const MilestoneTimeline = ({ shipmentId }: MilestoneTimelineProps) => {
  const { milestones, loading, updateMilestone } = useMilestones(shipmentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Find last completed index for progress line
  const lastCompletedIdx = milestones.reduce(
    (acc, m, i) => (m.status === 'completed' ? i : acc),
    -1
  );

  return (
    <ScrollArea className="h-[420px]">
      <div className="relative pl-8 space-y-1 py-2">
        {/* Progress line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border" />
        {lastCompletedIdx >= 0 && (
          <div
            className="absolute left-[15px] top-4 w-0.5 bg-success transition-all"
            style={{
              height: `${((lastCompletedIdx + 1) / milestones.length) * 100}%`,
            }}
          />
        )}

        {milestones.map((milestone, index) => {
          const mtInfo = MILESTONE_TYPES.find((m) => m.key === milestone.milestoneType);
          const Icon = milestoneIcons[milestone.milestoneType] || Clock;
          const statusInfo = statusConfig[milestone.status];

          return (
            <div key={milestone.milestoneType} className="relative flex items-start gap-4 py-3">
              {/* Dot */}
              <div
                className={cn(
                  'absolute -left-8 w-[30px] h-[30px] rounded-full flex items-center justify-center border-2 transition-all',
                  milestone.status === 'completed'
                    ? 'bg-success/10 border-success'
                    : milestone.status === 'delayed'
                    ? 'bg-warning/10 border-warning'
                    : 'bg-background border-border'
                )}
              >
                <Icon
                  className={cn(
                    'h-3.5 w-3.5',
                    milestone.status === 'completed'
                      ? 'text-success'
                      : milestone.status === 'delayed'
                      ? 'text-warning'
                      : 'text-muted-foreground'
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 bg-muted/30 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{mtInfo?.label}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] px-1.5 py-0',
                        milestone.status === 'completed' && 'border-success/30 text-success',
                        milestone.status === 'delayed' && 'border-warning/30 text-warning'
                      )}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <MilestoneEditor
                    milestone={milestone}
                    onSave={(status, date, notes) =>
                      updateMilestone(milestone.milestoneType, status, date, notes)
                    }
                  />
                </div>
                {milestone.milestoneDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(milestone.milestoneDate), 'MMM d, yyyy h:mm a')}
                  </p>
                )}
                {milestone.notes && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    {milestone.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MilestoneTimeline;
