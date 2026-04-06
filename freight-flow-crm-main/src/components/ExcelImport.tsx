import { useRef, useState } from 'react';
import ExcelJS from 'exceljs/dist/exceljs.min.js';
import { ShipmentFormData } from '@/types/shipment';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Upload, FileSpreadsheet, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExcelCell {
  value?: unknown;
}

interface ExcelWorksheet {
  getRow(rowNumber: number): {
    eachCell(options: { includeEmpty: boolean }, callback: (cell: ExcelCell, colNumber: number) => void): void;
  };
  eachRow(
    options: { includeEmpty: boolean },
    callback: (
      row: {
        eachCell(options: { includeEmpty: boolean }, callback: (cell: ExcelCell, colNumber: number) => void): void;
      },
      rowNumber: number,
    ) => void,
  ): void;
}

interface ExcelImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (shipments: ShipmentFormData[], onProgress?: (done: number, total: number) => void) => Promise<void>;
}

interface ParsedRow {
  data: ShipmentFormData;
  valid: boolean;
  errors: string[];
}

const worksheetToJson = (worksheet: ExcelWorksheet): Record<string, unknown>[] => {
  const rows: Record<string, unknown>[] = [];
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];

  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    headers[colNumber - 1] = String(cell.value ?? '').trim();
  });

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const obj: Record<string, unknown> = {};
    let hasValue = false;

    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const header = headers[colNumber - 1];
      if (header) {
        obj[header] = cell.value;
        hasValue = true;
      }
    });

    if (hasValue) rows.push(obj);
  });

  return rows;
};

const ExcelImport = ({ open, onOpenChange, onImport }: ExcelImportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.worksheets[0];
        const jsonData = worksheetToJson(worksheet);

        const parsed = jsonData.map(parseRow);
        setParsedData(parsed);
      } catch (err) {
        console.error('Excel parse error:', err);
        toast.error('Failed to parse Excel file');
      }
    };

    reader.readAsArrayBuffer(file);
    setFileName(file.name);
  };

  const parseRow = (row: Record<string, unknown>): ParsedRow => {
    const data: ShipmentFormData = {
      date: String(row['date'] || ''),
      blDate: String(row['bldate'] || ''),
      consignee: String(row['consignee'] || ''),
      shipper: String(row['shipper'] || ''),
      commodity: String(row['commodity'] || ''),
      containerNo: String(row['container'] || ''),
      containerSize: '40',
      shippingLine: String(row['shippingline'] || ''),
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
    };

    return {
      data,
      valid: !!data.consignee && !!data.shipper,
      errors: [],
    };
  };

  const handleImport = async () => {
    const validShipments = parsedData.filter((r) => r.valid).map((r) => r.data);

    if (!validShipments.length) {
      toast.error('No valid shipments to import');
      return;
    }

    setImporting(true);
    setProgress({ done: 0, total: validShipments.length });

    try {
      await onImport(validShipments, (done, total) => {
        setProgress({ done, total });
      });
      toast.success(`Successfully imported ${validShipments.length} shipment${validShipments.length !== 1 ? 's' : ''}`);
      handleClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to import shipments';
      console.error('Import error:', error);
      toast.error(message);
    } finally {
      setImporting(false);
      setProgress(null);
    }
  };

  const handleClose = () => {
    setParsedData([]);
    setFileName('');
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Excel</DialogTitle>
          <DialogDescription>Upload Excel file</DialogDescription>
        </DialogHeader>

        {!parsedData.length ? (
          <div onClick={() => fileInputRef.current?.click()}>
            <Upload />
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
              }}
              hidden
            />
          </div>
        ) : (
          <>
            <p>{fileName}</p>

            <Button onClick={handleImport} disabled={importing}>
              {importing ? <Loader2 className="animate-spin" /> : 'Import'}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImport;