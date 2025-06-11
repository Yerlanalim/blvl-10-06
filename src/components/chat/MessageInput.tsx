"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false 
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || isLoading) {
      return;
    }

    onSendMessage(trimmedMessage);
    setMessage('');
  }, [message, onSendMessage, disabled, isLoading]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const isDisabled = disabled || isLoading || !message.trim();

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Leo anything about business skills..."
          className="min-h-[44px] max-h-[120px] resize-none"
          disabled={disabled || isLoading}
          rows={1}
        />
        <div className="mt-1 text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={isDisabled}
        size="default"
        className="flex items-center gap-2 h-11"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Send</span>
      </Button>
    </form>
  );
} 