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

      // Get total steps for all levels at once to avoid N+1 queries
      const { data: allLessonSteps, error: stepsError } = await supabase
        .from('lesson_steps')
        .select('level_id, id');

      if (stepsError) {
        console.warn('Error loading lesson steps:', stepsError);
      }

      // Calculate steps count by level
      const stepsByLevel: Record<number, number> = {};
      if (allLessonSteps) {
        allLessonSteps.forEach(step => {
          stepsByLevel[step.level_id] = (stepsByLevel[step.level_id] || 0) + 1;
        });
      }

      // Calculate progress by level
      // This creates a comprehensive progress map for each level that includes:
      // - current_step: The step the user is currently on (1-based)
      // - total_steps: Total number of steps in the level
      // - percentage: Completion percentage (0-100)
      const progressByLevel: Record<number, { current_step: number; total_steps: number; percentage: number }> = {};

      if (progressRecords) {
        progressRecords.forEach(progress => {
          const totalSteps = stepsByLevel[progress.level_id] || 0;
          const currentStep = progress.current_step;
          const isCompleted = !!progress.completed_at;
          
          progressByLevel[progress.level_id] = {
            current_step: currentStep,
            total_steps: totalSteps,
            percentage: isCompleted ? 100 : Math.round((currentStep / totalSteps) * 100)
          };
        });
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any = null;
    
    const setupRealtimeSubscription = async () => {
      try {
        const sassClient = await createSPASassClient();
        const supabase = sassClient.getSupabaseClient();
        
        // Create unique channel name to avoid conflicts
        const channelName = `user-progress-${userId}-${Date.now()}`;
        
        channel = supabase
          .channel(channelName)
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
      } catch (error) {
        console.warn('Failed to setup realtime subscription:', error);
      }
    };

    setupRealtimeSubscription();
    
    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
        } catch (error) {
          console.warn('Error unsubscribing from channel:', error);
        }
      }
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