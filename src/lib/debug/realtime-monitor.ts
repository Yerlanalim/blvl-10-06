// Debug utilities for monitoring realtime subscriptions
import { realtimeManager } from '@/lib/supabase/realtime-manager';

interface SubscriptionStats {
  totalChannels: number;
  subscribersPerTable: Record<string, number>;
  performanceMetrics: {
    averageResponseTime: number;
    errorRate: number;
  };
}

class RealtimeMonitor {
  private responseTimeSamples: number[] = [];
  private errorCount = 0;
  private totalRequests = 0;

  // Get current subscription statistics
  getSubscriptionStats(): SubscriptionStats {
    const totalChannels = realtimeManager.getActiveSubscriptionsCount();
    
    // Get subscribers count for common tables
    const subscribersPerTable = {
      'user_profiles': realtimeManager.getSubscribersCount('user_profiles'),
      'user_progress': realtimeManager.getSubscribersCount('user_progress'),
      'user_artifacts': realtimeManager.getSubscribersCount('user_artifacts'),
    };

    // Calculate performance metrics
    const averageResponseTime = this.responseTimeSamples.length > 0 
      ? this.responseTimeSamples.reduce((a, b) => a + b) / this.responseTimeSamples.length 
      : 0;
    
    const errorRate = this.totalRequests > 0 ? this.errorCount / this.totalRequests : 0;

    return {
      totalChannels,
      subscribersPerTable,
      performanceMetrics: {
        averageResponseTime,
        errorRate
      }
    };
  }

  // Log subscription event (for debugging)
  logSubscriptionEvent(event: string, table: string, userId: string, timestamp = Date.now()): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Realtime] ${event} - Table: ${table}, User: ${userId}, Time: ${timestamp}`);
    }
  }

  // Track response time
  trackResponseTime(responseTime: number): void {
    this.responseTimeSamples.push(responseTime);
    
    // Keep only last 100 samples
    if (this.responseTimeSamples.length > 100) {
      this.responseTimeSamples.shift();
    }
    
    this.totalRequests++;
  }

  // Track error
  trackError(): void {
    this.errorCount++;
    this.totalRequests++;
  }

  // Generate report for debugging
  generateReport(): string {
    const stats = this.getSubscriptionStats();
    
    return `
=== Realtime Subscription Report ===
Total Active Channels: ${stats.totalChannels}

Subscribers by Table:
${Object.entries(stats.subscribersPerTable)
  .map(([table, count]) => `  ${table}: ${count} subscribers`)
  .join('\n')}

Performance Metrics:
  Average Response Time: ${stats.performanceMetrics.averageResponseTime.toFixed(2)}ms
  Error Rate: ${(stats.performanceMetrics.errorRate * 100).toFixed(2)}%
  Total Requests: ${this.totalRequests}

Memory Usage:
  Response Time Samples: ${this.responseTimeSamples.length}/100

Recommendations:
${this.generateRecommendations(stats)}
`;
  }

  // Generate performance recommendations
  private generateRecommendations(stats: SubscriptionStats): string {
    const recommendations: string[] = [];

    if (stats.totalChannels > 10) {
      recommendations.push('⚠️  High number of active channels - consider consolidating subscriptions');
    }

    if (stats.performanceMetrics.errorRate > 0.1) {
      recommendations.push('⚠️  High error rate - check network connectivity and Supabase status');
    }

    if (stats.performanceMetrics.averageResponseTime > 1000) {
      recommendations.push('⚠️  Slow response times - consider implementing local caching');
    }

    const totalSubscribers = Object.values(stats.subscribersPerTable).reduce((a, b) => a + b, 0);
    if (totalSubscribers > 50) {
      recommendations.push('⚠️  High number of total subscribers - review subscription necessity');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All subscription metrics look healthy');
    }

    return recommendations.map(rec => `  ${rec}`).join('\n');
  }

  // Reset all metrics (for testing)
  reset(): void {
    this.responseTimeSamples = [];
    this.errorCount = 0;
    this.totalRequests = 0;
  }

  // Force cleanup (for debugging)
  forceCleanup(): void {
    realtimeManager.cleanup();
    console.debug('[Realtime Monitor] Forced cleanup of all subscriptions');
  }
}

// Export singleton instance
export const realtimeMonitor = new RealtimeMonitor();

// Helper function for development debugging
export function debugRealtimeSubscriptions(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(realtimeMonitor.generateReport());
  }
}

// Performance testing utilities
export async function testRealtimePerformance(iterations = 10): Promise<void> {
  if (process.env.NODE_ENV !== 'development') return;

  console.log(`Testing realtime performance with ${iterations} iterations...`);
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    
    try {
      // Simulate subscription operation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      const responseTime = Date.now() - start;
      realtimeMonitor.trackResponseTime(responseTime);
    } catch (error) {
      realtimeMonitor.trackError();
      console.error('Performance test error:', error);
    }
  }
  
  console.log(realtimeMonitor.generateReport());
} 