// Simplified Realtime Manager to prevent subscription conflicts
import { createSPASassClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            'postgres_changes' as any,
            {
              event: config.event,
              schema: 'public',
              table: config.table,
              ...(config.filter && { filter: config.filter })
            },
            config.callback // Direct callback execution - no debouncing
          );

        await channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.debug(`✅ Realtime subscription active: ${channelKey}`);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`❌ Realtime subscription error: ${channelKey}`);
          } else if (status === 'CLOSED') {
            console.debug(`🔒 Realtime subscription closed: ${channelKey}`);
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