// Health Check API Route
// Enhanced health monitoring for fix6.6

import { NextRequest, NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { realtimeMonitor } from '@/lib/monitoring/realtime-monitor';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceHealth;
    realtime: ServiceHealth;
    ai: ServiceHealth;
    storage: ServiceHealth;
  };
  performance: {
    responseTime: number;
    realtimeLatency: number;
    errorRate: number;
  };
  uptime: number;
}

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  message?: string;
  lastCheck: string;
}

const startTime = Date.now();

// Database health check
async function checkDatabaseHealth(): Promise<ServiceHealth> {
  try {
    const start = Date.now();
    const supabase = await createSSRSassClient();
    
    // Simple query to test connection
    const { error } = await supabase
      .getSupabaseClient()
      .from('levels')
      .select('id')
      .limit(1);

    const latency = Date.now() - start;

    if (error) {
      return {
        status: 'unhealthy',
        latency,
        message: `Database error: ${error.message}`,
        lastCheck: new Date().toISOString()
      };
    }

    return {
      status: latency > 1000 ? 'degraded' : 'healthy',
      latency,
      message: latency > 1000 ? 'High latency detected' : 'Database responsive',
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      lastCheck: new Date().toISOString()
    };
  }
}

// Realtime health check
async function checkRealtimeHealth(): Promise<ServiceHealth> {
  try {
    const metrics = realtimeMonitor.getMetrics();
    const avgLatency = metrics.avgLatency;
    const errorRate = metrics.errorRate;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    let message = 'Realtime functioning normally';

    if (errorRate > 10) {
      status = 'unhealthy';
      message = `High error rate: ${errorRate.toFixed(1)}%`;
    } else if (avgLatency > 1000 || errorRate > 5) {
      status = 'degraded';
      message = `Performance degraded: ${avgLatency.toFixed(1)}ms avg latency, ${errorRate.toFixed(1)}% errors`;
    }

    return {
      status,
      latency: avgLatency,
      message,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Realtime check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      lastCheck: new Date().toISOString()
    };
  }
}

// AI service health check
async function checkAIHealth(): Promise<ServiceHealth> {
  try {
    const start = Date.now();
    
    // Check if required AI environment variables are set
    const requiredVars = [
      'VERTEX_AI_PROJECT_ID',
      'GOOGLE_CLOUD_CLIENT_EMAIL',
      'GOOGLE_CLOUD_PRIVATE_KEY'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return {
        status: 'unhealthy',
        message: `Missing AI config: ${missingVars.join(', ')}`,
        lastCheck: new Date().toISOString()
      };
    }

    const latency = Date.now() - start;

    return {
      status: 'healthy',
      latency,
      message: 'AI service configured',
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `AI check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      lastCheck: new Date().toISOString()
    };
  }
}

// Storage health check
async function checkStorageHealth(): Promise<ServiceHealth> {
  try {
    const start = Date.now();
    const supabase = await createSSRSassClient();
    
    // Test storage connection by listing a bucket
    const { error } = await supabase
      .getSupabaseClient()
      .storage
      .from('public')
      .list('', { limit: 1 });

    const latency = Date.now() - start;

    if (error) {
      return {
        status: 'degraded',
        latency,
        message: `Storage warning: ${error.message}`,
        lastCheck: new Date().toISOString()
      };
    }

    return {
      status: latency > 2000 ? 'degraded' : 'healthy',
      latency,
      message: latency > 2000 ? 'High storage latency' : 'Storage responsive',
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Storage check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      lastCheck: new Date().toISOString()
    };
  }
}

// Calculate overall status
function calculateOverallStatus(services: HealthStatus['services']): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(services).map(s => s.status);
  
  if (statuses.includes('unhealthy')) return 'unhealthy';
  if (statuses.includes('degraded')) return 'degraded';
  return 'healthy';
}

export async function GET(request: NextRequest) {
  const startCheck = Date.now();

  try {
    // Run all health checks in parallel
    const [database, realtime, ai, storage] = await Promise.all([
      checkDatabaseHealth(),
      checkRealtimeHealth(),
      checkAIHealth(),
      checkStorageHealth()
    ]);

    const responseTime = Date.now() - startCheck;
    const realtimeMetrics = realtimeMonitor.getMetrics();

    const services = { database, realtime, ai, storage };
    const overallStatus = calculateOverallStatus(services);

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
      performance: {
        responseTime,
        realtimeLatency: realtimeMetrics.avgLatency,
        errorRate: realtimeMetrics.errorRate
      },
      uptime: Date.now() - startTime
    };

    // Set appropriate HTTP status code
    const httpStatus = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 206 : 503;

    return NextResponse.json(healthStatus, { status: httpStatus });

  } catch (error) {
    const errorResponse: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: { status: 'unhealthy', message: 'Health check failed', lastCheck: new Date().toISOString() },
        realtime: { status: 'unhealthy', message: 'Health check failed', lastCheck: new Date().toISOString() },
        ai: { status: 'unhealthy', message: 'Health check failed', lastCheck: new Date().toISOString() },
        storage: { status: 'unhealthy', message: 'Health check failed', lastCheck: new Date().toISOString() }
      },
      performance: {
        responseTime: Date.now() - startCheck,
        realtimeLatency: 0,
        errorRate: 100
      },
      uptime: Date.now() - startTime
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
} 