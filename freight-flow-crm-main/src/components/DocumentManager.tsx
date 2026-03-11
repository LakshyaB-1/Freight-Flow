import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useDocumentsSupabase, DOCUMENT_TYPES, DocumentType, ShipmentDoc } from '@/hooks/useDocumentsSupabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Loader2,
  File,
  Image,
  FileSpreadsheet,
  Tag,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentManagerProps {
  shipmentId: string;
}

const getFileIcon = (fileType: string | null) => {
  if (!fileType) return File;
  if (fileType.includes('image')) return Image;
  if (fileType.includes('pdf')) return FileText;
  if (fileType.includes('sheet') || fileType.includes('excel')) return FileSpreadsheet;
  return File;
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const docTypeColors: Record<string, string> = {
  bill_of_lading: 'bg-primary/10 text-primary border-primary/20',
  invoice: 'bg-success/10 text-success border-success/20',
  packing_list: 'bg-warning/10 text-warning border-warning/20',
  customs: 'bg-destructive/10 text-destructive border-destructive/20',
  other: 'bg-muted text-muted-foreground border-border',
};

const DocumentManager = ({ shipmentId }: DocumentManagerProps) => {
  const { documents, loading, uploading, uploadDocument, deleteDocument, getDownloadUrl } =
    useDocumentsSupabase(shipmentId);
  const [dragOver, setDragOver] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('other');
  const [filterType, setFilterType] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      await uploadDocument(files[i], selectedType);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDownload = async (doc: ShipmentDoc) => {
    try {
      const url = await getDownloadUrl(doc.filePath);
      if (url) window.open(url, '_blank');
    } catch {
      toast.error('Failed to get download link');
    }
  };

  const filteredDocs = filterType === 'all'
    ? documents
    : documents.filter((d) => d.documentType === filterType);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-muted-foreground">DOCUMENTS</h4>

      {/* Upload Area */}
      <div className="flex items-center gap-2 mb-2">
        <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
        <Select value={selectedType} onValueChange={(v) => setSelectedType(v as DocumentType)}>
          <SelectTrigger className="h-8 text-xs flex-1">
            <SelectValue placeholder="Document type" />
          </SelectTrigger>
          <SelectContent>
            {DOCUMENT_TYPES.map((dt) => (
              <SelectItem key={dt.key} value={dt.key} className="text-xs">
                {dt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">Drag & drop files here or</p>
            <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              Browse Files
            </Button>
          </>
        )}
      </div>

      <Separator />

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Filter:</span>
        <div className="flex flex-wrap gap-1">
          <Badge
            variant={filterType === 'all' ? 'default' : 'outline'}
            className="cursor-pointer text-[10px]"
            onClick={() => setFilterType('all')}
          >
            All ({documents.length})
          </Badge>
          {DOCUMENT_TYPES.map((dt) => {
            const count = documents.filter((d) => d.documentType === dt.key).length;
            if (count === 0) return null;
            return (
              <Badge
                key={dt.key}
                variant={filterType === dt.key ? 'default' : 'outline'}
                className="cursor-pointer text-[10px]"
                onClick={() => setFilterType(dt.key)}
              >
                {dt.label} ({count})
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Document List */}
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : filteredDocs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No documents {filterType !== 'all' ? 'of this type' : 'uploaded yet'}
        </p>
      ) : (
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {filteredDocs.map((doc) => {
              const FileIcon = getFileIcon(doc.fileType);
              const typeLabel = DOCUMENT_TYPES.find((dt) => dt.key === doc.documentType)?.label || 'Other';
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <FileIcon className="h-8 w-8 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.fileName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${docTypeColors[doc.documentType] || ''}`}
                      >
                        {typeLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(doc.fileSize)} •{' '}
                        {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteDocument(doc)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default DocumentManager;
