export type TierType = 'free' | 'paid';

export interface CheckoutSession {
  id: string;
  url: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface SubscriptionStatus {
  id: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  tierType: TierType;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentProvider {
  /**
   * Create a checkout session for tier upgrade
   */
  createCheckout(userId: string, tierType: TierType): Promise<CheckoutSession>;
  
  /**
   * Cancel user's subscription
   */
  cancelSubscription(userId: string): Promise<void>;
  
  /**
   * Get current subscription status
   */
  getSubscriptionStatus(userId: string): Promise<SubscriptionStatus | null>;
  
  /**
   * Handle webhook events (for real payment providers)
   */
  handleWebhook?(payload: unknown): Promise<void>;
}

export interface PaymentEvent {
  type: 'subscription.created' | 'subscription.updated' | 'subscription.canceled';
  userId: string;
  tierType: TierType;
  subscriptionId: string;
  timestamp: Date;
} 