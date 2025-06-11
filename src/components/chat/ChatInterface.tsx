"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MessageList, { ChatMessage } from './MessageList';
import MessageInput from './MessageInput';
import QuotaDisplay from './QuotaDisplay';
import { useAIQuota } from '@/lib/hooks/useAIQuota';
import { AlertCircle, Bot } from 'lucide-react';

interface ChatInterfaceProps {
  userId: string;
}

export default function ChatInterface({ userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { canSend, remaining, refreshQuota } = useAIQuota(userId);

  const sendMessage = useCallback(async (content: string) => {
    if (!canSend || remaining <= 0) {
      setError('Message limit reached. Please upgrade your plan or wait for reset.');
      return;
    }

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setStreamingContent('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Message limit reached. Please upgrade or wait for reset.');
        } else if (response.status === 401) {
          throw new Error('Please log in to continue chatting.');
        } else {
          throw new Error(`Failed to send message: ${response.statusText}`);
        }
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to read response stream');
      }

      let assistantContent = '';
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;
          setStreamingContent(assistantContent);
        }
      } finally {
        reader.releaseLock();
      }

      // Add assistant message to history
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');
      
      // Refresh quota to get updated count
      refreshQuota();

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [canSend, remaining, refreshQuota]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bot className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Leo - AI Assistant
            </h1>
            <p className="text-gray-600">
              Your personal business skills mentor
            </p>
          </div>
        </div>
        
        {/* Quota Display */}
        <QuotaDisplay userId={userId} />
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Chat with Leo</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <MessageList
            messages={messages}
            isLoading={isLoading}
            streamingContent={streamingContent}
          />

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <MessageInput
              onSendMessage={sendMessage}
              disabled={!canSend || remaining <= 0}
              isLoading={isLoading}
            />
            
            {!canSend && (
              <div className="mt-2 text-sm text-red-600">
                Message limit reached. {remaining === 0 ? 'Upgrade to continue.' : ''}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 