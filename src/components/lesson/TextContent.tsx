"use client";

import React from 'react';
import Markdown from 'react-markdown';
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
      <div className="prose prose-slate max-w-none">
        <Markdown
          components={{
            // Customize heading styles
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-medium text-gray-700 mb-3">{children}</h3>
            ),
            // Style paragraphs
            p: ({ children }) => (
              <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
            ),
            // Style lists
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">{children}</ol>
            ),
            // Style emphasis
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-800">{children}</em>
            ),
            // Style blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50 rounded-r-lg my-4">
                {children}
              </blockquote>
            ),
            // Style code
            code: ({ children, className }) => {
              return className ? (
                <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              ) : (
                <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                {children}
              </pre>
            ),
          }}
        >
          {content}
        </Markdown>
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