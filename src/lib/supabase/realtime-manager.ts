// Simplified Realtime Manager to prevent subscription conflicts
// Enhanced with performance monitoring for fix6.6
import { createSPASassClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { realtimeMonitor } from '@/lib/monitoring/realtime-monitor';

interface SubscriptionConfig {
  table: string;
  event: string;
  filter?: string;
  callback: () => void;
}

interface ChannelInfo {
  channel: RealtimeChannel;
  subscribers: Set<string>;
  config: SubscriptionConfig;
}

class RealtimeManager {
  private channels = new Map<string, ChannelInfo>();

  // Simplified channel key generation
  private getChannelKey(table: string, filter?: string): string {
    return filter ? `${table}-${filter}` : table;
  }

  // Subscribe to realtime changes with simplified logic
  async subscribe(
    userId: string,
    config: SubscriptionConfig,
    subscriberId: string
  ): Promise<() => void> {
    const startTime = Date.now();
    const channelKey = this.getChannelKey(config.table, config.filter);

    try {
      // Check if channel already exists
      let channelInfo = this.channels.get(channelKey);

      if (!channelInfo) {
        // Create new channel with unique timestamp
        const sassClient = await createSPASassClient();
        const supabase = sassClient.getSupabaseClient();

        const channel = supabase
          .channel(`realtime-${channelKey}-${Date.now()}`)
          .on(
            'postgres_changes',
            {
              event: config.event as any,
              schema: 'public',
              table: config.table,
              ...(config.filter && { filter: config.filter })
            },
            (payload: any) => {
              const messageStart = Date.now();
              try {
                config.callback();
                // Record successful message processing
                realtimeMonitor.recordMessage(channelKey, subscriberId, Date.now() - messageStart);
              } catch (error) {
                // Record callback error
                realtimeMonitor.recordError(channelKey, subscriberId, error as Error);
                console.error(`❌ Callback error in ${channelKey}:`, error);
              }
            }
          );

        await channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.debug(`✅ Realtime subscription active: ${channelKey}`);
            // Record successful subscription
            realtimeMonitor.recordSubscription(channelKey, subscriberId, Date.now() - startTime);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`❌ Realtime subscription error: ${channelKey}`);
            realtimeMonitor.recordError(channelKey, subscriberId, new Error('Channel subscription error'));
          } else if (status === 'CLOSED') {
            console.debug(`🔒 Realtime subscription closed: ${channelKey}`);
            realtimeMonitor.recordConnectionDrop(subscriberId);
          }
        });

        channelInfo = {
          channel,
          subscribers: new Set(),
          config
        };

        this.channels.set(channelKey, channelInfo);
        console.debug(`📡 Created new realtime channel: ${channelKey}`);
      }

      // Add subscriber with logging
      channelInfo.subscribers.add(subscriberId);
      console.debug(`👤 Added subscriber ${subscriberId} to ${channelKey}, total: ${channelInfo.subscribers.size}`);

      // Return unsubscribe function
      return () => {
        this.unsubscribe(channelKey, subscriberId);
      };

    } catch (error) {
      console.error(`❌ Failed to setup realtime subscription for ${channelKey}:`, error);
      // Record subscription failure
      realtimeMonitor.recordError(channelKey, subscriberId, error as Error);
      // Return noop unsubscribe function
      return () => {};
    }
  }

  // Simplified unsubscribe from realtime changes
  private unsubscribe(channelKey: string, subscriberId: string): void {
    const channelInfo = this.channels.get(channelKey);
    if (!channelInfo) {
      console.warn(`⚠️ Tried to unsubscribe from non-existent channel: ${channelKey}`);
      return;
    }

    // Remove subscriber
    channelInfo.subscribers.delete(subscriberId);
    console.debug(`👤 Removed subscriber ${subscriberId} from ${channelKey}, remaining: ${channelInfo.subscribers.size}`);

    // If no more subscribers, cleanup channel
    if (channelInfo.subscribers.size === 0) {
      try {
        channelInfo.channel.unsubscribe();
        console.debug(`🧹 Cleaned up realtime channel: ${channelKey}`);
      } catch (error) {
        console.error(`❌ Error unsubscribing from channel ${channelKey}:`, error);
      }

      this.channels.delete(channelKey);
    }
  }

  // Get active subscriptions count (for debugging)
  getActiveSubscriptionsCount(): number {
    return this.channels.size;
  }

  // Get subscribers count for a channel (for debugging)
  getSubscribersCount(table: string, filter?: string): number {
    const channelKey = this.getChannelKey(table, filter);
    const channelInfo = this.channels.get(channelKey);
    return channelInfo ? channelInfo.subscribers.size : 0;
  }

  // Force cleanup all subscriptions (for testing/development)
  cleanup(): void {
    console.debug(`🧹 Cleaning up ${this.channels.size} realtime channels`);
    
    this.channels.forEach((channelInfo, channelKey) => {
      try {
        channelInfo.channel.unsubscribe();
        console.debug(`🧹 Cleaned up channel: ${channelKey}`);
      } catch (error) {
        console.error(`❌ Error cleaning up channel ${channelKey}:`, error);
      }
    });

    this.channels.clear();
    console.debug(`✅ All realtime channels cleaned up`);
  }
}

// Singleton instance
const realtimeManager = new RealtimeManager();

export { realtimeManager };
export type { SubscriptionConfig }; 