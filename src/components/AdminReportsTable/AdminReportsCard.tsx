import {
  Building2,
  Calendar,
  Check,
  FileText,
  Pill,
  User,
  X,
} from 'lucide-react';
import type { FullReportData } from '@/common/FullReportData';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface AdminReportsCardProps {
  data: FullReportData;
  onAccept?: (report: FullReportData) => void;
  onReject?: (report: FullReportData) => void;
}

export const AdminReportsCard = ({
  data,
  onAccept,
  onReject,
}: AdminReportsCardProps) => {
  return (
    <div className="group relative flex flex-col md:flex-row gap-3 p-3 bg-card border border-border rounded-sm hover:border-primary transition-all duration-300 ease-out w-full shadow-sm">
      <div className="shrink-0 w-full md:w-36">
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-zoom-in relative overflow-hidden rounded-sm border border-border bg-muted group-hover:border-primary transition-colors">
              <AspectRatio ratio={1 / 1}>
                <img
                  src={data.imageUrl}
                  alt="Report preview"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </AspectRatio>
              <div className="absolute bottom-2 right-2 p-1 bg-background/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <FileText className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none">
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
              <img
                src={data.imageUrl}
                alt="Report full view"
                className="max-w-full max-h-[80vh] object-contain rounded-sm"
              />
              <div className="bg-card p-4 border border-border rounded-sm max-w-2xl w-full text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-1 text-foreground font-bold uppercase text-[10px] tracking-wider">
                  <FileText className="w-3 h-3" />
                  Full Description
                </div>
                <p className="leading-relaxed">{data.description}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">
              Medicine Report
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground font-medium">
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate">{data.userFullName}</span>
              <span className="text-border">•</span>
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {data.hospitalName || 'No hospital provided'}
              </span>
              <span className="text-border">•</span>
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => onReject?.(data)}
              className="px-2 border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-200 rounded-sm"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline mr-1.5">Reject</span>
            </Button>
            <Button
              type="button"
              size="xs"
              onClick={() => onAccept?.(data)}
              className="px-2 bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 rounded-sm shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline mr-1.5">Accept</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1.5 border-y border-border">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <Pill className="w-3 h-3" />
              Medication Detail
            </div>
            <div className="text-sm font-semibold text-foreground">
              {data.medicineName}
            </div>
            <div className="text-xs text-muted-foreground italic">
              {data.medicinePresentation}{' '}
              {data.medicineDosageForm ? `• ${data.medicineDosageForm}` : ''}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <FileText className="w-3 h-3" />
              Case Description
            </div>
            <div className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
              {data.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
