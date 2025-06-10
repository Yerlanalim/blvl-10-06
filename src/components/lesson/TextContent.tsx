"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen } from 'lucide-react';

interface TextContentProps {
  content: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function TextContent({ content, isCompleted, onComplete }: TextContentProps) {
  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {content}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4 border-t border-gray-100">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Content Read</span>
          </div>
        ) : (
          <Button onClick={onComplete} className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Mark as Read
          </Button>
        )}
      </div>
    </div>
  );
} 