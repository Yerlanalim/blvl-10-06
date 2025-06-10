"use client";

import { useEffect, useState } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/types';

interface UserProgress {
  currentLevel: number;
  completedLevels: number[];
  tierType: 'free' | 'paid';
  aiMessagesCount: number;
  profile: Tables<'user_profiles'> | null;
}

interface ProgressData {
  levelId: number;
  progress: number; // percentage
  stepsCompleted: number;
  totalSteps: number;
}

export function useUserProgress(userId?: string) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [progressData, setProgressData] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadUserProgress();
  }, [userId]);

  const loadUserProgress = async () => {
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

      // Get detailed progress for each level
      const { data: progressRows, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          level_id,
          current_step,
          completed_at,
          level:levels!inner(
            id,
            title
          )
        `)
        .eq('user_id', userId);

      if (progressError) {
        console.error('Error loading progress details:', progressError);
        // Don't throw here, we can still show basic progress
      }

      // Calculate progress percentages
      const progressMap: Record<number, number> = {};
      
      if (progressRows) {
        for (const row of progressRows) {
          // Get total steps for this level
          const { data: stepsCount } = await supabase
            .from('lesson_steps')
            .select('id')
            .eq('level_id', row.level_id);
          
          const totalSteps = stepsCount?.length || 3; // Default to 3 steps
          const completedSteps = row.completed_at ? totalSteps : row.current_step;
          
          progressMap[row.level_id] = Math.round((completedSteps / totalSteps) * 100);
        }
      }

      setUserProgress({
        currentLevel: profile.current_level,
        completedLevels: profile.completed_lessons || [],
        tierType: profile.tier_type as 'free' | 'paid',
        aiMessagesCount: profile.ai_messages_count,
        profile
      });
      
      setProgressData(progressMap);
      
    } catch (err) {
      console.error('Error loading user progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const refreshProgress = () => {
    if (userId) {
      loadUserProgress();
    }
  };

  return {
    userProgress,
    progressData,
    loading,
    error,
    refreshProgress
  };
} 