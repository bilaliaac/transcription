import { useTranslation } from 'react-i18next';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { Job, JobStatus } from '@/types/transcription';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface JobStatusBarProps {
  job: Job;
  onRetry?: () => void;
}

const STATUS_STEPS: JobStatus[] = ['queued', 'transcribing', 'diarizing', 'aligning', 'done'];

export function JobStatusBar({ job, onRetry }: JobStatusBarProps) {
  const { t } = useTranslation();

  const currentStepIndex = STATUS_STEPS.indexOf(job.status);
  const isError = job.status === 'error';

  return (
    <div className="border-b border-border bg-card">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('jobId')}:</span>
              <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                {job.id.slice(0, 8)}...
              </code>
              {job.filename && (
                <span className="text-sm font-medium">{job.filename}</span>
              )}
              {job.youtubeUrl && (
                <span className="text-sm font-medium">
                  YouTube: {new URL(job.youtubeUrl).searchParams.get('v') || 'Video'}
                </span>
              )}
            </div>
            {job.progressPct !== undefined && !isError && job.status !== 'done' && (
              <Progress value={job.progressPct} className="h-1.5 w-48" />
            )}
          </div>

          {isError && job.errorMessage && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{job.errorMessage}</span>
              </div>
              {onRetry && (
                <Button variant="destructive" size="sm" onClick={onRetry}>
                  {t('retryButton')}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Status Stepper */}
        <div className="mt-4">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: isError
                    ? '0%'
                    : `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`
                }}
              />
            </div>

            {/* Steps */}
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex || job.status === 'done';
              const isCurrent = index === currentStepIndex && !isError;
              const isFuture = index > currentStepIndex && !isError;

              return (
                <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                      isCompleted && 'bg-primary border-primary',
                      isCurrent && 'bg-background border-primary animate-pulse',
                      isFuture && 'bg-background border-muted',
                      isError && 'bg-background border-destructive'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-primary-foreground" />
                    ) : isCurrent ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : isError ? (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-muted" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium whitespace-nowrap transition-colors',
                      isCompleted && 'text-foreground',
                      isCurrent && 'text-primary font-semibold',
                      isFuture && 'text-muted-foreground',
                      isError && 'text-destructive'
                    )}
                  >
                    {t(`status${step.charAt(0).toUpperCase() + step.slice(1)}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
