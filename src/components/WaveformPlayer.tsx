import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';
import { Button } from '@/components/ui/button';
import { Segment, Speaker } from '@/types/transcription';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface WaveformPlayerProps {
  audioUrl: string;
  segments: Segment[];
  speakers: Speaker[];
  currentSegmentId?: string;
  onSegmentClick?: (segmentId: string) => void;
}

export function WaveformPlayer({
  audioUrl,
  segments,
  speakers,
  currentSegmentId,
  onSegmentClick
}: WaveformPlayerProps) {
  const { t } = useTranslation();
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState('1');
  const [loopEnabled, setLoopEnabled] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer
    const regions = RegionsPlugin.create();
    regionsRef.current = regions;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'hsl(var(--muted-foreground) / 0.3)',
      progressColor: 'hsl(var(--primary))',
      cursorColor: 'hsl(var(--primary))',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 80,
      normalize: true,
      plugins: [regions]
    });

    wavesurferRef.current = ws;

    ws.load(audioUrl);

    ws.on('ready', () => {
      setDuration(ws.getDuration());
      
      // Add regions for each segment
      segments.forEach((segment) => {
        const speaker = speakers.find(s => s.id === segment.speakerId);
        regions.addRegion({
          start: segment.startSec,
          end: segment.endSec,
          color: speaker ? `${speaker.color.replace(')', ' / 0.2)')}` : 'hsl(var(--muted) / 0.2)',
          drag: false,
          resize: false,
          id: segment.id
        });
      });
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('timeupdate', (time) => setCurrentTime(time));

    // Handle region clicks
    regions.on('region-clicked', (region) => {
      if (onSegmentClick) {
        onSegmentClick(region.id);
      }
      ws.setTime(region.start);
    });

    return () => {
      ws.destroy();
    };
  }, [audioUrl, segments, speakers]);

  // Handle current segment highlighting
  useEffect(() => {
    if (!regionsRef.current || !currentSegmentId) return;

    const regions = regionsRef.current.getRegions();
    regions.forEach(region => {
      const opacity = region.id === currentSegmentId ? '0.4' : '0.2';
      region.setOptions({
        color: region.color.replace(/[\d.]+\)$/, `${opacity})`)
      });
    });
  }, [currentSegmentId]);

  // Handle playback rate changes
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(parseFloat(playbackRate));
    }
  }, [playbackRate]);

  // Handle loop
  useEffect(() => {
    if (!wavesurferRef.current || !loopEnabled || !currentSegmentId) return;

    const segment = segments.find(s => s.id === currentSegmentId);
    if (!segment) return;

    const ws = wavesurferRef.current;
    const handleTimeUpdate = (time: number) => {
      if (time >= segment.endSec) {
        ws.setTime(segment.startSec);
      }
    };

    ws.on('timeupdate', handleTimeUpdate);
    return () => {
      ws.un('timeupdate', handleTimeUpdate);
    };
  }, [loopEnabled, currentSegmentId, segments]);

  const togglePlayPause = () => {
    wavesurferRef.current?.playPause();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Waveform */}
      <div ref={waveformRef} className="w-full bg-muted/30 rounded-lg" />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="icon"
            onClick={togglePlayPause}
            className="h-10 w-10"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          <div className="text-sm font-mono text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="playback-speed" className="text-sm">
              {t('speed')}
            </Label>
            <Select value={playbackRate} onValueChange={setPlaybackRate}>
              <SelectTrigger id="playback-speed" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="loop-mode"
              checked={loopEnabled}
              onCheckedChange={setLoopEnabled}
              disabled={!currentSegmentId}
            />
            <Label htmlFor="loop-mode" className="text-sm cursor-pointer">
              {t('loop')}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
