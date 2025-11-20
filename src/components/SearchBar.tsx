import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Segment } from '@/types/transcription';

interface SearchBarProps {
  segments: Segment[];
  onSearchChange: (query: string) => void;
  onMatchSelect: (segmentId: string) => void;
}

export function SearchBar({ segments, onSearchChange, onMatchSelect }: SearchBarProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const matches = segments.filter(seg =>
    seg.text.toLowerCase().includes(query.toLowerCase())
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    onSearchChange(value);
    setCurrentMatchIndex(0);
  };

  const handleNext = () => {
    if (matches.length === 0) return;
    const nextIndex = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(nextIndex);
    onMatchSelect(matches[nextIndex].id);
  };

  const handlePrevious = () => {
    if (matches.length === 0) return;
    const prevIndex = currentMatchIndex === 0 ? matches.length - 1 : currentMatchIndex - 1;
    setCurrentMatchIndex(prevIndex);
    onMatchSelect(matches[prevIndex].id);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-9 pr-20"
        />
        {query && matches.length > 0 && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {currentMatchIndex + 1} / {matches.length}
          </span>
        )}
      </div>

      {query && (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={matches.length === 0}
          >
            <ChevronUp className="h-4 w-4" />
            <span className="sr-only">{t('previousMatch')}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={matches.length === 0}
          >
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">{t('nextMatch')}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
