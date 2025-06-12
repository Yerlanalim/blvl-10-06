/**
 * Centralized cache for tier access checks
 * Optimizes database queries and improves performance
 */

import { LevelAccessCheck, AIMessageCheck, UserAccessSummary } from './access';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface BatchRequest {
  userId: string;
  levelIds: number[];
  resolve: (results: Record<number, LevelAccessCheck>) => void;
  reject: (error: Error) => void;
}

class TierAccessCache {
  private userSummaryCache = new Map<string, CacheEntry<UserAccessSummary>>();
  private levelAccessCache = new Map<string, CacheEntry<LevelAccessCheck>>();
  private aiQuotaCache = new Map<string, CacheEntry<AIMessageCheck>>();
  
  // Batch processing
  private pendingBatchRequests: BatchRequest[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  // Default TTL values (in milliseconds)
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly QUOTA_TTL = 1 * 60 * 1000; // 1 minute for AI quota
  private readonly BATCH_DELAY = 50; // 50ms batch delay

  private generateKey(userId: string, levelId?: number): string {
    return levelId ? `${userId}:${levelId}` : userId;
  }

  private isExpired<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private cleanup(): void {
    // Clean expired entries periodically
    const now = Date.now();
    
    for (const [key, entry] of this.userSummaryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.userSummaryCache.delete(key);
      }
    }
    
    for (const [key, entry] of this.levelAccessCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.levelAccessCache.delete(key);
      }
    }
    
    for (const [key, entry] of this.aiQuotaCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.aiQuotaCache.delete(key);
      }
    }
  }

  // User summary cache
  getUserSummary(userId: string): UserAccessSummary | null {
    const entry = this.userSummaryCache.get(userId);
    if (!entry || this.isExpired(entry)) {
      return null;
    }
    return entry.data;
  }

  setUserSummary(userId: string, data: UserAccessSummary): void {
    this.userSummaryCache.set(userId, {
      data,
      timestamp: Date.now(),
      ttl: this.DEFAULT_TTL
    });
  }

  // Level access cache
  getLevelAccess(userId: string, levelId: number): LevelAccessCheck | null {
    const key = this.generateKey(userId, levelId);
    const entry = this.levelAccessCache.get(key);
    if (!entry || this.isExpired(entry)) {
      return null;
    }
    return entry.data;
  }

  setLevelAccess(userId: string, levelId: number, data: LevelAccessCheck): void {
    const key = this.generateKey(userId, levelId);
    this.levelAccessCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: this.DEFAULT_TTL
    });
  }

  // AI quota cache
  getAIQuota(userId: string): AIMessageCheck | null {
    const entry = this.aiQuotaCache.get(userId);
    if (!entry || this.isExpired(entry)) {
      return null;
    }
    return entry.data;
  }

  setAIQuota(userId: string, data: AIMessageCheck): void {
    this.aiQuotaCache.set(userId, {
      data,
      timestamp: Date.now(),
      ttl: this.QUOTA_TTL
    });
  }

  // Batch level access requests
  batchLevelAccess(userId: string, levelIds: number[]): Promise<Record<number, LevelAccessCheck>> {
    return new Promise((resolve, reject) => {
      // Check cache first
      const cached: Record<number, LevelAccessCheck> = {};
      const uncachedIds: number[] = [];

      for (const levelId of levelIds) {
        const cachedResult = this.getLevelAccess(userId, levelId);
        if (cachedResult) {
          cached[levelId] = cachedResult;
        } else {
          uncachedIds.push(levelId);
        }
      }

      // If all cached, return immediately
      if (uncachedIds.length === 0) {
        resolve(cached);
        return;
      }

      // Add to batch request
      this.pendingBatchRequests.push({
        userId,
        levelIds: uncachedIds,
        resolve: (batchResults) => {
          // Merge cached and batch results
          resolve({ ...cached, ...batchResults });
        },
        reject
      });

      // Process batch after delay
      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => {
          this.processBatchRequests();
        }, this.BATCH_DELAY);
      }
    });
  }

  private async processBatchRequests(): Promise<void> {
    const requests = [...this.pendingBatchRequests];
    this.pendingBatchRequests = [];
    this.batchTimeout = null;

    // Group by userId for optimal queries
    const userGroups = new Map<string, {
      levelIds: Set<number>;
      requests: BatchRequest[];
    }>();

    for (const request of requests) {
      if (!userGroups.has(request.userId)) {
        userGroups.set(request.userId, {
          levelIds: new Set(),
          requests: []
        });
      }
      const group = userGroups.get(request.userId)!;
      request.levelIds.forEach(id => group.levelIds.add(id));
      group.requests.push(request);
    }

    // Process each user group
    for (const [userId, group] of userGroups) {
      try {
        // Here you would implement the actual batch database query
        // For now, we'll resolve with empty results to prevent errors
        const results: Record<number, LevelAccessCheck> = {};
        
        for (const levelId of group.levelIds) {
          results[levelId] = {
            canAccess: false,
            isLocked: true,
            reason: 'Batch processing not yet implemented'
          };
        }

        // Resolve all requests for this user
        for (const request of group.requests) {
          const requestResults: Record<number, LevelAccessCheck> = {};
          for (const levelId of request.levelIds) {
            if (results[levelId]) {
              requestResults[levelId] = results[levelId];
              // Cache the result
              this.setLevelAccess(userId, levelId, results[levelId]);
            }
          }
          request.resolve(requestResults);
        }
      } catch (error) {
        // Reject all requests for this user
        for (const request of group.requests) {
          request.reject(error instanceof Error ? error : new Error('Batch processing failed'));
        }
      }
    }
  }

  // Clear cache for user (e.g., when tier changes)
  clearUserCache(userId: string): void {
    this.userSummaryCache.delete(userId);
    this.aiQuotaCache.delete(userId);
    
    // Clear level access cache for this user
    for (const key of this.levelAccessCache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        this.levelAccessCache.delete(key);
      }
    }
  }

  // Clear all cache
  clearAll(): void {
    this.userSummaryCache.clear();
    this.levelAccessCache.clear();
    this.aiQuotaCache.clear();
  }

  // Get cache stats for debugging
  getStats() {
    this.cleanup(); // Clean before reporting stats
    return {
      userSummaryEntries: this.userSummaryCache.size,
      levelAccessEntries: this.levelAccessCache.size,
      aiQuotaEntries: this.aiQuotaCache.size,
      pendingBatchRequests: this.pendingBatchRequests.length
    };
  }
}

// Export singleton instance
export const tierAccessCache = new TierAccessCache(); 