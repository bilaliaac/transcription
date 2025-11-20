import { useTranslation } from 'react-i18next';
import { Download, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ExportPanelProps {
  jobId: string;
  onExport: (format: 'srt' | 'vtt' | 'txt' | 'json') => void;
}

export function ExportPanel({ jobId, onExport }: ExportPanelProps) {
  const { t } = useTranslation();

  const exportFormats = [
    { format: 'srt' as const, label: t('downloadSRT') },
    { format: 'vtt' as const, label: t('downloadVTT') },
    { format: 'txt' as const, label: t('downloadTXT') },
    { format: 'json' as const, label: t('downloadJSON') },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t('exportTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {exportFormats.map(({ format, label }) => (
            <Button
              key={format}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onExport(format)}
            >
              <Download className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))}

          <div className="pt-2 border-t border-border">
            <Button
              variant="secondary"
              className="w-full justify-start"
              disabled
            >
              <Send className="mr-2 h-4 w-4" />
              {t('sendToOtto')}
              <span className="ml-auto text-xs text-muted-foreground">
                {t('comingSoon')}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
