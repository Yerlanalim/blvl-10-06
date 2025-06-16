// Error Prevention System for Development
// Monitors and prevents common issues from returning

interface ErrorReport {
  type: 'hydration' | 'realtime' | 'performance' | 'network';
  component?: string;
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorPreventionSystem {
  private errors: ErrorReport[] = [];
  private monitoring = false;
  private reportInterval: NodeJS.Timeout | null = null;

  // Start monitoring for development
  startMonitoring() {
    if (process.env.NODE_ENV !== 'development') return;
    
    if (this.monitoring) {
      console.debug('🛡️ Error Prevention System already running');
      return;
    }

    this.monitoring = true;
    console.log('🛡️ Error Prevention System started (single instance)');

    this.setupHydrationMonitor();
    this.setupRealtimeMonitor();
    this.setupPerformanceMonitor();
    this.setupNetworkMonitor();

    // Report summary every 10 minutes (optimized for dev comfort)
    this.reportInterval = setInterval(() => {
      this.generateReport();
    }, 600000); // 10 minutes
  }

  // Monitor hydration mismatches
  private setupHydrationMonitor() {
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      
      if (message.includes('Hydration failed') || message.includes("didn't match")) {
        this.reportError({
          type: 'hydration',
          message: 'Hydration mismatch detected',
          timestamp: Date.now(),
          severity: 'critical'
        });
      }
      
      originalError.apply(console, args);
    };
  }

  // Monitor realtime subscription conflicts
  private setupRealtimeMonitor() {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      
      if (message.includes('tried to subscribe multiple times')) {
        this.reportError({
          type: 'realtime',
          message: 'Multiple subscription attempt detected',
          timestamp: Date.now(),
          severity: 'high'
        });
      }
      
      originalWarn.apply(console, args);
    };
  }

  // Monitor performance issues
  private setupPerformanceMonitor() {
    // Monitor compilation times
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 3000) { // More than 3 seconds
            this.reportError({
              type: 'performance',
              message: `Slow operation: ${entry.name} took ${entry.duration}ms`,
              timestamp: Date.now(),
              severity: 'medium'
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }

  // Monitor network issues (431 errors)
  private setupNetworkMonitor() {
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        try {
          const response = await originalFetch(...args);
          
          if (response.status === 431) {
            this.reportError({
              type: 'network',
              message: `HTTP 431 error on ${args[0]}`,
              timestamp: Date.now(),
              severity: 'high'
            });
          }
          
          return response;
        } catch (error) {
          return originalFetch(...args);
        }
      };
    }
  }

  // Report an error
  private reportError(error: ErrorReport) {
    this.errors.push(error);
    
    // Immediate critical alerts
    if (error.severity === 'critical') {
      console.warn(`🚨 CRITICAL ERROR DETECTED: ${error.message}`);
      console.warn('This error was previously fixed. Check your recent changes.');
    }
  }

  // Generate periodic report
  private generateReport() {
    const recentErrors = this.errors.filter(
      error => Date.now() - error.timestamp < 300000 // Last 5 minutes
    );

    if (recentErrors.length === 0) return;

    console.group('🛡️ Error Prevention Report (Last 5m)');
    
    const errorsByType = recentErrors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(errorsByType).forEach(([type, count]) => {
      console.log(`${type}: ${count} occurrences`);
    });

    // Recommendations
    console.group('📋 Recommendations:');
    if (errorsByType.hydration) {
      console.log('• Check for server/client rendering differences');
      console.log('• Add suppressHydrationWarning where needed');
    }
    if (errorsByType.realtime) {
      console.log('• Review realtime subscription cleanup');
      console.log('• Check for duplicate useEffect dependencies');
    }
    if (errorsByType.performance) {
      console.log('• Optimize slow components');
      console.log('• Consider code splitting');
    }
    if (errorsByType.network) {
      console.log('• Check Next.js webpack configuration');
      console.log('• Reduce error stack trace size');
    }
    console.groupEnd();
    console.groupEnd();

    // Clear old errors
    this.errors = this.errors.filter(
      error => Date.now() - error.timestamp < 300000 // Keep 5 minutes
    );
  }

  // Get current status
  getStatus() {
    const now = Date.now();
    const recentErrors = this.errors.filter(error => now - error.timestamp < 60000);
    
    return {
      monitoring: this.monitoring,
      totalErrors: this.errors.length,
      recentErrors: recentErrors.length,
      criticalErrors: recentErrors.filter(e => e.severity === 'critical').length,
      lastError: this.errors[this.errors.length - 1] || null
    };
  }

  // Stop monitoring
  stopMonitoring() {
    this.monitoring = false;
    this.errors = [];
    
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = null;
      console.debug('🛡️ Error Prevention System cleanup completed');
    }
    
    console.log('🛡️ Error Prevention System stopped');
  }
}

// Singleton instance
const errorPreventionSystem = new ErrorPreventionSystem();

// NOTE: Auto-start removed to prevent double initialization
// System is started manually from layout.tsx

// Initialize monitoring systems when Error Prevention System starts
import { realtimeMonitor } from '@/lib/monitoring/realtime-monitor';

// Enhanced startup for fix6.6.2
const originalStart = errorPreventionSystem.startMonitoring.bind(errorPreventionSystem);
errorPreventionSystem.startMonitoring = function() {
  originalStart();
  
  // Start realtime performance monitoring
  realtimeMonitor.startMonitoring();
  console.debug('🔍 Enhanced monitoring systems activated');
};

export { errorPreventionSystem };
export type { ErrorReport }; 