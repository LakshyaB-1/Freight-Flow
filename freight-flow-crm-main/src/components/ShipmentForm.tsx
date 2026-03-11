import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shipment, ShipmentFormData } from '@/types/shipment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const shipmentSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  blDate: z.string().min(1, 'BL Date is required'),
  consignee: z.string().min(1, 'Consignee is required').max(200),
  shipper: z.string().min(1, 'Shipper is required').max(200),
  commodity: z.string().min(1, 'Commodity is required').max(200),
  containerNo: z.string().min(1, 'Container No is required').max(20),
  containerSize: z.enum(['20', '40']),
  shippingLine: z.string().min(1, 'Shipping Line is required').max(100),
  type: z.enum(['FCL', 'LCL']),
  forwarder: z.string().min(1, 'Forwarder is required').max(200),
  cha: z.string().min(1, 'CHA is required').max(200),
  noOfPackets: z.coerce.number().min(1, 'Must be at least 1'),
  weight: z.coerce.number().min(0.01, 'Must be greater than 0'),
  cbm: z.coerce.number().min(0.01, 'Must be greater than 0'),
  status: z.enum(['PENDING', 'DONE']),
  beNo: z.string().max(50).optional().or(z.literal('')),
  beDate: z.string().optional().or(z.literal('')),
  currentStatus: z.string().min(1, 'Current Status is required').max(100),
  iecNo: z.string().min(1, 'IEC No is required').max(20),
  isAirway: z.boolean(),
});

interface ShipmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ShipmentFormData) => void;
  initialData?: Shipment;
}

const ShipmentForm = ({ open, onOpenChange, onSubmit, initialData }: ShipmentFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      blDate: '',
      consignee: '',
      shipper: '',
      commodity: '',
      containerNo: '',
      containerSize: '40',
      shippingLine: '',
      type: 'FCL',
      forwarder: '',
      cha: '',
      noOfPackets: 0,
      weight: 0,
      cbm: 0,
      status: 'PENDING',
      beNo: '',
      beDate: '',
      currentStatus: '',
      iecNo: '',
      isAirway: false,
    },
  });

  const containerSize = watch('containerSize');
  const type = watch('type');
  const status = watch('status');
  const isAirway = watch('isAirway');

  const handleFormSubmit = (data: ShipmentFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? 'Edit Shipment' : 'Add New Shipment'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="blDate">BL Date *</Label>
                <Input id="blDate" type="date" {...register('blDate')} />
                {errors.blDate && <p className="text-xs text-destructive">{errors.blDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="iecNo">IEC No *</Label>
                <Input id="iecNo" placeholder="IEC0123456789" {...register('iecNo')} />
                {errors.iecNo && <p className="text-xs text-destructive">{errors.iecNo.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consignee">Consignee (Importer) *</Label>
                <Input id="consignee" placeholder="ABC Imports Ltd." {...register('consignee')} />
                {errors.consignee && <p className="text-xs text-destructive">{errors.consignee.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipper">Shipper (Exporter) *</Label>
                <Input id="shipper" placeholder="XYZ Exports Co." {...register('shipper')} />
                {errors.shipper && <p className="text-xs text-destructive">{errors.shipper.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commodity">Commodity *</Label>
              <Input id="commodity" placeholder="Electronic Components" {...register('commodity')} />
              {errors.commodity && <p className="text-xs text-destructive">{errors.commodity.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="containerNo">Container No *</Label>
                <Input id="containerNo" placeholder="MSKU1234567" {...register('containerNo')} />
                {errors.containerNo && <p className="text-xs text-destructive">{errors.containerNo.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="containerSize">Container Size *</Label>
                <Select value={containerSize} onValueChange={(v) => setValue('containerSize', v as '20' | '40')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20'</SelectItem>
                    <SelectItem value="40">40'</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={type} onValueChange={(v) => setValue('type', v as 'FCL' | 'LCL')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FCL">FCL (Full Container Load)</SelectItem>
                    <SelectItem value="LCL">LCL (Less Container Load)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shippingLine">Shipping Line *</Label>
                <Input id="shippingLine" placeholder="Maersk" {...register('shippingLine')} />
                {errors.shippingLine && <p className="text-xs text-destructive">{errors.shippingLine.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="forwarder">Forwarder *</Label>
                <Input id="forwarder" placeholder="Global Freight Solutions" {...register('forwarder')} />
                {errors.forwarder && <p className="text-xs text-destructive">{errors.forwarder.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cha">CHA (Customs House Agent) *</Label>
              <Input id="cha" placeholder="Swift Customs Agency" {...register('cha')} />
              {errors.cha && <p className="text-xs text-destructive">{errors.cha.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="noOfPackets">No. of Packets *</Label>
                <Input id="noOfPackets" type="number" min="1" {...register('noOfPackets')} />
                {errors.noOfPackets && <p className="text-xs text-destructive">{errors.noOfPackets.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input id="weight" type="number" step="0.01" min="0" {...register('weight')} />
                {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cbm">CBM *</Label>
                <Input id="cbm" type="number" step="0.01" min="0" {...register('cbm')} />
                {errors.cbm && <p className="text-xs text-destructive">{errors.cbm.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beNo">BE No</Label>
                <Input id="beNo" placeholder="BE2024001234" {...register('beNo')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beDate">BE Date</Label>
                <Input id="beDate" type="date" {...register('beDate')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={status} onValueChange={(v) => setValue('status', v as 'PENDING' | 'DONE')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentStatus">Current Status *</Label>
              <Input id="currentStatus" placeholder="Customs Clearance" {...register('currentStatus')} />
              {errors.currentStatus && <p className="text-xs text-destructive">{errors.currentStatus.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAirway"
                checked={isAirway}
                onCheckedChange={(checked) => setValue('isAirway', checked === true)}
              />
              <Label htmlFor="isAirway" className="cursor-pointer">Air Freight Shipment</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? 'Update Shipment' : 'Add Shipment'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentForm;
