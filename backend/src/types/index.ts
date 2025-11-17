/**
 * Common types and interfaces for the MultiDownloader backend
 */

export interface DownloadRequest {
  url: string;
  platform?: 'youtube' | 'instagram' | 'facebook' | 'pinterest' | 'auto';
  quality?: string; // '360', '480', '720', '1080', '1440', '2160' (4K)
  format?: 'mp4' | 'webm' | 'mkv' | 'mp3' | 'wav';
  action?: 'download' | 'audio-only';
}

export interface ConvertVideoRequest {
  fileUrl?: string;
  targetFormat: 'mp4' | 'avi' | 'mkv' | 'webm' | 'mov';
  targetQuality?: string;
  targetResolution?: string; // e.g., '1280x720', '1920x1080'
}

export interface ConvertAudioRequest {
  fileUrl?: string;
  targetFormat: 'mp3' | 'wav' | 'aac' | 'flac' | 'ogg';
  bitrate?: string; // e.g., '128k', '256k', '320k'
}

export interface ConvertImageRequest {
  fileUrl?: string;
  targetFormat: 'jpg' | 'png' | 'webp' | 'avif' | 'gif' | 'bmp';
  width?: number;
  height?: number;
  quality?: number; // 1-100
}

export interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  message?: string;
  downloadUrl?: string;
  filePath?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserLimits {
  maxDownloadsPerDay: number;
  maxResolution: number;
  maxConcurrentDownloads: number;
  currentDownloadsToday: number;
  currentConcurrentDownloads: number;
}

export enum Platform {
  YOUTUBE = 'youtube',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  PINTEREST = 'pinterest',
  UNKNOWN = 'unknown',
}
