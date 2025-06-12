"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { UserProgressResult } from '@/lib/types';
import { realtimeManager } from '@/lib/supabase/realtime-manager';

// Cache для часто используемых данных
const progressCache = new Map<string, { data: UserProgressResult; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

export function useUserProgress(userId?: string) {
  const [userProgress, setUserProgress] = useState<UserProgressResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserProgress = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Проверяем cache
    const cacheKey = `progress-${userId}`;
    const cached = progressCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setUserProgress(cached.data);
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

      const progressResult = {
        currentLevel: profile.current_level,
        completedLevels: profile.completed_lessons || [],
        tierType: profile.tier_type as 'free' | 'paid',
        aiMessagesCount: profile.ai_messages_count,
        profile,
        progressByLevel
      };

      // Сохраняем в cache
      progressCache.set(cacheKey, {
        data: progressResult,
        timestamp: Date.now()
      });

      setUserProgress(progressResult);
      
    } catch (err) {
      console.error('Error loading user progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Set up realtime subscription for progress changes
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadUserProgress();

    // Set up realtime subscription with unique ID and proper cleanup
    const subscriberId = `useUserProgress-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let cleanup: (() => void) | null = null;

    const setupRealtimeSubscription = async () => {
      try {
        // Delay subscription to avoid conflicts
        await new Promise(resolve => setTimeout(resolve, 150));

        const unsubscribe = await realtimeManager.subscribe(
          userId,
          {
            table: 'user_progress',
            event: '*',
            filter: `user_id=eq.${userId}`,
            callback: () => {
              // Debounce the reload to prevent rapid updates
              setTimeout(loadUserProgress, 300);
            }
          },
          subscriberId
        );

        cleanup = () => {
          try {
            unsubscribe();
          } catch (err) {
            console.debug('useUserProgress: cleanup error (non-critical):', err);
          }
        };
      } catch (error) {
        console.debug('useUserProgress: subscription setup failed (non-critical):', error);
        // Non-critical error - progress will still work without realtime updates
      }
    };

    setupRealtimeSubscription();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [userId, loadUserProgress]);

  const refreshProgress = useCallback(() => {
    if (userId) {
      // Очищаем cache перед обновлением
      const cacheKey = `progress-${userId}`;
      progressCache.delete(cacheKey);
      loadUserProgress();
    }
  }, [userId, loadUserProgress]);

  // Мемоизированные вычисления для производительности
  const memoizedResult = useMemo(() => ({
    userProgress,
    loading,
    error,
    refreshProgress
  }), [userProgress, loading, error, refreshProgress]);

  return memoizedResult;
} 