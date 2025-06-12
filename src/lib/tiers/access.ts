/**
 * Unified Access Control Functions for BizLevel Tiers
 * Single source of truth for all tier-related access checks
 */

import { createSPASassClient } from '@/lib/supabase/client';
import { TierType } from '@/lib/types';
import { getTierConfig, tierHasFeature, TierFeature } from './config';

export interface LevelAccessCheck {
  canAccess: boolean;
  isLocked: boolean;
  reason?: string;
  tierRestriction?: boolean;
  progressRestriction?: boolean;
}

export interface AIMessageCheck {
  canSend: boolean;
  remaining: number;
  limitType: 'total' | 'daily' | 'none';
  resetAt?: string | null;
}

export interface UserAccessSummary {
  tierType: TierType;
  maxLevels: number;
  aiLimit: AIMessageCheck;
  features: TierFeature[];
  canUpgrade: boolean;
}

/**
 * Get client-side Supabase instance
 */
async function getClientSupabase() {
  const sassClient = await createSPASassClient();
  return sassClient.getSupabaseClient();
}

/**
 * Check if user can access a specific level (CLIENT-SIDE ONLY)
 * Use server-actions.ts for server-side checks
 */
export async function canAccessLevel(
  userId: string, 
  levelId: number
): Promise<LevelAccessCheck> {
  try {
    const supabase = await getClientSupabase();
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('current_level, tier_type, completed_lessons')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return {
        canAccess: false,
        isLocked: true,
        reason: 'User profile not found'
      };
    }

    const { current_level, tier_type, completed_lessons } = profile;
    const tierConfig = getTierConfig(tier_type as TierType);

    // Check tier restrictions first
    if (levelId > tierConfig.maxLevels) {
      return {
        canAccess: false,
        isLocked: true,
        reason: `Upgrade to ${tier_type === 'free' ? 'Premium' : 'higher tier'} to access this level`,
        tierRestriction: true,
        progressRestriction: false
      };
    }

    // Check if level is completed (always accessible)
    const isCompleted = completed_lessons?.includes(levelId) || false;
    if (isCompleted) {
      return {
        canAccess: true,
        isLocked: false
      };
    }

    // Check progression - user can access current level and below
    const canAccess = levelId <= current_level;
    
    return {
      canAccess,
      isLocked: !canAccess,
      reason: canAccess ? undefined : `Complete level ${levelId - 1} to unlock this level`,
      tierRestriction: false,
      progressRestriction: !canAccess
    };

  } catch (error) {
    console.error('Error checking level access:', error);
    return {
      canAccess: false,
      isLocked: true,
      reason: 'Error checking access'
    };
  }
}

/**
 * Check if user can send AI message (CLIENT-SIDE ONLY)
 * Handles both free (total) and paid (daily) limits
 */
export async function canSendAIMessage(
  userId: string
): Promise<AIMessageCheck> {
  try {
    const supabase = await getClientSupabase();
    
    // Get user profile with AI usage data
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('tier_type, ai_messages_count, ai_daily_reset_at')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return {
        canSend: false,
        remaining: 0,
        limitType: 'none'
      };
    }

    const { tier_type, ai_messages_count, ai_daily_reset_at } = profile;
    const tierConfig = getTierConfig(tier_type as TierType);

    if (tier_type === 'free') {
      // Free tier: total limit
      const remaining = Math.max(0, (tierConfig.aiMessagesTotal || 0) - ai_messages_count);
      return {
        canSend: remaining > 0,
        remaining,
        limitType: 'total'
      };
    } else {
      // Paid tier: daily limit with reset
      let effectiveCount = ai_messages_count;
      let resetAt = ai_daily_reset_at;

      // Check if reset is needed
      if (ai_daily_reset_at) {
        const resetTime = new Date(ai_daily_reset_at);
        const now = new Date();
        
        if (resetTime <= now) {
          // Reset needed - count becomes 0
          effectiveCount = 0;
          resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
        }
      }

      const dailyLimit = tierConfig.aiMessagesDaily || 0;
      const remaining = Math.max(0, dailyLimit - effectiveCount);
      
      return {
        canSend: remaining > 0,
        remaining,
        limitType: 'daily',
        resetAt
      };
    }

  } catch (error) {
    console.error('Error checking AI message limit:', error);
    return {
      canSend: false,
      remaining: 0,
      limitType: 'none'
    };
  }
}

/**
 * Check if user has access to a specific feature (CLIENT-SIDE ONLY)
 */
export async function hasFeature(
  userId: string, 
  feature: TierFeature
): Promise<boolean> {
  try {
    const supabase = await getClientSupabase();
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('tier_type')
      .eq('user_id', userId)
      .single();

    if (error || !profile) {
      return false;
    }

    return tierHasFeature(profile.tier_type as TierType, feature);

  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
}

/**
 * Get comprehensive user access summary (CLIENT-SIDE ONLY)
 * Main function for dashboards and access control
 */
export async function getUserAccessSummary(
  userId: string
): Promise<UserAccessSummary> {
  try {
    const supabase = await getClientSupabase();
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('tier_type')
      .eq('user_id', userId)
      .single();

    if (error || !profile) {
      // Default to free tier if error
      const freeConfig = getTierConfig('free');
      return {
        tierType: 'free',
        maxLevels: freeConfig.maxLevels,
        aiLimit: { canSend: false, remaining: 0, limitType: 'none' },
        features: freeConfig.features,
        canUpgrade: true
      };
    }

    const tierType = profile.tier_type as TierType;
    const tierConfig = getTierConfig(tierType);
    const aiLimit = await canSendAIMessage(userId);

    return {
      tierType,
      maxLevels: tierConfig.maxLevels,
      aiLimit,
      features: tierConfig.features,
      canUpgrade: tierType === 'free'
    };

  } catch (error) {
    console.error('Error getting user access summary:', error);
    // Return safe defaults
    const freeConfig = getTierConfig('free');
    return {
      tierType: 'free',
      maxLevels: freeConfig.maxLevels,
      aiLimit: { canSend: false, remaining: 0, limitType: 'none' },
      features: freeConfig.features,
      canUpgrade: true
    };
  }
}

/**
 * Utility functions for quick checks without database access
 */
export function getTierLimits(tierType: TierType) {
  return getTierConfig(tierType);
}

export function isLevelWithinTierLimits(levelId: number, tierType: TierType): boolean {
  const tierConfig = getTierConfig(tierType);
  return levelId <= tierConfig.maxLevels;
} 