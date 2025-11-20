import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { File, Youtube, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Job } from '@/types/transcription';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JobListSidebarProps {
  jobs: Job[];
  selectedJobId?: string;
  onJobSelect: (jobId: string) => void;
}

export function JobListSidebar({ jobs, selectedJobId, onJobSelect }: JobListSidebarProps) {
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'fr' ? fr : enUS;

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-sm text-muted-foreground">{t('noJobs')}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          {t('jobsTitle')}
        </h3>
        {jobs.map((job) => (
          <button
            key={job.id}
            onClick={() => onJobSelect(job.id)}
            className={cn(
              'w-full text-left p-3 rounded-lg border transition-all duration-200',
              'hover:bg-muted/50',
              selectedJobId === job.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border'
            )}
          >
            <div className="space-y-2">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {job.filename ? (
                    <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  ) : (
                    <Youtube className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium truncate">
                    {job.filename || 'YouTube Video'}
                  </span>
                </div>
                {getStatusIcon(job.status)}
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <code className="font-mono">
                  {job.id.slice(0, 8)}...
                </code>
                <span>
                  {formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                    locale
                  })}
                </span>
              </div>

              {/* Progress */}
              {job.progressPct !== undefined && job.status !== 'done' && job.status !== 'error' && (
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${job.progressPct}%` }}
                  />
                </div>
              )}

              {/* Error message */}
              {job.status === 'error' && job.errorMessage && (
                <p className="text-xs text-destructive line-clamp-2">
                  {job.errorMessage}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
