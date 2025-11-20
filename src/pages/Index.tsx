import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { UploadPanel } from '@/components/UploadPanel';
import { JobStatusBar } from '@/components/JobStatusBar';
import { WaveformPlayer } from '@/components/WaveformPlayer';
import { TranscriptList } from '@/components/TranscriptList';
import { SpeakerPanel } from '@/components/SpeakerPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { SearchBar } from '@/components/SearchBar';
import { JobListSidebar } from '@/components/JobListSidebar';
import { EmptyState } from '@/components/EmptyState';
import { apiClient } from '@/lib/apiClient';
import { mockJobs, mockResult } from '@/lib/mockData';
import { Segment, Speaker } from '@/types/transcription';
import { cn } from '@/lib/utils';

const Index = () => {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [currentSegmentId, setCurrentSegmentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedSegmentId, setHighlightedSegmentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Local state for editable data (in production, this would sync with backend)
  const [segments, setSegments] = useState<Segment[]>(mockResult.segments);
  const [speakers, setSpeakers] = useState<Speaker[]>(mockResult.speakers);

  // Mock jobs list (in production, this would be fetched from API)
  const jobs = mockJobs;

  // Current job data (using mock data for demo)
  const currentJob = jobs.find(j => j.id === currentJobId);

  // Simulate fetching job result (in production, use real API)
  const { data: result } = useQuery({
    queryKey: ['job-result', currentJobId],
    queryFn: () => Promise.resolve(mockResult),
    enabled: currentJobId !== null && currentJob?.status === 'done',
  });

  const handleFileUpload = async (file: File, onProgress: (progress: number) => void) => {
    // Simulate upload
    try {
      // In production:
      // 1. Get SAS URL
      // const { sasUrl, blobUrl } = await apiClient.getSasUrl(file.name, file.size, file.type);
      // 2. Upload to SAS URL
      // await apiClient.uploadFile(sasUrl, file, onProgress);
      // 3. Create transcription job
      // const { jobId } = await apiClient.createTranscription({ sourceType: 'file', blobUrl });
      
      // Mock delay
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        onProgress(i);
      }
      
      setCurrentJobId('job1');
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const handleYouTubeUpload = async (url: string) => {
    try {
      // In production:
      // const { jobId } = await apiClient.createTranscription({ sourceType: 'youtube', youtubeUrl: url });
      
      // Mock
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentJobId('job3');
    } catch (error) {
      console.error('YouTube upload failed:', error);
      throw error;
    }
  };

  const handleSegmentClick = (segmentId: string) => {
    setCurrentSegmentId(segmentId);
  };

  const handleSegmentUpdate = (segmentId: string, text: string) => {
    setSegments(prev =>
      prev.map(seg => seg.id === segmentId ? { ...seg, text } : seg)
    );
  };

  const handleSpeakerUpdate = (segmentId: string, speakerId: string) => {
    setSegments(prev =>
      prev.map(seg => seg.id === segmentId ? { ...seg, speakerId } : seg)
    );
  };

  const handleSpeakerRename = (speakerId: string, newLabel: string) => {
    setSpeakers(prev =>
      prev.map(sp => sp.id === speakerId ? { ...sp, label: newLabel } : sp)
    );
  };

  const handleExport = async (format: 'srt' | 'vtt' | 'txt' | 'json') => {
    if (!currentJobId) return;
    
    try {
      // In production:
      // const blob = await apiClient.exportJob(currentJobId, format);
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `transcript.${format}`;
      // a.click();
      
      // Mock
      console.log(`Exporting job ${currentJobId} as ${format}`);
      alert(`Export ${format.toUpperCase()} started (demo only)`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleMatchSelect = (segmentId: string) => {
    setHighlightedSegmentId(segmentId);
    setCurrentSegmentId(segmentId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* Sidebar - Jobs List */}
        <aside
          className={cn(
            'fixed lg:relative inset-y-0 left-0 z-40 w-80 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <JobListSidebar
            jobs={jobs}
            selectedJobId={currentJobId || undefined}
            onJobSelect={(jobId) => {
              setCurrentJobId(jobId);
              setSidebarOpen(false);
            }}
          />
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="container max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
            {/* Upload Panel */}
            <UploadPanel
              onFileUpload={handleFileUpload}
              onYouTubeUpload={handleYouTubeUpload}
            />

            {/* Job Status */}
            {currentJob && <JobStatusBar job={currentJob} />}

            {/* Main Editor */}
            {currentJob?.status === 'done' && result ? (
              <div className="space-y-6">
                {/* Search Bar */}
                <SearchBar
                  segments={segments}
                  onSearchChange={handleSearchChange}
                  onMatchSelect={handleMatchSelect}
                />

                {/* Two-column layout */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left: Waveform + Transcript */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Waveform */}
                    <div className="rounded-lg border border-border bg-card p-6">
                      <WaveformPlayer
                        audioUrl={result.mediaUrl}
                        segments={segments}
                        speakers={speakers}
                        currentSegmentId={currentSegmentId || undefined}
                        onSegmentClick={handleSegmentClick}
                      />
                    </div>

                    {/* Transcript */}
                    <div className="rounded-lg border border-border bg-card p-6">
                      <h2 className="text-lg font-semibold mb-4">Transcript</h2>
                      <TranscriptList
                        segments={segments}
                        speakers={speakers}
                        currentTime={currentTime}
                        onSegmentClick={handleSegmentClick}
                        onSegmentUpdate={handleSegmentUpdate}
                        onSpeakerUpdate={handleSpeakerUpdate}
                        searchQuery={searchQuery}
                        highlightedSegmentId={highlightedSegmentId || undefined}
                      />
                    </div>
                  </div>

                  {/* Right: Speakers + Export */}
                  <div className="space-y-6">
                    <SpeakerPanel
                      speakers={speakers}
                      onSpeakerRename={handleSpeakerRename}
                    />
                    <ExportPanel
                      jobId={currentJobId!}
                      onExport={handleExport}
                    />
                  </div>
                </div>
              </div>
            ) : currentJob && currentJob.status !== 'done' && currentJob.status !== 'error' ? (
              <div className="rounded-lg border border-border bg-card p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Processing your file...</h3>
                <p className="text-muted-foreground">
                  This may take a few minutes depending on the file size.
                </p>
              </div>
            ) : !currentJob ? (
              <EmptyState />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
