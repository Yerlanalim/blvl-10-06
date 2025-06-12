"use client";

import { useEffect, useState, useCallback } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { TierType, AIQuotaResult } from '@/lib/types';
import { realtimeManager } from '@/lib/supabase/realtime-manager';

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

  // Send AI quota reminder email
  const sendQuotaReminderEmail = useCallback(async (
    userEmail: string, 
    firstName: string, 
    remaining: number, 
    tierType: TierType
  ) => {
    try {
      const emailResponse = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'ai-quota-reminder',
          to: userEmail,
          firstName,
          messagesRemaining: remaining,
          tierType,
          isDaily: tierType === 'paid'
        })
      });

      if (emailResponse.ok) {
        console.log(`[AI_QUOTA] Quota reminder email sent (${remaining} remaining)`);
        return true;
      } else {
        console.error('[AI_QUOTA] Failed to send quota reminder email');
        return false;
      }
    } catch (error) {
      console.error('[AI_QUOTA] Error sending quota reminder email:', error);
      return false;
    }
  }, []);

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
        .select('ai_messages_count, ai_daily_reset_at, tier_type, ai_quota_reminder_sent, first_name')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      const { ai_messages_count, ai_daily_reset_at, tier_type, ai_quota_reminder_sent, first_name } = profile;
      const tierType = tier_type as TierType;
      let used = ai_messages_count;
      let resetAt = ai_daily_reset_at;
      let reminderSent = ai_quota_reminder_sent;
      
      // Check if reset is needed for paid users
      if (tierType === 'paid' && ai_daily_reset_at) {
        const resetTime = new Date(ai_daily_reset_at);
        const now = new Date();
        
        // If reset time has passed, reset the quota
        if (resetTime <= now) {
          const newResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours
          
          // Perform reset in transaction, also reset reminder flag
          const { error: resetError } = await supabase
            .from('user_profiles')
            .update({
              ai_messages_count: 0,
              ai_daily_reset_at: newResetAt.toISOString(),
              ai_quota_reminder_sent: false,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

          if (resetError) {
            console.warn('Failed to reset AI quota:', resetError);
          } else {
            used = 0;
            resetAt = newResetAt.toISOString();
            reminderSent = false;
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

      // Send quota reminder email if needed
      if (remaining <= 5 && remaining > 0 && !reminderSent) {
        // Get user email for sending reminder
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const emailSent = await sendQuotaReminderEmail(
            user.email,
            first_name || user.email.split('@')[0],
            remaining,
            tierType
          );

          if (emailSent) {
            // Mark reminder as sent
            await supabase
              .from('user_profiles')
              .update({
                ai_quota_reminder_sent: true,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId);
          }
        }
      }

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
  }, [userId, sendQuotaReminderEmail]);

  useEffect(() => {
    if (!userId) {
      setQuotaData(prev => ({ ...prev, loading: false }));
      return;
    }

    loadQuotaData();
    
    // Set up realtime subscription using centralized manager
    const subscriberId = `useAIQuota-${userId}-${Date.now()}`;
    let cleanup: (() => void) | null = null;
    
    const setupSubscription = async () => {
      try {
        const unsubscribe = await realtimeManager.subscribe(
          userId,
          {
            table: 'user_profiles',
            event: 'UPDATE',
            filter: `user_id=eq.${userId}`,
            callback: loadQuotaData
          },
          subscriberId
        );

        cleanup = () => unsubscribe();
      } catch (error) {
        console.warn('Failed to setup realtime subscription for AI quota:', error);
      }
    };

    setupSubscription();

    return () => {
      if (cleanup) {
        cleanup();
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