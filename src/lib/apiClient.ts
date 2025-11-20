import { Job, TranscriptionResult, UploadSasResponse, CreateJobRequest, CreateJobResponse } from '@/types/transcription';

// Base URL - easily configurable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getSasUrl(filename: string, size: number, mimeType: string): Promise<UploadSasResponse> {
    const response = await fetch(`${this.baseUrl}/uploads/get-sas-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, size, mimeType })
    });
    
    if (!response.ok) throw new Error('Failed to get SAS URL');
    return response.json();
  }

  async uploadFile(sasUrl: string, file: File, onProgress?: (progress: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            onProgress((e.loaded / e.total) * 100);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      
      xhr.open('PUT', sasUrl);
      xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
      xhr.send(file);
    });
  }

  async createTranscription(request: CreateJobRequest): Promise<CreateJobResponse> {
    const response = await fetch(`${this.baseUrl}/transcriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) throw new Error('Failed to create transcription');
    return response.json();
  }

  async getJob(jobId: string): Promise<Job> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}`);
    if (!response.ok) throw new Error('Failed to get job');
    return response.json();
  }

  async getJobResult(jobId: string): Promise<TranscriptionResult> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}/result`);
    if (!response.ok) throw new Error('Failed to get job result');
    return response.json();
  }

  async exportJob(jobId: string, format: 'srt' | 'vtt' | 'txt' | 'json'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}/export?format=${format}`);
    if (!response.ok) throw new Error('Failed to export job');
    return response.blob();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
