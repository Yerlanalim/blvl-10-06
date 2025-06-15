// Realtime Performance Monitor
// Enhanced monitoring for fix6.6 - comprehensive real-time performance tracking

interface RealtimeMetrics {
  subscriptionTime: number;
  messageLatency: number;
  connectionDrops: number;
  lastActivity: number;
  totalMessages: number;
  errorRate: number;
}

interface ChannelMetrics {
  channelKey: string;
  subscriberCount: number;
  createdAt: number;
  lastMessageAt: number;
  messageCount: number;
  errorCount: number;
  avgLatency: number;
}

class RealtimePerformanceMonitor {
  private metrics: Map<string, RealtimeMetrics> = new Map();
  private channelMetrics: Map<string, ChannelMetrics> = new Map();
  private performanceEntries: Array<{ timestamp: number; event: string; duration: number }> = [];
  private monitoring = false;
  private reportInterval: NodeJS.Timeout | null = null;

  startMonitoring(): void {
    if (this.monitoring) return;
    
    this.monitoring = true;
    console.debug('🔍 Realtime Performance Monitor started');

    // Performance reporting every 2 minutes in development
    if (process.env.NODE_ENV === 'development') {
      this.reportInterval = setInterval(() => {
        this.generatePerformanceReport();
      }, 120000); // 2 minutes
    }
  }

  stopMonitoring(): void {
    this.monitoring = false;
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = null;
    }
    console.debug('🔍 Realtime Performance Monitor stopped');
  }

  // Track subscription performance
  recordSubscription(channelKey: string, subscriberId: string, duration: number): void {
    if (!this.monitoring) return;

    const now = Date.now();
    
    // Update user-specific metrics
    if (!this.metrics.has(subscriberId)) {
      this.metrics.set(subscriberId, {
        subscriptionTime: duration,
        messageLatency: 0,
        connectionDrops: 0,
        lastActivity: now,
        totalMessages: 0,
        errorRate: 0
      });
    }

    // Update channel-specific metrics
    if (!this.channelMetrics.has(channelKey)) {
      this.channelMetrics.set(channelKey, {
        channelKey,
        subscriberCount: 1,
        createdAt: now,
        lastMessageAt: now,
        messageCount: 0,
        errorCount: 0,
        avgLatency: duration
      });
    } else {
      const channelData = this.channelMetrics.get(channelKey)!;
      channelData.subscriberCount++;
      channelData.avgLatency = (channelData.avgLatency + duration) / 2;
      this.channelMetrics.set(channelKey, channelData);
    }

    this.performanceEntries.push({
      timestamp: now,
      event: `subscription-${channelKey}`,
      duration
    });

    // Keep only last 100 entries
    if (this.performanceEntries.length > 100) {
      this.performanceEntries = this.performanceEntries.slice(-100);
    }
  }

  // Track message received performance
  recordMessage(channelKey: string, subscriberId: string, latency: number): void {
    if (!this.monitoring) return;

    const now = Date.now();

    // Update user metrics
    const userMetrics = this.metrics.get(subscriberId);
    if (userMetrics) {
      userMetrics.messageLatency = (userMetrics.messageLatency + latency) / 2;
      userMetrics.lastActivity = now;
      userMetrics.totalMessages++;
      this.metrics.set(subscriberId, userMetrics);
    }

    // Update channel metrics
    const channelData = this.channelMetrics.get(channelKey);
    if (channelData) {
      channelData.lastMessageAt = now;
      channelData.messageCount++;
      channelData.avgLatency = (channelData.avgLatency + latency) / 2;
      this.channelMetrics.set(channelKey, channelData);
    }
  }

  // Track errors
  recordError(channelKey: string, subscriberId: string, error: Error): void {
    if (!this.monitoring) return;

    console.error(`❌ Realtime error in ${channelKey} for ${subscriberId}:`, error);

    // Update user error rate
    const userMetrics = this.metrics.get(subscriberId);
    if (userMetrics) {
      userMetrics.errorRate++;
      this.metrics.set(subscriberId, userMetrics);
    }

    // Update channel error count
    const channelData = this.channelMetrics.get(channelKey);
    if (channelData) {
      channelData.errorCount++;
      this.channelMetrics.set(channelKey, channelData);
    }
  }

  // Track connection drops
  recordConnectionDrop(subscriberId: string): void {
    if (!this.monitoring) return;

    const userMetrics = this.metrics.get(subscriberId);
    if (userMetrics) {
      userMetrics.connectionDrops++;
      this.metrics.set(subscriberId, userMetrics);
    }
  }

  // Generate comprehensive performance report
  private generatePerformanceReport(): void {
    if (this.metrics.size === 0 && this.channelMetrics.size === 0) return;

    console.group('📊 Realtime Performance Report');
    
    // Channel performance summary
    console.log('📡 Channel Performance:');
    this.channelMetrics.forEach((channel, key) => {
      const healthScore = this.calculateChannelHealth(channel);
      console.log(`  ${key}: ${channel.subscriberCount} subs, ${channel.messageCount} msgs, ${channel.avgLatency.toFixed(1)}ms avg, Health: ${healthScore}/10`);
    });

    // User performance summary
    console.log('\n👥 User Performance:');
    let totalUsers = 0;
    let totalMessages = 0;
    let avgLatency = 0;
    let totalErrors = 0;

    this.metrics.forEach((metrics, userId) => {
      totalUsers++;
      totalMessages += metrics.totalMessages;
      avgLatency += metrics.messageLatency;
      totalErrors += metrics.errorRate;
    });

    if (totalUsers > 0) {
      console.log(`  Total Users: ${totalUsers}`);
      console.log(`  Total Messages: ${totalMessages}`);
      console.log(`  Average Latency: ${(avgLatency / totalUsers).toFixed(1)}ms`);
      console.log(`  Error Rate: ${((totalErrors / totalMessages) * 100).toFixed(2)}%`);
    }

    // Performance recommendations
    this.generateRecommendations();
    
    console.groupEnd();
  }

  // Calculate channel health score (0-10)
  private calculateChannelHealth(channel: ChannelMetrics): number {
    let score = 10;

    // Penalize high latency
    if (channel.avgLatency > 1000) score -= 3;
    else if (channel.avgLatency > 500) score -= 1;

    // Penalize high error rate
    const errorRate = channel.errorCount / Math.max(channel.messageCount, 1);
    if (errorRate > 0.1) score -= 4;
    else if (errorRate > 0.05) score -= 2;

    // Penalize old channels with no activity
    const timeSinceLastMessage = Date.now() - channel.lastMessageAt;
    if (timeSinceLastMessage > 300000) score -= 2; // 5 minutes

    return Math.max(0, score);
  }

  // Generate performance recommendations
  private generateRecommendations(): void {
    const recommendations: string[] = [];

    // Check for high latency channels
    this.channelMetrics.forEach((channel, key) => {
      if (channel.avgLatency > 1000) {
        recommendations.push(`⚠️ High latency detected in ${key} (${channel.avgLatency.toFixed(1)}ms)`);
      }
    });

    // Check for high error rates
    this.metrics.forEach((metrics, userId) => {
      if (metrics.errorRate > 5) {
        recommendations.push(`⚠️ High error rate for user ${userId} (${metrics.errorRate} errors)`);
      }
    });

    if (recommendations.length > 0) {
      console.log('\n🎯 Recommendations:');
      recommendations.forEach(rec => console.log(`  ${rec}`));
    }
  }

  // Get current metrics for external monitoring
  getMetrics(): {
    channels: Array<ChannelMetrics>;
    userCount: number;
    totalMessages: number;
    avgLatency: number;
    errorRate: number;
  } {
    const channels = Array.from(this.channelMetrics.values());
    const userCount = this.metrics.size;
    
    let totalMessages = 0;
    let totalLatency = 0;
    let totalErrors = 0;

    this.metrics.forEach(metrics => {
      totalMessages += metrics.totalMessages;
      totalLatency += metrics.messageLatency;
      totalErrors += metrics.errorRate;
    });

    return {
      channels,
      userCount,
      totalMessages,
      avgLatency: userCount > 0 ? totalLatency / userCount : 0,
      errorRate: totalMessages > 0 ? (totalErrors / totalMessages) * 100 : 0
    };
  }

  // Force cleanup
  cleanup(): void {
    this.metrics.clear();
    this.channelMetrics.clear();
    this.performanceEntries = [];
    this.stopMonitoring();
  }
}

// Singleton instance
const realtimeMonitor = new RealtimePerformanceMonitor();

export { realtimeMonitor };
export type { RealtimeMetrics, ChannelMetrics }; 