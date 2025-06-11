"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  content: string; // YouTube video ID or URL
  isCompleted: boolean;
  onComplete: () => void;
}

export default function VideoPlayer({ content, isCompleted, onComplete }: VideoPlayerProps) {
  const [hasWatched, setHasWatched] = useState(isCompleted);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Extract YouTube video ID from various URL formats
  const getYouTubeId = (url: string): string => {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /^[a-zA-Z0-9_-]{11}$/ // Direct video ID format
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1] || url;
      }
    }
    
    // If no pattern matches, assume it's already a video ID
    return url;
  };

  const videoId = getYouTubeId(content);
  // Enable JS API and origin for better tracking
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&rel=0`;

  // Listen for YouTube player messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        
        // Player state changes: 1=playing, 2=paused, 0=ended
        if (data.event === 'video-progress') {
          const { currentTime, duration } = data.info;
          // Mark as watched if 80% viewed
          if (currentTime / duration >= 0.8) {
            setHasWatched(true);
          }
        }
        
        if (data.event === 'onStateChange') {
          switch (data.info) {
            case 1: // Playing
              setIsPlaying(true);
              break;
            case 2: // Paused
            case 0: // Ended
              setIsPlaying(false);
              if (data.info === 0) { // Video ended
                setHasWatched(true);
              }
              break;
          }
        }

        if (data.event === 'onReady') {
          setVideoReady(true);
        }
              } catch {
          // Ignore non-JSON messages
        }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleMarkComplete = () => {
    setHasWatched(true);
    onComplete();
  };

  // Simple fallback - mark as watched when iframe loads (for compatibility)
  const handleIframeLoad = () => {
    if (!videoReady) {
      setTimeout(() => setHasWatched(true), 3000); // Fallback after 3 seconds
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative">
        <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title="Lesson Video"
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        </div>
        
        {/* Video Status Overlay */}
        {isPlaying && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span className="text-sm">Playing</span>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {!isCompleted && hasWatched && (
        <div className="text-center text-green-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Video Watched!</span>
          </div>
          <p className="text-sm text-gray-600">
            You can now mark this step as completed
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-center pt-4 border-t border-gray-100">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Video Completed</span>
          </div>
        ) : hasWatched ? (
          <Button onClick={handleMarkComplete} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Mark as Completed
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-gray-600">
            <Play className="h-5 w-5" />
            <span>Watch the video to continue</span>
          </div>
        )}
      </div>
    </div>
  );
} 