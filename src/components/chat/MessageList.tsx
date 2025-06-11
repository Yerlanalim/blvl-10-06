"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, User, Loader2 } from 'lucide-react';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  streamingContent?: string;
}

export default function MessageList({ 
  messages, 
  isLoading = false, 
  streamingContent 
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Bot className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hi! I&apos;m Leo, your AI assistant
            </h3>
            <p className="text-gray-600 text-sm">
              I&apos;m here to help you master business skills. Ask me anything about the lessons, 
              concepts, or how to apply what you&apos;re learning!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto space-y-4 p-4"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex max-w-[80%] ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            } gap-3`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>

            {/* Message Content */}
            <div
              className={`flex flex-col ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Streaming message from Leo */}
      {(isLoading || streamingContent) && (
        <div className="flex justify-start">
          <div className="flex max-w-[80%] flex-row gap-3">
            {/* Leo Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>

            {/* Message Content */}
            <div className="flex flex-col items-start">
              <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
                {streamingContent ? (
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {streamingContent}
                    <span className="inline-block w-2 h-4 bg-gray-500 ml-1 animate-pulse" />
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Leo is thinking...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
} 