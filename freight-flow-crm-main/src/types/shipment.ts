export interface Shipment {
  _id?: string;
  id?: string;
  date: string;
  blDate: string | null;
  consignee: string;
  shipper: string;
  commodity: string;
  containerNo: string | null;
  containerSize: '20' | '40' | null;
  shippingLine: string | null;
  type: 'FCL' | 'LCL' | null;
  forwarder: string | null;
  cha: string | null;
  noOfPackets: number | null;
  weight: number | null;
  cbm: number | null;
  status: 'PENDING' | 'DONE';
  beNo: string | null;
  beDate: string | null;
  currentStatus: string | null;
  iecNo: string | null;
  isAirway: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ShipmentFormData = Omit<Shipment, '_id' | 'id' | 'createdAt' | 'updatedAt'>;
