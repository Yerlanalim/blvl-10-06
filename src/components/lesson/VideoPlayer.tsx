"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play } from 'lucide-react';

interface VideoPlayerProps {
  content: string; // YouTube video ID or URL
  isCompleted: boolean;
  onComplete: () => void;
}

export default function VideoPlayer({ content, isCompleted, onComplete }: VideoPlayerProps) {
  const [hasWatched, setHasWatched] = useState(isCompleted);

  // Extract YouTube video ID from content
  const getYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : url; // Return original if no match (assume it's already an ID)
  };

  const videoId = getYouTubeId(content);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  const handleVideoEnd = () => {
    setHasWatched(true);
  };

  const handleMarkComplete = () => {
    setHasWatched(true);
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title="Lesson Video"
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleVideoEnd} // Simple approach - mark as watched when loaded
        />
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4 border-t border-gray-100">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Video Watched</span>
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