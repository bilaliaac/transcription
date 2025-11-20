import { Job, TranscriptionResult, Speaker, Segment } from '@/types/transcription';

// Mock data for development and demo purposes
export const mockSpeakers: Speaker[] = [
  { id: 'sp1', label: 'Speaker 1', color: 'hsl(var(--speaker-1))' },
  { id: 'sp2', label: 'Speaker 2', color: 'hsl(var(--speaker-2))' },
  { id: 'sp3', label: 'Speaker 3', color: 'hsl(var(--speaker-3))' },
];

export const mockSegments: Segment[] = [
  {
    id: 'seg1',
    startSec: 0.5,
    endSec: 4.2,
    speakerId: 'sp1',
    text: 'Hello everyone, welcome to today\'s podcast. I\'m really excited to discuss this topic with you all.'
  },
  {
    id: 'seg2',
    startSec: 4.5,
    endSec: 8.9,
    speakerId: 'sp2',
    text: 'Thanks for having me! I\'ve been looking forward to this conversation for weeks now.'
  },
  {
    id: 'seg3',
    startSec: 9.1,
    endSec: 15.3,
    speakerId: 'sp1',
    text: 'Let\'s dive right in. Can you tell us about your experience working on this project?'
  },
  {
    id: 'seg4',
    startSec: 15.8,
    endSec: 22.4,
    speakerId: 'sp2',
    text: 'Absolutely. It was an incredible journey that started about two years ago. We faced many challenges along the way.'
  },
  {
    id: 'seg5',
    startSec: 22.7,
    endSec: 28.1,
    speakerId: 'sp3',
    text: 'I\'d like to add that the team dynamics were really important to our success. Everyone brought unique perspectives.'
  },
  {
    id: 'seg6',
    startSec: 28.5,
    endSec: 35.2,
    speakerId: 'sp1',
    text: 'That\'s a great point. How did you manage to coordinate with such a diverse team across different time zones?'
  },
  {
    id: 'seg7',
    startSec: 35.6,
    endSec: 42.8,
    speakerId: 'sp2',
    text: 'Communication was key. We established regular sync meetings and used collaborative tools extensively.'
  },
  {
    id: 'seg8',
    startSec: 43.1,
    endSec: 49.5,
    speakerId: 'sp3',
    text: 'We also made sure to document everything. This helped new team members get up to speed quickly.'
  },
];

export const mockResult: TranscriptionResult = {
  mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  durationSec: 50,
  speakers: mockSpeakers,
  segments: mockSegments,
  createdAt: new Date().toISOString()
};

export const mockJobs: Job[] = [
  {
    id: 'job1',
    status: 'done',
    filename: 'podcast-episode-01.mp3',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'job2',
    status: 'transcribing',
    progressPct: 45,
    filename: 'interview-recording.wav',
    createdAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'job3',
    status: 'done',
    youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];
