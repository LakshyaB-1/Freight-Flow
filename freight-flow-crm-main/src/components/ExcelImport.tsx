import { useRef, useState, type DragEvent } from 'react';
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
  onImport: (shipments: ShipmentFormData[], onProgress?: (done: number, total: number) => void) => Promise<{ inserted: number; errors: { batch: number; row?: number; message: string }[] }>;
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
  const [isDragging, setIsDragging] = useState(false);
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
        console.error('Failed to parse Excel file:', err);
        toast.error('Failed to parse Excel file');
      }
    };

    reader.readAsArrayBuffer(file);
    setFileName(file.name);
  };

  const normalizeKey = (key: string): string => key.toLowerCase().replace(/[_\s.\-()]/g, '');

  const getValue = (row: Record<string, unknown>, candidates: string[]): unknown => {
    const keys = Object.keys(row);
    for (const candidate of candidates) {
      const normalizedCandidate = normalizeKey(candidate);
      const match = keys.find((key) => normalizeKey(key) === normalizedCandidate);
      if (match && row[match] !== undefined && row[match] !== '') {
        return row[match];
      }
    }

    for (const key of keys) {
      const normalizedKey = normalizeKey(key);
      if (candidates.some((candidate) => normalizedKey.includes(normalizeKey(candidate)))) {
        const value = row[key];
        if (value !== undefined && value !== '') {
          return value;
        }
      }
    }

    return undefined;
  };

  const parseRow = (row: Record<string, unknown>): ParsedRow => {
    const data: ShipmentFormData = {
      date: String(getValue(row, ['date', 'shipmentdate', 'shipment_date', 'arrivaldate', 'arrival', 'dt']) || ''),
      blDate: String(getValue(row, ['bldate', 'bl_date', 'billoflading', 'bill_of_lading_date', 'bldt', 'b/ldate']) || ''),
      consignee: String(getValue(row, ['consignee', 'importer', 'buyer', 'receiver', 'consigneename', 'importername', 'cnee']) || ''),
      shipper: String(getValue(row, ['shipper', 'exporter', 'seller', 'sender', 'shippername', 'exportername', 'supplier']) || ''),
      commodity: String(getValue(row, ['commodity', 'goods', 'product', 'description', 'item', 'cargo', 'commoditydesc', 'productname']) || ''),
      containerNo: String(getValue(row, ['container', 'container_no', 'containerno', 'cntr', 'container number', 'contno', 'cont']) || ''),
      containerSize: '40',
      shippingLine: String(getValue(row, ['shippingline', 'shipping_line', 'carrier', 'line', 'liner', 'vessel', 'shipline', 'fwder/shipingline', 'forwarder line']) || ''),
      type: 'FCL',
      forwarder: String(getValue(row, ['forwarder', 'freightforwarder', 'freight_forwarder', 'ff', 'agent', 'forwardername']) || ''),
      cha: String(getValue(row, ['cha', 'customsagent', 'customs_agent', 'customshouseagent', 'cb', 'customsbroker', 'chaname']) || ''),
      noOfPackets: Number(getValue(row, ['nopkg', 'noofpackets', 'packets', 'no_of_packets', 'packages', 'qty', 'quantity', 'pkgs', 'pcs', 'pieces', 'units', 'noofpkgs']) || 0) || 0,
      weight: Number(getValue(row, ['grosswt', 'grosswtkgs', 'weight', 'grossweight', 'gross_weight', 'kg', 'kgs', 'wt', 'netweight', 'totalweight']) || 0) || 0,
      cbm: Number(getValue(row, ['volume', 'cbm', 'cubic_meters', 'cubicmeter', 'vol', 'm3', 'measurement', 'volumewt']) || 0) || 0,
      status: 'PENDING',
      beNo: String(getValue(row, ['be', 'beno', 'be_no', 'be_number', 'billofentryno', 'benumber', 'billofentry']) || ''),
      beDate: String(getValue(row, ['bedate', 'be_date', 'billofentrydate', 'bedt', 'billofentrydt']) || ''),
      currentStatus: String(getValue(row, ['currentstatus', 'current_status', 'remarks', 'notes', 'comment', 'remark']) || ''),
      iecNo: String(getValue(row, ['iecno', 'iec_no', 'iec', 'iecnumber', 'ieccode', 'importercode']) || ''),
      isAirway: false,
    };

    const errors: string[] = [];
    if (!data.consignee) errors.push('Consignee missing');
    if (!data.shipper) errors.push('Shipper missing');
    if (!data.commodity) errors.push('Commodity missing');
    if (!data.date) errors.push('Date missing');

    return {
      data,
      valid: errors.length === 0,
      errors,
    };
  };

  const handleImport = async () => {
    const validShipments = parsedData.filter((row) => row.valid).map((row) => row.data);

    if (!validShipments.length) {
      toast.error('No valid shipments to import');
      return;
    }

    setImporting(true);
    setProgress({ done: 0, total: validShipments.length });

    try {
      const result = await onImport(validShipments, (done, total) => {
        setProgress({ done, total });
      });

      if (!result || result.inserted === 0) {
        toast.error('No shipments were imported. Please check your file and try again.');
      } else {
        toast.success(`Successfully imported ${result.inserted} shipment${result.inserted !== 1 ? 's' : ''}`);
        handleClose();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to import shipments';
      console.error('Failed to import shipments:', error);
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
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const validCount = parsedData.filter((row) => row.valid).length;
  const invalidCount = parsedData.length - validCount;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import from Excel
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx, .xls) with shipment data. Make sure your columns match the expected format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
          {!parsedData.length ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className={`h-10 w-10 mx-auto mb-4 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className={`text-sm mb-2 transition-colors ${isDragging ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {isDragging ? 'Drop your file here' : 'Drag and drop your Excel file here'}
              </p>
              <p className="text-xs text-muted-foreground mb-3">or</p>
              <Button variant="outline" size="sm" type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                Browse Files
              </Button>
              <p className="text-xs text-muted-foreground mt-3">Supports .xlsx and .xls files</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
                className="hidden"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="text-sm font-medium">{fileName}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    <Check className="h-4 w-4" /> {validCount} valid
                  </span>
                  {invalidCount > 0 && (
                    <span className="text-destructive flex items-center gap-1">
                      <X className="h-4 w-4" /> {invalidCount} invalid
                    </span>
                  )}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead className="bg-muted sticky top-0 z-10">
                      <tr>
                        <th className="p-2 text-left w-16 whitespace-nowrap">Status</th>
                        <th className="p-2 text-left whitespace-nowrap">Date</th>
                        <th className="p-2 text-left whitespace-nowrap">Consignee</th>
                        <th className="p-2 text-left whitespace-nowrap">Shipper</th>
                        <th className="p-2 text-left whitespace-nowrap">Commodity</th>
                        <th className="p-2 text-left whitespace-nowrap">Container</th>
                        <th className="p-2 text-left whitespace-nowrap">Size</th>
                        <th className="p-2 text-left whitespace-nowrap">Type</th>
                        <th className="p-2 text-left whitespace-nowrap">Weight</th>
                        <th className="p-2 text-left whitespace-nowrap">Status</th>
                        <th className="p-2 text-left whitespace-nowrap">Errors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.map((row, index) => (
                        <tr key={index} className={`border-t ${row.valid ? '' : 'bg-destructive/5'}`}>
                          <td className="p-2">{row.valid ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-destructive" />}</td>
                          <td className="p-2 whitespace-nowrap">{row.data.date || '-'}</td>
                          <td className="p-2 max-w-[120px] truncate">{row.data.consignee || '-'}</td>
                          <td className="p-2 max-w-[120px] truncate">{row.data.shipper || '-'}</td>
                          <td className="p-2 max-w-[120px] truncate">{row.data.commodity || '-'}</td>
                          <td className="p-2 whitespace-nowrap">{row.data.containerNo || '-'}</td>
                          <td className="p-2">{row.data.containerSize || '-'}</td>
                          <td className="p-2">{row.data.type}</td>
                          <td className="p-2">{row.data.weight || '-'}</td>
                          <td className="p-2">{row.data.status}</td>
                          <td className="p-2 text-xs text-destructive max-w-[200px]">{row.errors.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {importing && progress && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading {progress.done}/{progress.total} shipments…</span>
                    <span className="font-medium">{Math.round((progress.done / progress.total) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={handleClose} disabled={importing}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={validCount === 0 || importing} className="gap-2">
                  {importing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Importing…</>
                  ) : (
                    <><Check className="h-4 w-4" />Import {validCount} Shipment{validCount !== 1 ? 's' : ''}</>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImport;
