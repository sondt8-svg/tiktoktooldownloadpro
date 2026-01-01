
export interface VideoData {
  id: string;
  title: string;
  author: string;
  cover: string;
  duration: number;
  stats: {
    likes: string;
    comments: string;
    shares: string;
  };
  downloadUrl: string;
  hd720DownloadUrl?: string;
  hdDownloadUrl?: string;
  musicUrl?: string;
  aiIntelligence?: {
    tags: string[];
    viralScore: number;
    summary: string;
  };
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  author: string;
  cover: string;
  timestamp: number;
  type: 'video' | 'audio';
  quality?: 'sd' | '720p' | 'hd';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface QueueItem {
  id: string;
  url: string;
  status: 'pending' | 'analyzing' | 'ready' | 'downloading' | 'completed' | 'failed';
  progress: number;
  title?: string;
  cover?: string;
  error?: string;
  hdUrl?: string;
  hd720Url?: string;
  sdUrl?: string;
  musicUrl?: string;
  author?: string;
  showBypass?: boolean;
}

export type AppMode = 'single' | 'list' | 'channel';
