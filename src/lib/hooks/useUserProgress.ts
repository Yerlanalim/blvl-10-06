"use client";

import { useEffect, useState, useCallback } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { UserProgressResult } from '@/lib/types';

export function useUserProgress(userId?: string) {
  const [userProgress, setUserProgress] = useState<UserProgressResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserProgress = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      // Get user profile with progress data
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Get detailed progress from user_progress table
      const { data: progressRecords, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          level_id,
          current_step,
          completed_at,
          level:levels(id, title, order_index)
        `)
        .eq('user_id', userId);

      if (progressError) {
        console.warn('Error loading detailed progress:', progressError);
      }

      // Calculate progress by level
      const progressByLevel: Record<number, { current_step: number; total_steps: number; percentage: number }> = {};

      if (progressRecords) {
        for (const progress of progressRecords) {
          // Get total steps for this level
          const { data: lessonSteps, error: stepsError } = await supabase
            .from('lesson_steps')
            .select('id')
            .eq('level_id', progress.level_id);

          if (!stepsError && lessonSteps) {
            const totalSteps = lessonSteps.length;
            const currentStep = progress.current_step;
            const isCompleted = !!progress.completed_at;
            
            progressByLevel[progress.level_id] = {
              current_step: currentStep,
              total_steps: totalSteps,
              percentage: isCompleted ? 100 : Math.round((currentStep / totalSteps) * 100)
            };
          }
        }
      }

      // For completed levels not in user_progress (legacy data), mark as 100%
      if (profile.completed_lessons) {
        profile.completed_lessons.forEach(levelId => {
          if (!progressByLevel[levelId]) {
            progressByLevel[levelId] = {
              current_step: 0,
              total_steps: 0,
              percentage: 100
            };
          }
        });
      }

      setUserProgress({
        currentLevel: profile.current_level,
        completedLevels: profile.completed_lessons || [],
        tierType: profile.tier_type as 'free' | 'paid',
        aiMessagesCount: profile.ai_messages_count,
        profile,
        progressByLevel
      });
      
    } catch (err) {
      console.error('Error loading user progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadUserProgress();
    
    // Set up realtime subscription
    const setupRealtimeSubscription = async () => {
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      const channel = supabase
        .channel('user-progress-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_progress',
            filter: `user_id=eq.${userId}`
          },
          () => {
            // Reload progress when user_progress changes
            loadUserProgress();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_profiles',
            filter: `user_id=eq.${userId}`
          },
          () => {
            // Reload progress when user profile changes
            loadUserProgress();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const unsubscribe = setupRealtimeSubscription();
    
    return () => {
      unsubscribe.then(cleanup => cleanup && cleanup());
    };
  }, [userId, loadUserProgress]);

  const refreshProgress = () => {
    if (userId) {
      loadUserProgress();
    }
  };

  return {
    userProgress,
    loading,
    error,
    refreshProgress
  };
} 