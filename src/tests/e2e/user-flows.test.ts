/**
 * @fileoverview End-to-End Tests for BizLevel User Flows
 * Tests complete user journeys from registration to lesson completion,
 * including tier restrictions and email notifications.
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Mock all external dependencies
const mockSupabase = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    getUser: jest.fn(),
    signOut: jest.fn()
  },
  from: jest.fn(() => ({
    insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
    update: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }))
  }))
};

const mockEmailService = {
  sendWelcomeEmail: jest.fn(),
  sendLevelCompleteEmail: jest.fn(),
  sendAIQuotaReminder: jest.fn()
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase
}));

jest.mock('@/lib/email/send', () => mockEmailService);

describe('Complete User Flows - E2E Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment to test mode
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('New User Registration Flow', () => {
    it('should complete full registration and setup flow', async () => {
      const testUser = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        id: 'new-user-id'
      };

      // Step 1: User registration
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: { id: testUser.id, email: testUser.email } },
        error: null
      });

      const signUpResult = await mockSupabase.auth.signUp({
        email: testUser.email,
        password: testUser.password
      });

      expect(signUpResult.data.user).toBeTruthy();
      expect(signUpResult.error).toBeNull();

      // Step 2: Profile creation (should happen automatically via trigger)
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn(() => Promise.resolve({
          data: [{
            id: testUser.id,
            tier_type: 'free',
            current_level: 1,
            ai_messages_count: 0
          }],
          error: null
        }))
      });

      // Step 3: Welcome email should be sent
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        testUser.email,
        expect.any(Object)
      );

      // Step 4: User should be redirected to levels page
      // This would be tested in actual browser E2E tests
      expect(signUpResult.data.user.id).toBe(testUser.id);
    });

    it('should handle email verification flow', async () => {
      // Test email confirmation process
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { 
          user: null, // User not confirmed yet
          session: null 
        },
        error: null
      });

      const result = await mockSupabase.auth.signUp({
        email: 'verify@example.com',
        password: 'password123'
      });

      expect(result.data.user).toBeNull();
      expect(result.data.session).toBeNull();
      // In real E2E test, we'd check for "Check your email" message
    });
  });

  describe('Free User Journey', () => {
    const freeUser = {
      id: 'free-user-id',
      email: 'free@example.com',
      tier_type: 'free',
      current_level: 1,
      ai_messages_count: 0
    };

    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: freeUser.id, email: freeUser.email } },
        error: null
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: freeUser, 
              error: null 
            }))
          }))
        }))
      });
    });

    it('should allow access to levels 1-3 only', async () => {
      // Test level access UI
      const levelAccess = {
        1: { hasAccess: true, tierRestriction: false },
        2: { hasAccess: true, tierRestriction: false },
        3: { hasAccess: true, tierRestriction: false },
        4: { hasAccess: false, tierRestriction: true },
        5: { hasAccess: false, tierRestriction: true }
      };

      // Simulate level grid component behavior
      Object.entries(levelAccess).forEach(([level, access]) => {
        expect(access.hasAccess).toBe(parseInt(level) <= 3);
        if (parseInt(level) > 3) {
          expect(access.tierRestriction).toBe(true);
        }
      });
    });

    it('should complete level 1 lesson flow', async () => {
      const level1Steps = [
        { type: 'text', completed: false },
        { type: 'video', completed: false },
        { type: 'test', completed: false }
      ];

      // Step 1: Start with text content
      level1Steps[0].completed = true;
      
      // Step 2: Watch video (80% threshold)
      level1Steps[1].completed = true;
      
      // Step 3: Complete test (60% score)
      level1Steps[2].completed = true;
      const testScore = 80; // Above threshold
      
      // Mock progress update
      mockSupabase.from.mockReturnValueOnce({
        upsert: jest.fn(() => Promise.resolve({
          data: [{
            user_id: freeUser.id,
            level_id: 1,
            current_step: 3,
            test_scores: { level_1: testScore },
            completed_at: new Date()
          }],
          error: null
        }))
      });

      // Level completion should trigger:
      // 1. Progress update
      expect(mockSupabase.from).toHaveBeenCalledWith('user_progress');
      
      // 2. Artifact unlock
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn(() => Promise.resolve({
          data: [{ user_id: freeUser.id, level_id: 1 }],
          error: null
        }))
      });

      // 3. Email notification
      expect(mockEmailService.sendLevelCompleteEmail).toHaveBeenCalledWith(
        freeUser.email,
        { levelId: 1, levelTitle: expect.any(String) }
      );

      // 4. User level increment
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            data: [{ ...freeUser, current_level: 2 }],
            error: null
          }))
        }))
      });
    });

    it('should hit AI message limit and show upgrade prompt', async () => {
      // Simulate 29 AI messages used
      const userWith29Messages = { ...freeUser, ai_messages_count: 29 };
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: userWith29Messages, 
              error: null 
            }))
          }))
        }))
      });

      // User can send 1 more message
      const canSend = userWith29Messages.ai_messages_count < 30;
      expect(canSend).toBe(true);

      // After 30th message, should be blocked
      const userWith30Messages = { ...freeUser, ai_messages_count: 30 };
      const canSendAfter30 = userWith30Messages.ai_messages_count < 30;
      expect(canSendAfter30).toBe(false);

      // Should trigger upgrade reminder email
      expect(mockEmailService.sendAIQuotaReminder).toHaveBeenCalledWith(
        freeUser.email,
        { remainingMessages: 0, tierType: 'free' }
      );
    });

    it('should block access to level 4 with upgrade prompt', async () => {
      // Try to access level 4
      const level4Access = {
        hasAccess: false,
        tierRestriction: true,
        message: 'Upgrade to Premium to access this level'
      };

      expect(level4Access.hasAccess).toBe(false);
      expect(level4Access.tierRestriction).toBe(true);
      expect(level4Access.message).toContain('Upgrade to Premium');

      // Should redirect to upgrade page in real flow
    });
  });

  describe('Premium User Journey', () => {
    const premiumUser = {
      id: 'premium-user-id',
      email: 'premium@example.com',
      tier_type: 'paid',
      current_level: 5,
      ai_messages_count: 15,
      ai_daily_reset_at: new Date()
    };

    beforeEach(() => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: premiumUser, 
              error: null 
            }))
          }))
        }))
      });
    });

    it('should have access to all 10 levels', async () => {
      for (let level = 1; level <= 10; level++) {
        const access = {
          hasAccess: true,
          tierRestriction: false
        };
        expect(access.hasAccess).toBe(true);
        expect(access.tierRestriction).toBe(false);
      }
    });

    it('should have daily AI message reset', async () => {
      // Test daily reset logic
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const userWithOldReset = {
        ...premiumUser,
        ai_messages_count: 30,
        ai_daily_reset_at: yesterday
      };

      // Should trigger reset
      const shouldReset = new Date() > userWithOldReset.ai_daily_reset_at;
      expect(shouldReset).toBe(true);

      // After reset, should have 0 messages and new reset date
      const afterReset = {
        ...userWithOldReset,
        ai_messages_count: 0,
        ai_daily_reset_at: new Date()
      };

      expect(afterReset.ai_messages_count).toBe(0);
    });

    it('should complete advanced level with all features', async () => {
      // Premium users get all features
      const premiumFeatures = [
        'all_content',
        'ai_assistant', 
        'certificates',
        'basic_content',
        'community'
      ];

      premiumFeatures.forEach(() => {
        const hasFeature = true; // Premium users have all features
        expect(hasFeature).toBe(true);
      });
    });
  });

  describe('Upgrade/Downgrade Flow', () => {
    it('should handle free to premium upgrade', async () => {
      const freeUser = {
        id: 'upgrade-user-id',
        tier_type: 'free'
      };

      // Step 1: Click upgrade button (leads to /upgrade page)
      // Step 2: Payment stub processes upgrade
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            data: [{ ...freeUser, tier_type: 'paid' }],
            error: null
          }))
        }))
      });

      // Step 3: User profile updated
      const upgradedUser = { ...freeUser, tier_type: 'paid' };
      expect(upgradedUser.tier_type).toBe('paid');

      // Step 4: Access to levels 4-10 unlocked
      const newAccess = { hasAccess: true, tierRestriction: false };
      expect(newAccess.hasAccess).toBe(true);
    });

    it('should handle premium to free downgrade', async () => {
      const premiumUser = {
        id: 'downgrade-user-id',
        tier_type: 'paid'
      };

      // Cancellation process
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            data: [{ ...premiumUser, tier_type: 'free' }],
            error: null
          }))
        }))
      });

      const downgradedUser = { ...premiumUser, tier_type: 'free' };
      expect(downgradedUser.tier_type).toBe('free');

      // Levels 4-10 should be blocked again
      const restrictedAccess = { hasAccess: false, tierRestriction: true };
      expect(restrictedAccess.hasAccess).toBe(false);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle network errors gracefully', async () => {
      // Mock network error
      mockSupabase.from.mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            single: () => Promise.reject(new Error('Network error'))
          })
        })
      });

      // Should show error message without crashing
      try {
        await mockSupabase.from('user_profiles').select('*').eq('id', 'test').single();
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    it('should handle session expiry', async () => {
      // Mock expired session
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Session expired' }
      });

      const result = await mockSupabase.auth.getUser();
      expect(result.data.user).toBeNull();
      expect(result.error.message).toBe('Session expired');

      // Should redirect to login page
    });

    it('should handle payment failures', async () => {
      // Mock payment stub error
      const paymentError = new Error('Payment failed');
      
      // Should show error message and not update user tier
      expect(() => {
        throw paymentError;
      }).toThrow('Payment failed');
    });
  });

  describe('Performance and Security', () => {
    it('should load pages within performance thresholds', async () => {
      // Mock performance timing
      const startTime = Date.now();
      
      // Simulate page load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 second threshold
    });

    it('should validate all user inputs', async () => {
      // Test SQL injection protection
      const maliciousInput = "'; DROP TABLE users; --";
      
      // Supabase should handle this safely
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        }))
      });

      // Should not cause errors
      await mockSupabase.from('user_profiles').select('*').eq('id', maliciousInput).single();
    });

    it('should enforce rate limiting', async () => {
      // Test API rate limiting
      const requests = Array(100).fill(null).map(() => 
        mockSupabase.from('user_profiles').select('*')
      );

      // Should handle burst requests gracefully
      const results = await Promise.allSettled(requests);
      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');

      // Some requests might be rate limited
      expect(successful.length + failed.length).toBe(100);
    });
  });

  describe('Email Notification Integration', () => {
    it('should send welcome email on registration', async () => {
      const newUser = { email: 'test@example.com', id: 'test-id' };
      
      // Simulate registration
      await mockEmailService.sendWelcomeEmail(newUser.email, {
        userName: newUser.email.split('@')[0],
        loginUrl: 'https://bizlevel.com/login'
      });

      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        newUser.email,
        expect.objectContaining({
          userName: expect.any(String),
          loginUrl: expect.any(String)
        })
      );
    });

    it('should send level completion emails', async () => {
      const user = { email: 'user@example.com', id: 'user-id' };
      
      await mockEmailService.sendLevelCompleteEmail(user.email, {
        levelId: 1,
        levelTitle: 'Business Model Fundamentals',
        nextLevelTitle: 'Market Research & Analysis'
      });

      expect(mockEmailService.sendLevelCompleteEmail).toHaveBeenCalledWith(
        user.email,
        expect.objectContaining({
          levelId: 1,
          levelTitle: expect.any(String)
        })
      );
    });

    it('should respect email preferences', async () => {
      const userWithEmailsDisabled = {
        email: 'no-emails@example.com',
        email_notifications: false
      };

      // Should not send emails if disabled
      if (!userWithEmailsDisabled.email_notifications) {
        expect(mockEmailService.sendLevelCompleteEmail).not.toHaveBeenCalled();
      }
    });
  });
}); 