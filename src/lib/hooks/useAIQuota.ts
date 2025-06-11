"use client";

import { useEffect, useState, useCallback } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { TierType, AIQuotaResult } from '@/lib/types';

export function useAIQuota(userId?: string) {
  const [quotaData, setQuotaData] = useState<AIQuotaResult>({
    used: 0,
    remaining: 0,
    canSend: false,
    resetAt: null,
    tierType: 'free',
    loading: true
  });
  const [error, setError] = useState<string | null>(null);

  const loadQuotaData = useCallback(async () => {
    if (!userId) {
      setQuotaData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setError(null);
      
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      // Get user profile with AI quota data
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('ai_messages_count, ai_daily_reset_at, tier_type')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      const { ai_messages_count, ai_daily_reset_at, tier_type } = profile;
      const tierType = tier_type as TierType;
      let used = ai_messages_count;
      let resetAt = ai_daily_reset_at;
      
      // Check if reset is needed for paid users
      if (tierType === 'paid' && ai_daily_reset_at) {
        const resetTime = new Date(ai_daily_reset_at);
        const now = new Date();
        
        // If reset time has passed, reset the quota
        if (resetTime <= now) {
          const newResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours
          
          // Perform reset in transaction
          const { error: resetError } = await supabase
            .from('user_profiles')
            .update({
              ai_messages_count: 0,
              ai_daily_reset_at: newResetAt.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

          if (resetError) {
            console.warn('Failed to reset AI quota:', resetError);
          } else {
            used = 0;
            resetAt = newResetAt.toISOString();
          }
        }
      }

      // Calculate remaining messages based on tier
      let remaining: number;
      if (tierType === 'free') {
        // Free: 30 total messages (no reset)
        remaining = Math.max(0, 30 - used);
      } else {
        // Paid: 30 messages per day (with daily reset)
        remaining = Math.max(0, 30 - used);
      }

      const canSend = remaining > 0;

      setQuotaData({
        used,
        remaining,
        canSend,
        resetAt,
        tierType,
        loading: false
      });
      
    } catch (err) {
      console.error('Error loading AI quota:', err);
      setError(err instanceof Error ? err.message : 'Failed to load quota');
      setQuotaData(prev => ({ ...prev, loading: false }));
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setQuotaData(prev => ({ ...prev, loading: false }));
      return;
    }

    loadQuotaData();
    
    // Set up realtime subscription for quota updates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any = null;
    
    const setupRealtimeSubscription = async () => {
      try {
        const sassClient = await createSPASassClient();
        const supabase = sassClient.getSupabaseClient();
        
        // Create unique channel name to avoid conflicts
        const channelName = `ai-quota-${userId}-${Date.now()}`;
        
        channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'user_profiles',
              filter: `user_id=eq.${userId}`
            },
            (payload) => {
              // Reload quota when ai_messages_count or ai_daily_reset_at changes
              if (payload.new && (
                'ai_messages_count' in payload.new || 
                'ai_daily_reset_at' in payload.new
              )) {
                loadQuotaData();
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.warn('Failed to setup realtime subscription for AI quota:', error);
      }
    };

    setupRealtimeSubscription();
    
    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
        } catch (error) {
          console.warn('Error unsubscribing from AI quota channel:', error);
        }
      }
    };
  }, [userId, loadQuotaData]);

  const refreshQuota = useCallback(() => {
    if (userId) {
      loadQuotaData();
    }
  }, [userId, loadQuotaData]);

  return {
    ...quotaData,
    error,
    refreshQuota
  };
} 