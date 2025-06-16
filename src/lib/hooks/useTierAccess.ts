"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { TierType } from '@/lib/types';
import { 
  canAccessLevel, 
  canSendAIMessage, 
  getUserAccessSummary,
  LevelAccessCheck,
  AIMessageCheck,
  UserAccessSummary
} from '@/lib/tiers/access';
import { TierFeature } from '@/lib/tiers/config';
import { realtimeManager } from '@/lib/supabase/realtime-manager';

export interface TierAccessResult {
  // User tier info
  tierType: TierType;
  maxLevels: number;
  features: TierFeature[];
  canUpgrade: boolean;
  
  // Level access
  canAccessLevel: (levelId: number) => Promise<LevelAccessCheck>;
  
  // AI messaging
  aiAccess: AIMessageCheck;
  canSendAIMessage: boolean;
  refreshAIQuota: () => Promise<void>;
  
  // Feature checks
  hasFeature: (feature: TierFeature) => boolean;
  
  // State management
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Centralized hook for all tier-related access checks
 * Provides caching, realtime updates, and unified API
 */
export function useTierAccess(userId?: string): TierAccessResult {
  const [accessData, setAccessData] = useState<UserAccessSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache for level access checks to avoid repeated API calls
  const [levelAccessCache, setLevelAccessCache] = useState<Record<number, {
    result: LevelAccessCheck;
    timestamp: number;
  }>>({});

  const loadAccessData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get comprehensive user access summary using client-side mode
      const summary = await getUserAccessSummary(userId);
      
      setAccessData(summary);

      // Clear level access cache when tier data changes
      setLevelAccessCache({});

    } catch (err) {
      console.error('Error loading tier access data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load access data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const refreshAIQuota = useCallback(async () => {
    if (!userId || !accessData) return;

    try {
      const aiAccess = await canSendAIMessage(userId);
      setAccessData(prev => prev ? { ...prev, aiLimit: aiAccess } : null);
    } catch (err) {
      console.error('Error refreshing AI quota:', err);
    }
  }, [userId, accessData]);

  const checkLevelAccess = useCallback(async (levelId: number): Promise<LevelAccessCheck> => {
    if (!userId) {
      return {
        canAccess: false,
        isLocked: true,
        reason: 'User not authenticated'
      };
    }

    // Check cache first (5 minute TTL)
    const cached = levelAccessCache[levelId];
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.result;
    }

    try {
      const result = await canAccessLevel(userId, levelId);
      
      // Update cache
      setLevelAccessCache(prev => ({
        ...prev,
        [levelId]: {
          result,
          timestamp: Date.now()
        }
      }));

      return result;
    } catch (err) {
      console.error('Error checking level access:', err);
      return {
        canAccess: false,
        isLocked: true,
        reason: 'Error checking access'
      };
    }
  }, [userId, levelAccessCache]);

  const checkFeature = useCallback((feature: TierFeature): boolean => {
    if (!accessData) return false;
    return accessData.features.includes(feature);
  }, [accessData]);

  // Set up realtime subscription for tier changes using centralized manager
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadAccessData();

    // Set up realtime subscription using centralized manager with proper cleanup
    const subscriberId = `useTierAccess-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let cleanup: (() => void) | null = null;
    let isSetupInProgress = false;
    
    const setupSubscription = async () => {
      if (isSetupInProgress) {
        console.debug('useTierAccess: subscription setup already in progress, skipping');
        return;
      }
      
      isSetupInProgress = true;
      
      try {
        // Delay subscription setup to avoid conflicts during rapid component mounts
        await new Promise(resolve => setTimeout(resolve, 100));

        const unsubscribe = await realtimeManager.subscribe(
          userId,
          {
            table: 'user_profiles',
            event: 'UPDATE',
            filter: `user_id=eq.${userId}`,
            callback: () => {
              // Debounce the callback to prevent rapid updates
              setTimeout(loadAccessData, 200);
            }
          },
          subscriberId
        );

        cleanup = () => {
          try {
            unsubscribe();
          } catch (err) {
            console.debug('useTierAccess: cleanup error (non-critical):', err);
          }
        };
      } catch (error) {
        console.debug('useTierAccess: subscription setup failed (non-critical):', error);
        // Non-critical error - app continues to work without realtime updates
      } finally {
        isSetupInProgress = false;
      }
    };

    setupSubscription();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [userId, loadAccessData]);

  // Memoized return object to prevent unnecessary re-renders
  const result = useMemo((): TierAccessResult => {
    if (!accessData) {
      // Return safe defaults while loading
      return {
        tierType: 'free',
        maxLevels: 3,
        features: ['basic_content', 'community'],
        canUpgrade: true,
        canAccessLevel: checkLevelAccess,
        aiAccess: { canSend: false, remaining: 0, limitType: 'none' },
        canSendAIMessage: false,
        refreshAIQuota,
        hasFeature: () => false,
        loading,
        error,
        refresh: loadAccessData
      };
    }

    return {
      tierType: accessData.tierType,
      maxLevels: accessData.maxLevels,
      features: accessData.features,
      canUpgrade: accessData.canUpgrade,
      canAccessLevel: checkLevelAccess,
      aiAccess: accessData.aiLimit,
      canSendAIMessage: accessData.aiLimit.canSend,
      refreshAIQuota,
      hasFeature: checkFeature,
      loading,
      error,
      refresh: loadAccessData
    };
  }, [accessData, checkLevelAccess, refreshAIQuota, checkFeature, loading, error, loadAccessData]);

  return result;
} 