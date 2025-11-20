import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Youtube, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UploadPanelProps {
  onFileUpload: (file: File, onProgress: (progress: number) => void) => Promise<void>;
  onYouTubeUpload: (url: string) => Promise<void>;
}

export function UploadPanel({ onFileUpload, onYouTubeUpload }: UploadPanelProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileSelect = (file: File) => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'video/mp4'];
    if (validTypes.includes(file.type) || file.name.match(/\.(mp3|wav|mp4)$/i)) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a valid audio or video file (.mp3, .wav, .mp4)');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      await onFileUpload(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err) {
      setError(t('uploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadYouTube = async () => {
    if (!youtubeUrl) return;
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(youtubeUrl)) {
      setError(t('invalidYouTube'));
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      await onYouTubeUpload(youtubeUrl);
      setYoutubeUrl('');
    } catch (err) {
      setError(t('uploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* File Upload Area */}
          <div>
            <Label className="text-lg font-semibold mb-3 block">{t('uploadTitle')}</Label>
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
                isUploading && 'pointer-events-none opacity-50'
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">{t('uploadSubtitle')}</p>
              <Button variant="secondary" disabled={isUploading}>
                {t('uploadButton')}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.mp4"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>

            {selectedFile && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button onClick={handleUploadFile} disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('uploadProgress')}
                      </>
                    ) : (
                      t('uploadButton')
                    )}
                  </Button>
                </div>
                {isUploading && uploadProgress > 0 && (
                  <Progress value={uploadProgress} className="h-2" />
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t('orDivider')}</span>
            </div>
          </div>

          {/* YouTube Upload */}
          <div>
            <Label htmlFor="youtube-url" className="text-lg font-semibold mb-3 block">
              {t('youtubeLabel')}
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder={t('youtubePlaceholder')}
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled={isUploading}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleUploadYouTube} disabled={isUploading || !youtubeUrl}>
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t('transcribeYouTube')
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
