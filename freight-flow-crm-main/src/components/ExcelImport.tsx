import { useRef, useState } from 'react';
import ExcelJS from 'exceljs';
import { ShipmentFormData } from '@/types/shipment';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileSpreadsheet, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface ExcelImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (shipments: ShipmentFormData[]) => void;
}

interface ParsedRow {
  data: ShipmentFormData;
  valid: boolean;
  errors: string[];
}

// Convert ExcelJS worksheet to array of objects (like XLSX.utils.sheet_to_json)
const worksheetToJson = (worksheet: ExcelJS.Worksheet): Record<string, unknown>[] => {
  const rows: Record<string, unknown>[] = [];
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];
  
  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    headers[colNumber] = String(cell.value || '').trim();
  });

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    const obj: Record<string, unknown> = {};
    let hasValue = false;
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const header = headers[colNumber];
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
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file) return;
    
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      toast.error('Please upload a valid Excel file (.xlsx, .xls)');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        
        // Try all sheets to find one with valid shipment data
        let bestJsonData: Record<string, unknown>[] = [];
        
        workbook.eachSheet((worksheet) => {
          const jsonData = worksheetToJson(worksheet);
          
          // Check if this sheet has shipment-like columns
          if (jsonData.length > 0) {
            const firstRow = jsonData[0];
            const keys = Object.keys(firstRow).map(k => k.toLowerCase());
            const hasShipmentColumns = keys.some(k => 
              k.includes('consignee') || k.includes('shipper') || k.includes('commodity') ||
              k.includes('container') || k.includes('cntr') || k.includes('year') || k.includes('month')
            );
            
            if (hasShipmentColumns && jsonData.length > bestJsonData.length) {
              bestJsonData = jsonData;
            }
          }
        });

        if (bestJsonData.length === 0) {
          toast.error('No shipment data found in the Excel file');
          return;
        }

        const parsed = bestJsonData.map(parseRow);
        setParsedData(parsed);
      } catch (error) {
        toast.error('Failed to parse Excel file');
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const parseExcelDate = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '';

    // ExcelJS returns Date objects for date cells
    if (value instanceof Date) {
      if (isNaN(value.getTime())) return '';
      return value.toISOString().split('T')[0];
    }

    // Excel date serial number
    if (typeof value === 'number') {
      if (!Number.isFinite(value) || value <= 0 || value > 600000) return '';
      
      // Convert Excel serial to JS Date
      // Excel epoch is Jan 1, 1900 (serial 1), with the Lotus 123 bug (serial 60 = Feb 29, 1900)
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + value * 86400000);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return '';

      const parsed = new Date(trimmed);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    }

    return '';
  };

  const normalizeContainerSize = (value: unknown): '20' | '40' => {
    const str = String(value || '40').replace(/['"]/g, '').trim();
    return str === '20' ? '20' : '40';
  };

  const normalizeType = (value: unknown): 'FCL' | 'LCL' => {
    const str = String(value || 'FCL').toUpperCase().trim();
    return str === 'LCL' ? 'LCL' : 'FCL';
  };

  const normalizeStatus = (value: unknown): 'PENDING' | 'DONE' => {
    const str = String(value || 'PENDING').toUpperCase().trim();
    return str === 'DONE' ? 'DONE' : 'PENDING';
  };

  const parseRow = (row: Record<string, unknown>): ParsedRow => {
    const errors: string[] = [];

    const normalizeKey = (key: string): string => {
      return key.toLowerCase().replace(/[_\s.\-()]/g, '');
    };

    const getValue = (keywords: string[]): unknown => {
      const rowKeys = Object.keys(row);

      for (const keyword of keywords) {
        const normalizedKeyword = normalizeKey(keyword);
        const found = rowKeys.find((k) => normalizeKey(k) === normalizedKeyword);
        if (found && row[found] !== undefined && row[found] !== '') return row[found];
      }

      for (const keyword of keywords) {
        const normalizedKeyword = normalizeKey(keyword);
        if (normalizedKeyword.length < 3) continue;

        const found = rowKeys.find((k) => {
          const normalizedK = normalizeKey(k);
          return normalizedK.includes(normalizedKeyword);
        });

        if (found && row[found] !== undefined && row[found] !== '') return row[found];
      }

      return undefined;
    };

    const constructDateFromYearMonth = (): string => {
      const year = getValue(['year', 'yr']);
      const month = getValue(['month', 'mon', 'months']);
      
      if (year && month) {
        const yearNum = Number(year);
        const monthStr = String(month).toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const monthMap: Record<string, number> = {
          'jan': 1, 'january': 1, '1': 1, '01': 1,
          'feb': 2, 'february': 2, '2': 2, '02': 2,
          'mar': 3, 'march': 3, '3': 3, '03': 3,
          'apr': 4, 'april': 4, '4': 4, '04': 4,
          'may': 5, '5': 5, '05': 5,
          'jun': 6, 'june': 6, '6': 6, '06': 6,
          'jul': 7, 'july': 7, '7': 7, '07': 7,
          'aug': 8, 'august': 8, '8': 8, '08': 8,
          'sep': 9, 'sept': 9, 'september': 9, '9': 9, '09': 9,
          'oct': 10, 'october': 10, '10': 10,
          'nov': 11, 'november': 11, '11': 11,
          'dec': 12, 'december': 12, '12': 12,
        };
        
        const monthMatch = monthStr.match(/^([a-z]+)/);
        const monthKey = monthMatch ? monthMatch[1] : monthStr;
        const monthNum = monthMap[monthKey] || monthMap[monthStr.slice(0, 3)];
        
        if (yearNum && monthNum) {
          return `${yearNum}-${String(monthNum).padStart(2, '0')}-01`;
        }
      }
      return '';
    };

    const extractContainerSize = (containerValue: unknown): '20' | '40' => {
      const str = String(containerValue || '');
      if (str.includes('/40') || str.includes("40'") || str.includes('40ft')) return '40';
      if (str.includes('/20') || str.includes("20'") || str.includes('20ft')) return '20';
      return '40';
    };

    const cleanContainerNo = (containerValue: unknown): string => {
      const str = String(containerValue || '').trim();
      return str.replace(/\s*\/\d{2}'?\s*/g, ' ').replace(/\s+/g, ' ').trim();
    };

    let date = parseExcelDate(getValue(['date', 'shipmentdate', 'shipment_date', 'arrivaldate', 'arrival', 'dt']));
    if (!date) {
      date = constructDateFromYearMonth();
    }
    
    const blDate = parseExcelDate(getValue(['bldate', 'bl_date', 'billoflading', 'bill_of_lading_date', 'bldt', 'b/ldate']));
    const beDate = parseExcelDate(getValue(['bedate', 'be_date', 'billofentrydate', 'bedt', 'billofentrydt']));
    const consignee = String(getValue(['consignee', 'importer', 'buyer', 'receiver', 'consigneename', 'importername', 'cnee']) || '').trim();
    const shipper = String(getValue(['shipper', 'exporter', 'seller', 'sender', 'shippername', 'exportername', 'supplier']) || '').trim();
    const commodity = String(getValue(['commodity', 'goods', 'product', 'description', 'item', 'cargo', 'commoditydesc', 'productname']) || '').trim();
    
    const rawContainer = getValue(['cntr', 'containerno', 'container_no', 'container', 'containerNumber', 'contno', 'cont', 'cntrno']);
    const containerNo = cleanContainerNo(rawContainer);
    
    let containerSize = normalizeContainerSize(getValue(['containersize', 'container_size', 'size', 'contsize', 'cntrsize', 'ft', 'cntrtype']));
    if (containerSize === '40' && rawContainer) {
      containerSize = extractContainerSize(rawContainer);
    }
    
    const fwderShipLine = String(getValue(['fwder/shipingline', 'fwdershippingline', 'fwder', 'shippingline', 'shipping_line', 'carrier', 'line', 'liner', 'vessel', 'shipline']) || '').trim();
    const shippingLine = fwderShipLine;
    
    const cntrType = String(getValue(['cntrtype', 'cntr_type', 'containertype']) || '');
    let type = normalizeType(getValue(['type', 'loadtype', 'load_type', 'shipmenttype', 'mode']));
    if (cntrType.toUpperCase().includes('FCL')) type = 'FCL';
    if (cntrType.toUpperCase().includes('LCL')) type = 'LCL';
    
    const forwarder = String(getValue(['forwarder', 'freightforwarder', 'freight_forwarder', 'ff', 'agent', 'forwardername']) || '').trim();
    const cha = String(getValue(['cha', 'customsagent', 'customs_agent', 'customshouseagent', 'cb', 'customsbroker', 'chaname']) || '').trim();
    
    const noOfPackets = Number(getValue(['nopkg', 'noofpackets', 'packets', 'no_of_packets', 'packages', 'qty', 'quantity', 'pkgs', 'pcs', 'pieces', 'units', 'noofpkgs'])) || 0;
    
    const weight = Number(getValue(['grosswt', 'grosswtkgs', 'weight', 'grossweight', 'gross_weight', 'kg', 'kgs', 'wt', 'netweight', 'totalweight'])) || 0;
    
    const cbm = Number(getValue(['volume', 'cbm', 'cubic_meters', 'cubicmeter', 'vol', 'm3', 'measurement', 'volumewt'])) || 0;
    
    const status = normalizeStatus(getValue(['status', 'shipmentstatus', 'state', 'sts']));
    
    const beNo = String(getValue(['be', 'beno', 'be_no', 'be_number', 'billofentryno', 'benumber', 'billofentry']) || '').trim();
    
    const currentStatus = String(getValue(['curentstatus', 'currentstatus', 'current_status', 'remarks', 'notes', 'comment', 'remark', 'statusremarks', 'detail', 'statausremarks']) || '').trim();
    
    const iecNo = String(getValue(['iecno', 'iec_no', 'iec', 'iecnumber', 'ieccode', 'importercode']) || '').trim();
    
    const mbl = String(getValue(['mbl', 'masterbilloflading', 'masterbl']) || '').trim();
    const hbl = String(getValue(['hbl', 'housebilloflading', 'housebl', 'hawb']) || '').trim();

    if (!date) errors.push('Date is required (or YEAR + MONTH columns)');
    if (!consignee) errors.push('Consignee is required');
    if (!shipper) errors.push('Shipper is required');
    if (!commodity) errors.push('Commodity is required');

    return {
      data: {
        date,
        blDate,
        consignee,
        shipper,
        commodity,
        containerNo,
        containerSize,
        shippingLine,
        type,
        forwarder,
        cha,
        noOfPackets,
        weight,
        cbm,
        status,
        beNo,
        beDate,
        currentStatus,
        iecNo,
        isAirway: false,
      },
      valid: errors.length === 0,
      errors,
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleImport = () => {
    const validShipments = parsedData.filter(row => row.valid).map(row => row.data);
    if (validShipments.length === 0) {
      toast.error('No valid shipments to import');
      return;
    }
    onImport(validShipments);
    handleClose();
    toast.success(`Successfully imported ${validShipments.length} shipment(s)`);
  };

  const handleClose = () => {
    setParsedData([]);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onOpenChange(false);
  };

  const validCount = parsedData.filter(row => row.valid).length;
  const invalidCount = parsedData.filter(row => !row.valid).length;

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
                isDragging 
                  ? 'border-primary bg-primary/5 scale-[1.02]' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
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
              <p className="text-xs text-muted-foreground mb-3">
                or
              </p>
              <Button variant="outline" size="sm" type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                Browse Files
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Supports .xlsx and .xls files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
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
                        <tr
                          key={index}
                          className={`border-t ${row.valid ? '' : 'bg-destructive/5'}`}
                        >
                          <td className="p-2">
                            {row.valid ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-destructive" />
                            )}
                          </td>
                          <td className="p-2 whitespace-nowrap">{row.data.date || '-'}</td>
                          <td className="p-2 max-w-[120px] truncate">{row.data.consignee || '-'}</td>
                          <td className="p-2 max-w-[120px] truncate">{row.data.shipper || '-'}</td>
                          <td className="p-2 max-w-[120px] truncate">{row.data.commodity || '-'}</td>
                          <td className="p-2 whitespace-nowrap">{row.data.containerNo || '-'}</td>
                          <td className="p-2">{row.data.containerSize}'</td>
                          <td className="p-2">{row.data.type}</td>
                          <td className="p-2">{row.data.weight || '-'}</td>
                          <td className="p-2">{row.data.status}</td>
                          <td className="p-2 text-xs text-destructive max-w-[200px]">
                            {row.errors.join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={validCount === 0}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Import {validCount} Shipment{validCount !== 1 ? 's' : ''}
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
