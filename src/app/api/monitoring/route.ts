// Monitoring API Route
// Enhanced monitoring endpoint for fix6.6

import { NextResponse } from 'next/server';
import { realtimeMonitor } from '@/lib/monitoring/realtime-monitor';

export async function GET() {
  try {
    const metrics = realtimeMonitor.getMetrics();
    
    const monitoringData = {
      timestamp: new Date().toISOString(),
      realtime: {
        channels: metrics.channels,
        userCount: metrics.userCount,
        totalMessages: metrics.totalMessages,
        avgLatency: Math.round(metrics.avgLatency * 100) / 100, // Round to 2 decimals
        errorRate: Math.round(metrics.errorRate * 100) / 100,
        healthScore: calculateRealtimeHealthScore(metrics)
      },
      system: {
        nodeEnv: process.env.NODE_ENV,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      }
    };

    return NextResponse.json(monitoringData);
  } catch (error) {
    console.error('Failed to get monitoring data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve monitoring data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Calculate health score for realtime system (0-100)
function calculateRealtimeHealthScore(metrics: any): number {
  let score = 100;

  // Penalize high latency
  if (metrics.avgLatency > 1000) score -= 30;
  else if (metrics.avgLatency > 500) score -= 15;

  // Penalize high error rate
  if (metrics.errorRate > 10) score -= 40;
  else if (metrics.errorRate > 5) score -= 20;

  // Penalize if no active channels (system not being used)
  if (metrics.channels.length === 0 && metrics.userCount === 0) score -= 10;

  return Math.max(0, score);
} 