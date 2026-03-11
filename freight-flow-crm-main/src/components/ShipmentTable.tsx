import { Shipment } from '@/types/shipment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Edit, Trash2, Container, Plane, Ship } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShipmentTableProps {
  shipments: Shipment[];
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: string) => void;
  onView: (shipment: Shipment) => void;
}

const ShipmentTable = ({ shipments, onEdit, onDelete, onView }: ShipmentTableProps) => {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">BL Date</TableHead>
              <TableHead className="font-semibold">Consignee</TableHead>
              <TableHead className="font-semibold">Shipper</TableHead>
              <TableHead className="font-semibold">Commodity</TableHead>
              <TableHead className="font-semibold">Container</TableHead>
              <TableHead className="font-semibold">Size</TableHead>
              <TableHead className="font-semibold">Line</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Mode</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Current Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment, index) => {
              const shipmentId = shipment._id || shipment.id;
              return (
              <TableRow 
                key={shipmentId}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-medium">{shipment.date}</TableCell>
                <TableCell>{shipment.blDate}</TableCell>
                <TableCell className="max-w-[150px] truncate" title={shipment.consignee}>
                  {shipment.consignee}
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={shipment.shipper}>
                  {shipment.shipper}
                </TableCell>
                <TableCell className="max-w-[120px] truncate" title={shipment.commodity}>
                  {shipment.commodity}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Container className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-xs">{shipment.containerNo}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {shipment.containerSize}'
                  </Badge>
                </TableCell>
                <TableCell>{shipment.shippingLine}</TableCell>
                <TableCell>
                  <Badge variant={shipment.type === 'FCL' ? 'default' : 'secondary'}>
                    {shipment.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    {shipment.isAirway ? (
                      <>
                        <Plane className="h-3 w-3" />
                        Air
                      </>
                    ) : (
                      <>
                        <Ship className="h-3 w-3" />
                        Sea
                      </>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    'font-medium',
                    shipment.status === 'DONE' ? 'status-done' : 'status-pending'
                  )}>
                    {shipment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {shipment.currentStatus}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(shipment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(shipment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => shipmentId && onDelete(shipmentId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {shipments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Container className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No shipments found</p>
          <p className="text-sm">Add a new shipment to get started</p>
        </div>
      )}
    </div>
  );
};

export default ShipmentTable;
