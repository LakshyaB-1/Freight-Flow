import { useShipmentTimeline, TimelineEvent } from '@/hooks/useShipmentTimeline';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, CheckCircle2, Package, FileText, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ShipmentTimelineProps {
  shipmentId: string;
}

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'status_change': return CheckCircle2;
    case 'document_upload': return FileText;
    case 'edit': return Edit;
    case 'delete': return Trash2;
    case 'created': return Package;
    default: return Clock;
  }
};

const getEventColor = (eventType: string) => {
  switch (eventType) {
    case 'status_change': return 'text-success';
    case 'document_upload': return 'text-primary';
    case 'edit': return 'text-warning';
    case 'created': return 'text-accent-foreground';
    default: return 'text-muted-foreground';
  }
};

const ShipmentTimeline = ({ shipmentId }: ShipmentTimelineProps) => {
  const { events, loading } = useShipmentTimeline(shipmentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No activity yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="relative pl-6 space-y-4">
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

        {events.map((event, index) => {
          const Icon = getEventIcon(event.eventType);
          const iconColor = getEventColor(event.eventType);

          return (
            <div key={event.id} className="relative flex gap-4">
              <div
                className={cn(
                  'absolute -left-6 w-4 h-4 rounded-full bg-background border-2 border-border flex items-center justify-center',
                  index === 0 && 'border-primary'
                )}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    index === 0 ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              </div>

              <div className="flex-1 bg-muted/30 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', iconColor)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{event.description}</p>
                    {event.oldStatus && event.newStatus && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {event.oldStatus}
                        </Badge>
                        <span className="text-xs text-muted-foreground">→</span>
                        <Badge
                          className={cn(
                            'text-xs',
                            event.newStatus === 'done' || event.newStatus === 'DONE' ? 'status-done' : 'status-pending'
                          )}
                        >
                          {event.newStatus}
                        </Badge>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(event.createdAt), 'MMM d, yyyy h:mm a')} (
                      {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ShipmentTimeline;
