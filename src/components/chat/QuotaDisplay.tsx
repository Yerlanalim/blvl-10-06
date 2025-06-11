"use client";

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAIQuota } from '@/lib/hooks/useAIQuota';
import { MessageCircle, Clock, Zap } from 'lucide-react';

interface QuotaDisplayProps {
  userId: string;
}

export default function QuotaDisplay({ userId }: QuotaDisplayProps) {
  const { used, remaining, tierType, resetAt, loading, error } = useAIQuota(userId);

  // Memoize expensive calculations
  const quotaInfo = useMemo(() => {
    const totalLimit = 30;
    const percentage = (used / totalLimit) * 100;
    
    let progressColor = 'bg-primary-600';
    if (remaining === 0) {
      progressColor = 'bg-red-500';
    } else if (remaining <= 5) {
      progressColor = 'bg-yellow-500';
    }

    const resetDisplay = resetAt ? new Date(resetAt).toLocaleDateString() : null;

    return {
      totalLimit,
      percentage,
      progressColor,
      resetDisplay
    };
  }, [used, remaining, resetAt]);

  if (loading) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-500">Loading quota...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">Unable to load message quota</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium">
              {tierType === 'free' ? 'AI Messages' : 'Daily AI Messages'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {tierType === 'paid' && quotaInfo.resetDisplay && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>
                  Resets {quotaInfo.resetDisplay}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold">
                {remaining}/{quotaInfo.totalLimit}
              </span>
              {tierType === 'paid' && (
                <Zap className="h-3 w-3 text-yellow-500" />
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${quotaInfo.progressColor}`}
              style={{ width: `${quotaInfo.percentage}%` }}
            />
          </div>
          
          {remaining === 0 && (
            <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <span>Message limit reached</span>
              {tierType === 'free' && (
                <span>• Upgrade to continue chatting</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 