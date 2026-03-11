import { Shipment } from '@/types/shipment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Edit, Trash2, Container, Calendar, Building2, Package, Plane, Ship } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileShipmentCardProps {
  shipment: Shipment;
  onView: (shipment: Shipment) => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: string) => void;
}

const MobileShipmentCard = ({ shipment, onView, onEdit, onDelete }: MobileShipmentCardProps) => {
  const shipmentId = shipment._id || shipment.id || '';
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Container className="h-4 w-4 text-primary shrink-0" />
              <span className="font-mono font-medium text-sm">{shipment.containerNo}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{shipment.date}</span>
              <Badge variant="outline" className="font-mono text-xs ml-1">
                {shipment.containerSize}'
              </Badge>
            </div>
          </div>
          <Badge
            className={cn(
              'shrink-0',
              shipment.status === 'DONE' ? 'status-done' : 'status-pending'
            )}
          >
            {shipment.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-2">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Consignee</p>
              <p className="text-sm font-medium truncate">{shipment.consignee}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Package className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Commodity</p>
              <p className="text-sm truncate">{shipment.commodity}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Badge variant={shipment.type === 'FCL' ? 'default' : 'secondary'} className="text-xs">
            {shipment.type}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            {shipment.isAirway ? <Plane className="h-3 w-3" /> : <Ship className="h-3 w-3" />}
            {shipment.isAirway ? 'Air' : 'Sea'}
          </Badge>
          <span>•</span>
          <span>{shipment.shippingLine}</span>
          {shipment.currentStatus && (
            <>
              <span>•</span>
              <span className="truncate">{shipment.currentStatus}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-1 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => onView(shipment)}
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => onEdit(shipment)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-destructive hover:text-destructive"
            onClick={() => onDelete(shipmentId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileShipmentCard;
