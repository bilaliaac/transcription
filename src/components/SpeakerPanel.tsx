import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, Check, X } from 'lucide-react';
import { Speaker } from '@/types/transcription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SpeakerPanelProps {
  speakers: Speaker[];
  onSpeakerRename: (speakerId: string, newLabel: string) => void;
}

export function SpeakerPanel({ speakers, onSpeakerRename }: SpeakerPanelProps) {
  const { t } = useTranslation();
  const [editingSpeakerId, setEditingSpeakerId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  const handleEditStart = (speaker: Speaker) => {
    setEditingSpeakerId(speaker.id);
    setEditingLabel(speaker.label);
  };

  const handleEditSave = (speakerId: string) => {
    if (editingLabel.trim()) {
      onSpeakerRename(speakerId, editingLabel.trim());
    }
    setEditingSpeakerId(null);
  };

  const handleEditCancel = () => {
    setEditingSpeakerId(null);
    setEditingLabel('');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t('speakersTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {speakers.map((speaker) => {
            const isEditing = editingSpeakerId === speaker.id;

            return (
              <div
                key={speaker.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Color chip */}
                <div
                  className="h-6 w-6 rounded-full border-2 border-background shadow-sm flex-shrink-0"
                  style={{ backgroundColor: speaker.color }}
                />

                {/* Label */}
                {isEditing ? (
                  <>
                    <Input
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(speaker.id);
                        if (e.key === 'Escape') handleEditCancel();
                      }}
                      className="h-8 flex-1"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleEditSave(speaker.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={handleEditCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium flex-1">{speaker.label}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleEditStart(speaker)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
