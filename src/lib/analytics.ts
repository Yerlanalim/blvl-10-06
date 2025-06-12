import { track } from '@vercel/analytics';

// Event types for type safety
export interface AnalyticsEvent {
  // Learning events
  level_started: {
    level_id: number;
    level_title: string;
    user_tier: 'free' | 'paid';
    previous_level?: number;
  };
  
  lesson_step_completed: {
    level_id: number;
    step_type: 'text' | 'video' | 'test';
    step_order: number;
    time_spent_seconds: number;
    user_tier: 'free' | 'paid';
  };
  
  test_submitted: {
    level_id: number;
    score: number;
    total_questions: number;
    time_spent_seconds: number;
    correct_answers: number;
    skill_category: string;
    user_tier: 'free' | 'paid';
  };
  
  artifact_downloaded: {
    level_id: number;
    artifact_type: string;
    user_tier: 'free' | 'paid';
    unlock_time_seconds: number;
  };
  
  // AI interaction events
  ai_message_sent: {
    message_length: number;
    response_time_ms: number;
    user_tier: 'free' | 'paid';
    remaining_quota: number;
    level_context?: number;
  };
  
  ai_quota_exceeded: {
    user_tier: 'free' | 'paid';
    attempted_messages: number;
    quota_limit: number;
  };
  
  ai_session_duration: {
    duration_minutes: number;
    messages_sent: number;
    user_tier: 'free' | 'paid';
  };
  
  // Conversion events
  upgrade_clicked: {
    source: 'pricing_page' | 'quota_limit' | 'level_locked' | 'navigation';
    user_tier: 'free';
    current_level?: number;
  };
  
  pricing_viewed: {
    source: 'navigation' | 'upgrade_prompt' | 'direct';
    user_tier: 'free' | 'paid';
  };
  
  tier_changed: {
    from_tier: 'free' | 'paid';
    to_tier: 'free' | 'paid';
    change_reason: 'upgrade' | 'downgrade' | 'admin';
  };
  
  // Engagement events
  session_duration: {
    duration_minutes: number;
    pages_visited: number;
    user_tier: 'free' | 'paid';
    actions_performed: number;
  };
  
  page_view: {
    page_path: string;
    referrer?: string;
    user_tier: 'free' | 'paid';
    load_time_ms: number;
  };
  
  return_frequency: {
    days_since_last_visit: number;
    total_visits: number;
    user_tier: 'free' | 'paid';
  };
}

// Performance metrics interface
export interface PerformanceMetrics {
  core_web_vitals: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
  };
  
  api_performance: {
    endpoint: string;
    method: string;
    response_time_ms: number;
    status_code: number;
    error?: string;
  };
  
  database_performance: {
    query_type: string;
    table_name: string;
    execution_time_ms: number;
    rows_affected: number;
  };
  
  client_error: {
    error_message: string;
    error_stack?: string;
    component_name?: string;
    user_agent: string;
    page_url: string;
  };
}

// Session tracking
class SessionTracker {
  private sessionStart: number = Date.now();
  private pageViews: number = 0;
  private actionsPerformed: number = 0;
  private currentPage: string = '';

  startSession() {
    this.sessionStart = Date.now();
    this.pageViews = 0;
    this.actionsPerformed = 0;
  }

  trackPageView(page: string) {
    this.pageViews++;
    this.currentPage = page;
  }

  trackAction() {
    this.actionsPerformed++;
  }

  getSessionData() {
    const duration = Math.round((Date.now() - this.sessionStart) / 1000 / 60); // minutes
    return {
      duration_minutes: duration,
      pages_visited: this.pageViews,
      actions_performed: this.actionsPerformed
    };
  }
}

// Core analytics class
class Analytics {
  private sessionTracker = new SessionTracker();
  private performanceObserver: PerformanceObserver | null = null;

  constructor() {
    // Initialize session tracking
    this.sessionTracker.startSession();
    
    // Setup performance monitoring
    this.initializePerformanceMonitoring();
    
    // Track page visibility changes for session duration
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.trackSessionEnd();
        }
      });
    }
  }

  // Track custom events with type safety
  track<K extends keyof AnalyticsEvent>(
    eventName: K,
    properties: AnalyticsEvent[K],
    metadata?: Record<string, any>
  ) {
    try {
      // Add common metadata
      const enrichedProperties = {
        ...properties,
        timestamp: new Date().toISOString(),
        session_id: this.getSessionId(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        ...metadata
      };

      // Track action for session
      this.sessionTracker.trackAction();

      // Send to Vercel Analytics
      track(eventName, enrichedProperties);

      // Send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, enrichedProperties);
      }

      // Console log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${eventName}:`, enrichedProperties);
      }
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error);
    }
  }

  // Track page views
  trackPageView(page: string, userTier: 'free' | 'paid', loadTime: number = 0) {
    this.sessionTracker.trackPageView(page);
    
    this.track('page_view', {
      page_path: page,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      user_tier: userTier,
      load_time_ms: loadTime
    });
  }

  // Track performance metrics
  trackPerformance(metrics: PerformanceMetrics[keyof PerformanceMetrics], type: keyof PerformanceMetrics) {
    try {
      track(`performance_${type}`, {
        ...metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Analytics] Error tracking performance:', error);
    }
  }

  // Initialize performance monitoring
  private initializePerformanceMonitoring() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals
    this.observeCoreWebVitals();
    
    // Monitor API calls
    this.interceptFetchRequests();
  }

  private observeCoreWebVitals() {
    try {
      // FCP (First Contentful Paint)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
                         this.trackPerformance({
               core_web_vitals: {
                 fcp: entry.startTime,
                 lcp: 0, // Will be updated
                 fid: 0, // Will be updated
                 cls: 0, // Will be updated
                 ttfb: 0 // Will be updated
               }
             }, 'core_web_vitals');
          }
        }
      }).observe({ entryTypes: ['paint'] });

      // LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackPerformance({
          core_web_vitals: {
            fcp: 0,
            lcp: lastEntry.startTime,
            fid: 0,
            cls: 0,
            ttfb: 0
          }
        }, 'core_web_vitals');
      }).observe({ entryTypes: ['largest-contentful-paint'] });

    } catch (error) {
      console.error('[Analytics] Error setting up performance monitoring:', error);
    }
  }

  private interceptFetchRequests() {
    if (typeof window === 'undefined') return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const start = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const end = performance.now();
        
        const url = typeof args[0] === 'string' ? args[0] : args[0].url;
        
        // Only track API calls to our backend
        if (url.startsWith('/api/')) {
          this.trackPerformance({
            api_performance: {
              endpoint: url,
              method: (args[1]?.method || 'GET').toUpperCase(),
              response_time_ms: Math.round(end - start),
              status_code: response.status
            }
          }, 'api_performance');
        }
        
        return response;
      } catch (error) {
        const end = performance.now();
        const url = typeof args[0] === 'string' ? args[0] : args[0].url;
        
        if (url.startsWith('/api/')) {
          this.trackPerformance({
            api_performance: {
              endpoint: url,
              method: (args[1]?.method || 'GET').toUpperCase(),
              response_time_ms: Math.round(end - start),
              status_code: 0,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          }, 'api_performance');
        }
        
        throw error;
      }
    };
  }

  // Track session end
  private trackSessionEnd() {
    const sessionData = this.sessionTracker.getSessionData();
    
    // Don't track very short sessions (less than 10 seconds)
    if (sessionData.duration_minutes < 0.17) return;

    this.track('session_duration', {
      ...sessionData,
      user_tier: 'free' as any // Will be updated with real user tier
    });
  }

  // Get session ID
  private getSessionId(): string {
    if (typeof sessionStorage === 'undefined') return 'unknown';
    
    let sessionId = sessionStorage.getItem('bizlevel_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('bizlevel_session_id', sessionId);
    }
    return sessionId;
  }
}

// Create global analytics instance
export const analytics = new Analytics();

// Convenience functions for common events
export const trackLevelStarted = (levelId: number, levelTitle: string, userTier: 'free' | 'paid', previousLevel?: number) => {
  analytics.track('level_started', {
    level_id: levelId,
    level_title: levelTitle,
    user_tier: userTier,
    previous_level: previousLevel
  });
};

export const trackLessonStepCompleted = (
  levelId: number,
  stepType: 'text' | 'video' | 'test',
  stepOrder: number,
  timeSpent: number,
  userTier: 'free' | 'paid'
) => {
  analytics.track('lesson_step_completed', {
    level_id: levelId,
    step_type: stepType,
    step_order: stepOrder,
    time_spent_seconds: timeSpent,
    user_tier: userTier
  });
};

export const trackTestSubmitted = (
  levelId: number,
  score: number,
  totalQuestions: number,
  timeSpent: number,
  correctAnswers: number,
  skillCategory: string,
  userTier: 'free' | 'paid'
) => {
  analytics.track('test_submitted', {
    level_id: levelId,
    score,
    total_questions: totalQuestions,
    time_spent_seconds: timeSpent,
    correct_answers: correctAnswers,
    skill_category: skillCategory,
    user_tier: userTier
  });
};

export const trackArtifactDownloaded = (
  levelId: number,
  artifactType: string,
  userTier: 'free' | 'paid',
  unlockTime: number
) => {
  analytics.track('artifact_downloaded', {
    level_id: levelId,
    artifact_type: artifactType,
    user_tier: userTier,
    unlock_time_seconds: unlockTime
  });
};

export const trackAIMessageSent = (
  messageLength: number,
  responseTime: number,
  userTier: 'free' | 'paid',
  remainingQuota: number,
  levelContext?: number
) => {
  analytics.track('ai_message_sent', {
    message_length: messageLength,
    response_time_ms: responseTime,
    user_tier: userTier,
    remaining_quota: remainingQuota,
    level_context: levelContext
  });
};

export const trackAIQuotaExceeded = (userTier: 'free' | 'paid', attemptedMessages: number, quotaLimit: number) => {
  analytics.track('ai_quota_exceeded', {
    user_tier: userTier,
    attempted_messages: attemptedMessages,
    quota_limit: quotaLimit
  });
};

export const trackUpgradeClicked = (
  source: 'pricing_page' | 'quota_limit' | 'level_locked' | 'navigation',
  currentLevel?: number
) => {
  analytics.track('upgrade_clicked', {
    source,
    user_tier: 'free',
    current_level: currentLevel
  });
};

export const trackPricingViewed = (
  source: 'navigation' | 'upgrade_prompt' | 'direct',
  userTier: 'free' | 'paid'
) => {
  analytics.track('pricing_viewed', {
    source,
    user_tier: userTier
  });
};

// Track errors
export const trackError = (error: Error, componentName?: string) => {
  analytics.trackPerformance({
    client_error: {
      error_message: error.message,
      error_stack: error.stack,
      component_name: componentName,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      page_url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    }
  }, 'client_error');
};

export default analytics; 