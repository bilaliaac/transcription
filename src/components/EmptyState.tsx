import { useTranslation } from 'react-i18next';
import { FileAudio } from 'lucide-react';

export function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <FileAudio className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{t('emptyTitle')}</h2>
      <p className="text-muted-foreground max-w-md">{t('emptyDescription')}</p>
    </div>
  );
}
