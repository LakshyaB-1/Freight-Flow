import { Shipment } from '@/types/shipment';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Building2,
  Package,
  Container,
  Ship,
  Truck,
  FileText,
  Scale,
  Box,
  Clock,
  Paperclip,
  Milestone,
} from 'lucide-react';
import DocumentManager from './DocumentManager';
import ShipmentTimeline from './ShipmentTimeline';
import MilestoneTimeline from './MilestoneTimeline';

interface ShipmentDetailsProps {
  shipment: Shipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <div className="flex items-start gap-3 py-2">
    <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm break-words">{value || '-'}</p>
    </div>
  </div>
);

const ShipmentDetails = ({ shipment, open, onOpenChange }: ShipmentDetailsProps) => {
  if (!shipment) return null;

  const shipmentId = shipment._id || shipment.id || '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-xl font-semibold">Shipment Details</span>
            <Badge className={cn(
              'font-medium',
              shipment.status === 'DONE' ? 'status-done' : 'status-pending'
            )}>
              {shipment.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
            <TabsTrigger value="milestones" className="gap-2">
              <Milestone className="h-4 w-4" />
              <span className="hidden sm:inline">Milestones</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <Paperclip className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                  <DetailRow icon={Calendar} label="Date" value={shipment.date} />
                  <DetailRow icon={Calendar} label="BL Date" value={shipment.blDate} />
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">PARTIES</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    <DetailRow icon={Building2} label="Consignee (Importer)" value={shipment.consignee} />
                    <DetailRow icon={Building2} label="Shipper (Exporter)" value={shipment.shipper} />
                    <DetailRow icon={Truck} label="Forwarder" value={shipment.forwarder} />
                    <DetailRow icon={FileText} label="CHA" value={shipment.cha} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">CARGO DETAILS</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    <DetailRow icon={Package} label="Commodity" value={shipment.commodity} />
                    <DetailRow icon={Container} label="Container No" value={shipment.containerNo} />
                    <DetailRow icon={Container} label="Container Size" value={`${shipment.containerSize}'`} />
                    <DetailRow icon={Ship} label="Shipping Line" value={shipment.shippingLine} />
                    <DetailRow icon={Box} label="Type" value={shipment.type} />
                    <DetailRow icon={Box} label="No. of Packets" value={shipment.noOfPackets} />
                    <DetailRow icon={Scale} label="Weight (kg)" value={shipment.weight} />
                    <DetailRow icon={Box} label="CBM" value={shipment.cbm} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">DOCUMENTATION</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    <DetailRow icon={FileText} label="BE No" value={shipment.beNo} />
                    <DetailRow icon={Calendar} label="BE Date" value={shipment.beDate} />
                    <DetailRow icon={FileText} label="IEC No" value={shipment.iecNo} />
                    <DetailRow icon={FileText} label="Current Status" value={shipment.currentStatus} />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="milestones" className="mt-4">
            <MilestoneTimeline shipmentId={shipmentId} />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-4">
            <DocumentManager shipmentId={shipmentId} />
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-4">
            <ShipmentTimeline shipmentId={shipmentId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentDetails;
