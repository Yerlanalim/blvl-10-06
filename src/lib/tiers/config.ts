/**
 * Tier Configuration for BizLevel Educational Platform
 * Centralizes all tier-related settings and limits
 */

import { TierType } from '@/lib/types';

export type TierFeature = 
  | 'basic_content' 
  | 'all_content' 
  | 'ai_assistant' 
  | 'certificates' 
  | 'community';

export interface TierConfig {
  name: string;
  maxLevels: number;
  aiMessagesTotal: number | null; // null means unlimited/not applicable
  aiMessagesDaily: number | null; // null means no daily limit
  features: TierFeature[];
}

export interface TierConfigurations {
  free: TierConfig;
  paid: TierConfig;
}

/**
 * Main tier configuration object
 * Based on requirements from stage5-tasks.md
 */
export const TIERS: TierConfigurations = {
  free: {
    name: 'Free',
    maxLevels: 3,
    aiMessagesTotal: 30,
    aiMessagesDaily: null, // No daily reset for free users
    features: ['basic_content', 'community']
  },
  paid: {
    name: 'Premium',
    maxLevels: 10,
    aiMessagesTotal: null, // No total limit for paid users
    aiMessagesDaily: 30, // 30 messages per day with reset
    features: ['all_content', 'ai_assistant', 'certificates']
  }
} as const;

/**
 * Get tier configuration by type
 */
export function getTierConfig(tierType: TierType): TierConfig {
  return TIERS[tierType];
}

/**
 * Get all available tiers
 */
export function getAllTiers(): TierConfigurations {
  return TIERS;
}

/**
 * Check if a tier has a specific feature
 */
export function tierHasFeature(tierType: TierType, feature: TierFeature): boolean {
  return TIERS[tierType].features.includes(feature);
}

/**
 * Get tier limits for quick access
 */
export function getTierLimits(tierType: TierType) {
  const config = TIERS[tierType];
  return {
    maxLevels: config.maxLevels,
    aiMessagesTotal: config.aiMessagesTotal,
    aiMessagesDaily: config.aiMessagesDaily,
    name: config.name
  };
}

/**
 * Compare tiers (useful for upgrade prompts)
 */
export function compareTiers() {
  return {
    free: TIERS.free,
    paid: TIERS.paid,
    differences: {
      levelsIncreaseBy: TIERS.paid.maxLevels - TIERS.free.maxLevels,
      aiMessagesUpgrade: TIERS.paid.aiMessagesDaily ? 'Daily limit instead of total' : 'Unlimited',
      additionalFeatures: TIERS.paid.features.filter(f => !TIERS.free.features.includes(f))
    }
  };
} 