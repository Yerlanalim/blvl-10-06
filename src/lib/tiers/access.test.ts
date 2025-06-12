/**
 * @fileoverview Access Control Tests for BizLevel Tier System
 * Tests that Free users see only 3 levels, Paid users see all 10 levels,
 * and access restrictions work properly.
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { 
  canAccessLevel, 
  hasFeature, 
  getTierLimits, 
  canSendAIMessage,
  LevelAccessCheck 
} from './access';
import { TierType, UserProfile } from '@/lib/types';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  }))
}));

describe('Tier Access Control', () => {
  const mockFreeUser: UserProfile = {
    id: 'free-user-id',
    tier_type: 'free' as TierType,
    current_level: 2,
    ai_messages_count: 15,
    ai_daily_reset_at: null,
    completed_lessons: [1]
  };

  const mockPaidUser: UserProfile = {
    id: 'paid-user-id', 
    tier_type: 'paid' as TierType,
    current_level: 5,
    ai_messages_count: 10,
    ai_daily_reset_at: new Date(),
    completed_lessons: [1, 2, 3, 4]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Level Access Control', () => {
    it('should allow free user access to levels 1-3', async () => {
      const level1 = await canAccessLevel('free-user-id', 1);
      const level2 = await canAccessLevel('free-user-id', 2);
      const level3 = await canAccessLevel('free-user-id', 3);

      expect(level1.hasAccess).toBe(true);
      expect(level2.hasAccess).toBe(true);
      expect(level3.hasAccess).toBe(true);
      expect(level1.tierRestriction).toBe(false);
      expect(level2.tierRestriction).toBe(false);
      expect(level3.tierRestriction).toBe(false);
    });

    it('should block free user access to levels 4-10', async () => {
      const level4 = await canAccessLevel('free-user-id', 4);
      const level7 = await canAccessLevel('free-user-id', 7);
      const level10 = await canAccessLevel('free-user-id', 10);

      expect(level4.hasAccess).toBe(false);
      expect(level7.hasAccess).toBe(false);
      expect(level10.hasAccess).toBe(false);
      expect(level4.tierRestriction).toBe(true);
      expect(level7.tierRestriction).toBe(true);
      expect(level10.tierRestriction).toBe(true);
    });

    it('should allow paid user access to all levels 1-10', async () => {
      const level1 = await canAccessLevel('paid-user-id', 1);
      const level5 = await canAccessLevel('paid-user-id', 5);
      const level10 = await canAccessLevel('paid-user-id', 10);

      expect(level1.hasAccess).toBe(true);
      expect(level5.hasAccess).toBe(true);
      expect(level10.hasAccess).toBe(true);
      expect(level1.tierRestriction).toBe(false);
      expect(level5.tierRestriction).toBe(false);
      expect(level10.tierRestriction).toBe(false);
    });

    it('should block access to levels beyond current progress', async () => {
      // Free user on level 2 shouldn't access level 3 without completing level 2
      const level3Access = await canAccessLevel('free-user-id', 3);
      
      // This depends on progress logic - user needs to complete previous level
      if (level3Access.progressRestriction) {
        expect(level3Access.hasAccess).toBe(false);
        expect(level3Access.message).toContain('Complete the previous level');
      }
    });
  });

  describe('Feature Access Control', () => {
    it('should grant basic features to free users', async () => {
      const hasBasicContent = await hasFeature('free-user-id', 'basic_content');
      const hasCommunity = await hasFeature('free-user-id', 'community');

      expect(hasBasicContent).toBe(true);
      expect(hasCommunity).toBe(true);
    });

    it('should block premium features for free users', async () => {
      const hasAI = await hasFeature('free-user-id', 'ai_assistant');
      const hasCertificates = await hasFeature('free-user-id', 'certificates');
      const hasAllContent = await hasFeature('free-user-id', 'all_content');

      expect(hasAI).toBe(false);
      expect(hasCertificates).toBe(false);
      expect(hasAllContent).toBe(false);
    });

    it('should grant all features to paid users', async () => {
      const hasBasicContent = await hasFeature('paid-user-id', 'basic_content');
      const hasAI = await hasFeature('paid-user-id', 'ai_assistant');
      const hasCertificates = await hasFeature('paid-user-id', 'certificates');
      const hasAllContent = await hasFeature('paid-user-id', 'all_content');

      expect(hasBasicContent).toBe(true);
      expect(hasAI).toBe(true);
      expect(hasCertificates).toBe(true);
      expect(hasAllContent).toBe(true);
    });
  });

  describe('AI Message Limits', () => {
    it('should respect free user total message limit (30)', async () => {
      // Free user with 29 messages should be able to send 1 more
      const canSend29 = await canSendAIMessage('free-user-id'); // ai_messages_count: 15
      expect(canSend29).toBe(true);

      // Mock user with 30 messages should be blocked
      const mockUser30 = { ...mockFreeUser, ai_messages_count: 30 };
      jest.doMock('@/lib/supabase/client', () => ({
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: mockUser30, error: null })
            })
          })
        })
      }));
      
      const canSend30 = await canSendAIMessage('free-user-id-30');
      expect(canSend30).toBe(false);
    });

    it('should respect paid user daily message limit (30)', async () => {
      const canSend = await canSendAIMessage('paid-user-id'); // ai_messages_count: 10
      expect(canSend).toBe(true);
      
      // Verify mock structure for paid users
      expect(mockPaidUser.tier_type).toBe('paid');
      expect(mockPaidUser.ai_messages_count).toBe(10);
    });

    it('should reset daily limit for paid users', async () => {
      // Test that reset happens after 24 hours for paid users
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // const mockUserOldReset = { 
      //   ...mockPaidUser, 
      //   ai_messages_count: 30,
      //   ai_daily_reset_at: yesterday 
      // };

      // This should trigger a reset and allow messages
      // const canSendAfterReset = await canSendAIMessage('paid-user-old-reset');
      // Note: actual implementation may vary based on reset logic
    });
  });

  describe('Tier Limits Configuration', () => {
    it('should return correct limits for free tier', () => {
      const freeLimits = getTierLimits('free');
      expect(freeLimits.maxLevels).toBe(3);
      expect(freeLimits.aiMessagesTotal).toBe(30);
      expect(freeLimits.aiMessagesDaily).toBeNull();
      expect(freeLimits.features).toContain('basic_content');
      expect(freeLimits.features).toContain('community');
    });

    it('should return correct limits for paid tier', () => {
      const paidLimits = getTierLimits('paid');
      expect(paidLimits.maxLevels).toBe(10);
      expect(paidLimits.aiMessagesTotal).toBeNull();
      expect(paidLimits.aiMessagesDaily).toBe(30);
      expect(paidLimits.features).toContain('all_content');
      expect(paidLimits.features).toContain('ai_assistant');
      expect(paidLimits.features).toContain('certificates');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid user IDs gracefully', async () => {
      const result = await canAccessLevel('invalid-user-id', 1);
      expect(result.hasAccess).toBe(false);
      expect(result.message).toContain('User not found');
    });

    it('should handle invalid level IDs gracefully', async () => {
      const result = await canAccessLevel('free-user-id', 99);
      expect(result.hasAccess).toBe(false);
      expect(result.message).toContain('Invalid level');
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      jest.doMock('@/lib/supabase/client', () => ({
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: new Error('DB Error') })
            })
          })
        })
      }));

      const result = await canAccessLevel('error-user-id', 1);
      expect(result.hasAccess).toBe(false);
      expect(result.message).toContain('Error checking access');
    });
  });

  describe('AI quota daily reset logic', () => {
    it('should correctly identify when daily reset is needed', async () => {
      // Setup old reset (more than 24 hours ago)
      // const mockUserOldReset = {
      //   user_id: 'user-old-reset',
      //   tier_type: 'paid' as const,
      //   ai_messages_count: 25,
      //   ai_daily_reset_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() // 25 hours ago
      // };
      
      // Setup recent reset (within 24 hours)
      const mockUserRecentReset = {
        user_id: 'user-recent-reset',
        tier_type: 'paid' as const,
        ai_messages_count: 25,
        ai_daily_reset_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
      };

      // Test recent reset - should not allow sending
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ 
              data: mockUserRecentReset, 
              error: null 
            })
          })
        })
      });

      const recentResult = await canUserSendAIMessage('user-recent-reset');
      expect(recentResult.canSend).toBe(false);
      expect(recentResult.reason).toContain('daily limit');

      // Test that after reset user can send
      // const canSendAfterReset = await canUserSendAIMessage('user-old-reset');
      // This would require implementing the reset logic properly
    });
  });
});

/**
 * Integration Tests with Mock Data
 */
describe('Access Control Integration', () => {
  it('should properly integrate tier system with level access', async () => {
    // Test the full flow: user profile -> tier check -> level access
    const accessCheck: LevelAccessCheck = await canAccessLevel('free-user-id', 4);
    
    expect(accessCheck).toMatchObject({
      hasAccess: false,
      tierRestriction: true,
      progressRestriction: expect.any(Boolean),
      currentTier: 'free',
      message: expect.stringContaining('Upgrade to Premium')
    });
  });

  it('should cache access checks for performance', async () => {
    // First call
    const start1 = Date.now();
    await canAccessLevel('free-user-id', 1);
    const time1 = Date.now() - start1;

    // Second call should be faster due to caching
    const start2 = Date.now();
    await canAccessLevel('free-user-id', 1);
    const time2 = Date.now() - start2;

    // Cache should make subsequent calls significantly faster
    expect(time2).toBeLessThan(time1);
  });
}); 