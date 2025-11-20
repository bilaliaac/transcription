export type JobStatus = 'queued' | 'transcribing' | 'diarizing' | 'aligning' | 'done' | 'error';

export interface Job {
  id: string;
  status: JobStatus;
  progressPct?: number;
  errorMessage?: string;
  filename?: string;
  youtubeUrl?: string;
  createdAt: string;
}

export interface Speaker {
  id: string;
  label: string;
  color: string;
}

export interface Segment {
  id: string;
  startSec: number;
  endSec: number;
  speakerId: string;
  text: string;
}

export interface TranscriptionResult {
  mediaUrl: string;
  durationSec: number;
  speakers: Speaker[];
  segments: Segment[];
  createdAt: string;
}

export interface UploadSasResponse {
  sasUrl: string;
  blobUrl: string;
}

export interface CreateJobRequest {
  sourceType: 'file' | 'youtube';
  blobUrl?: string;
  youtubeUrl?: string;
}

export interface CreateJobResponse {
  jobId: string;
}
