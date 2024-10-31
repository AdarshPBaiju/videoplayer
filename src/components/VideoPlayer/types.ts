export interface VideoPlayerProps {
  url: string;            
  subtitleUrl?: string;        
  thumbnail?: string;        
  [key: string]: unknown;
}