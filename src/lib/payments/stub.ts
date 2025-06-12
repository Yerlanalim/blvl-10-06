import { PaymentProvider, CheckoutSession, SubscriptionStatus, TierType } from './interface';
import { createSPAClient } from '@/lib/supabase/client';

export class PaymentStub implements PaymentProvider {
  private isDev = process.env.NODE_ENV === 'development';

  /**
   * Stub implementation - simulates checkout creation
   */
  async createCheckout(userId: string, tierType: TierType): Promise<CheckoutSession> {
    console.log(`[PaymentStub] Creating checkout for user ${userId}, tier: ${tierType}`);
    
    // Simulate checkout creation
    const checkoutId = `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In dev mode, immediately "complete" the payment and update user tier
    if (this.isDev) {
      await this.updateUserTier(userId, tierType);
    }
    
    return {
      id: checkoutId,
      url: `/upgrade?checkout=${checkoutId}&tier=${tierType}`,
      status: this.isDev ? 'completed' : 'pending'
    };
  }

  /**
   * Stub implementation - simulates subscription cancellation
   */
  async cancelSubscription(userId: string): Promise<void> {
    console.log(`[PaymentStub] Canceling subscription for user ${userId}`);
    
    // Reset to free tier
    await this.updateUserTier(userId, 'free');
  }

  /**
   * Stub implementation - returns mock subscription status
   */
  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus | null> {
    console.log(`[PaymentStub] Getting subscription status for user ${userId}`);
    
    const supabase = createSPAClient();
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('tier_type')
      .eq('user_id', userId)
      .single();
    
    if (!userProfile) return null;
    
    const tierType = userProfile.tier_type as TierType;
    
    if (tierType === 'free') {
      return null; // No subscription for free users
    }
    
    // Mock paid subscription
    return {
      id: `sub_${userId}`,
      status: 'active',
      tierType,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      cancelAtPeriodEnd: false
    };
  }

  /**
   * Update user tier in database
   */
  private async updateUserTier(userId: string, tierType: TierType): Promise<void> {
    const supabase = createSPAClient();
    
    const updates: Record<string, unknown> = {
      tier_type: tierType,
      updated_at: new Date().toISOString()
    };
    
    // Reset AI quota for tier changes
    if (tierType === 'free') {
      updates.ai_messages_count = 0;
      updates.ai_daily_reset_at = null;
    } else if (tierType === 'paid') {
      updates.ai_messages_count = 0;
      updates.ai_daily_reset_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId);
    
    if (error) {
      console.error('[PaymentStub] Error updating user tier:', error);
      throw new Error('Failed to update user tier');
    }
    
    console.log(`[PaymentStub] Successfully updated user ${userId} to ${tierType} tier`);
  }
}

// Export singleton instance
export const paymentProvider = new PaymentStub(); 