"use client";

import { useEffect, useState, useCallback } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { LevelAccessResult } from '@/lib/types';

export function useLevelAccess(levelId: number, userId?: string) {
  const [accessResult, setAccessResult] = useState<LevelAccessResult>({
    canAccess: false,
    isLocked: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkLevelAccess = useCallback(async () => {
    if (!userId || !levelId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      // Get user profile to check current level and tier
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('current_level, tier_type, completed_lessons')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Get level details
      const { data: level, error: levelError } = await supabase
        .from('levels')
        .select('*')
        .eq('id', levelId)
        .single();

      if (levelError) {
        throw levelError;
      }

      if (!level) {
        throw new Error('Level not found');
      }

      // Check tier restrictions
      const { tier_type, current_level, completed_lessons } = profile;
      
      // Free tier can only access levels 1-3
      if (tier_type === 'free' && levelId > 3) {
        setAccessResult({
          canAccess: false,
          isLocked: true,
          reason: 'Upgrade to paid tier to access this level',
          level
        });
        return;
      }

      // Check if level is completed
      const isCompleted = completed_lessons?.includes(levelId) || false;
      
      // Check if level is available based on progression
      // User can access current level and all previous completed levels
      const canAccess = levelId <= current_level || isCompleted;
      const isLocked = !canAccess;
      
      let reason: string | undefined;
      if (isLocked) {
        if (levelId > current_level) {
          reason = `Complete level ${levelId - 1} to unlock this level`;
        }
      }

      setAccessResult({
        canAccess,
        isLocked,
        reason,
        level
      });
      
    } catch (err) {
      console.error('Error checking level access:', err);
      setError(err instanceof Error ? err.message : 'Failed to check access');
      setAccessResult({
        canAccess: false,
        isLocked: true,
        reason: 'Error checking access'
      });
    } finally {
      setLoading(false);
    }
  }, [userId, levelId]);

  useEffect(() => {
    if (!userId || !levelId) {
      setLoading(false);
      return;
    }

    checkLevelAccess();
  }, [levelId, userId, checkLevelAccess]);

  const refreshAccess = () => {
    if (userId && levelId) {
      checkLevelAccess();
    }
  };

  return {
    ...accessResult,
    loading,
    error,
    refreshAccess
  };
} 