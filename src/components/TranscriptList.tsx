import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Segment, Speaker } from '@/types/transcription';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TranscriptListProps {
  segments: Segment[];
  speakers: Speaker[];
  currentTime: number;
  onSegmentClick: (segmentId: string) => void;
  onSegmentUpdate: (segmentId: string, text: string) => void;
  onSpeakerUpdate: (segmentId: string, speakerId: string) => void;
  searchQuery?: string;
  highlightedSegmentId?: string;
}

export function TranscriptList({
  segments,
  speakers,
  currentTime,
  onSegmentClick,
  onSegmentUpdate,
  onSpeakerUpdate,
  searchQuery = '',
  highlightedSegmentId
}: TranscriptListProps) {
  const { t } = useTranslation();
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const activeSegmentRef = useRef<HTMLDivElement>(null);

  // Find active segment based on current time
  const activeSegmentId = segments.find(
    seg => currentTime >= seg.startSec && currentTime <= seg.endSec
  )?.id;

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeSegmentId && activeSegmentRef.current) {
      activeSegmentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeSegmentId]);

  const handleEditStart = (segment: Segment) => {
    setEditingSegmentId(segment.id);
    setEditingText(segment.text);
  };

  const handleEditSave = (segmentId: string) => {
    onSegmentUpdate(segmentId, editingText);
    setEditingSegmentId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-warning/30 text-foreground">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredSegments = searchQuery
    ? segments.filter(seg => seg.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : segments;

  if (segments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>{t('noTranscript')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[600px] pr-2">
      {filteredSegments.map((segment) => {
        const speaker = speakers.find(s => s.id === segment.speakerId);
        const isActive = segment.id === activeSegmentId;
        const isHighlighted = segment.id === highlightedSegmentId;
        const isEditing = segment.id === editingSegmentId;

        return (
          <div
            key={segment.id}
            ref={isActive ? activeSegmentRef : null}
            className={cn(
              'p-4 rounded-lg border transition-all duration-200 cursor-pointer',
              isActive && 'border-primary bg-primary/5 shadow-sm',
              isHighlighted && !isActive && 'border-accent bg-accent/5',
              !isActive && !isHighlighted && 'border-border hover:border-muted-foreground/30'
            )}
            onClick={() => !isEditing && onSegmentClick(segment.id)}
          >
            <div className="flex items-start gap-3">
              {/* Speaker Color Indicator */}
              <div
                className="h-full w-1 rounded-full mt-1"
                style={{ backgroundColor: speaker?.color }}
              />

              <div className="flex-1 space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatTime(segment.startSec)}
                    </span>
                    <Input
                      value={speaker?.label || 'Unknown'}
                      onChange={(e) => {
                        // Find or create speaker with new label
                        const existingSpeaker = speakers.find(s => s.label === e.target.value);
                        if (existingSpeaker) {
                          onSpeakerUpdate(segment.id, existingSpeaker.id);
                        }
                      }}
                      className="h-6 w-28 text-xs font-medium px-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* Text */}
                {isEditing ? (
                  <Textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => handleEditSave(segment.id)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleEditSave(segment.id);
                      }
                      if (e.key === 'Escape') {
                        setEditingSegmentId(null);
                      }
                    }}
                    className="min-h-[60px] text-sm"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm leading-relaxed"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(segment);
                    }}
                  >
                    {highlightText(segment.text)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
