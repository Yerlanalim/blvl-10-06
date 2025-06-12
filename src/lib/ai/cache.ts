'use client';

interface CacheEntry {
  question: string;
  answer: string;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface AICache {
  entries: CacheEntry[];
  maxEntries: number;
}

const CACHE_KEY = 'bizlevel_ai_cache';
const DEFAULT_TTL = 3600000; // 1 hour
const MAX_ENTRIES = 20;

class AICacheManager {
  private cache: AICache;

  constructor() {
    this.cache = this.loadCache();
  }

  private loadCache(): AICache {
    if (typeof window === 'undefined') {
      return { entries: [], maxEntries: MAX_ENTRIES };
    }

    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (!stored) {
        return { entries: [], maxEntries: MAX_ENTRIES };
      }

      const parsed = JSON.parse(stored) as AICache;
      // Clean expired entries on load
      const now = Date.now();
      const validEntries = parsed.entries.filter(
        entry => (now - entry.timestamp) < entry.ttl
      );

      return {
        entries: validEntries,
        maxEntries: parsed.maxEntries || MAX_ENTRIES
      };
    } catch (error) {
      console.error('Failed to load AI cache:', error);
      return { entries: [], maxEntries: MAX_ENTRIES };
    }
  }

  private saveCache(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save AI cache:', error);
    }
  }

  private normalizeQuestion(question: string): string {
    return question.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  get(question: string): string | null {
    const normalized = this.normalizeQuestion(question);
    const now = Date.now();

    const entry = this.cache.entries.find(
      entry => this.normalizeQuestion(entry.question) === normalized &&
               (now - entry.timestamp) < entry.ttl
    );

    if (entry) {
      console.log('AI Cache hit for question:', question.substring(0, 50) + '...');
      return entry.answer;
    }

    return null;
  }

  set(question: string, answer: string, ttl: number = DEFAULT_TTL): void {
    const normalized = this.normalizeQuestion(question);
    const now = Date.now();

    // Remove existing entry for the same question
    this.cache.entries = this.cache.entries.filter(
      entry => this.normalizeQuestion(entry.question) !== normalized
    );

    // Add new entry
    const newEntry: CacheEntry = {
      question: question.trim(),
      answer: answer,
      timestamp: now,
      ttl
    };

    this.cache.entries.unshift(newEntry);

    // Remove oldest entries if exceeded max
    if (this.cache.entries.length > this.cache.maxEntries) {
      this.cache.entries = this.cache.entries.slice(0, this.cache.maxEntries);
    }

    this.saveCache();
    console.log('AI Cache stored for question:', question.substring(0, 50) + '...');
  }

  clear(): void {
    this.cache = { entries: [], maxEntries: MAX_ENTRIES };
    this.saveCache();
    console.log('AI Cache cleared');
  }

  getStats(): { total: number; expired: number; valid: number } {
    const now = Date.now();
    const expired = this.cache.entries.filter(
      entry => (now - entry.timestamp) >= entry.ttl
    ).length;

    return {
      total: this.cache.entries.length,
      expired,
      valid: this.cache.entries.length - expired
    };
  }

  cleanup(): void {
    const now = Date.now();
    const before = this.cache.entries.length;
    
    this.cache.entries = this.cache.entries.filter(
      entry => (now - entry.timestamp) < entry.ttl
    );

    const cleaned = before - this.cache.entries.length;
    if (cleaned > 0) {
      this.saveCache();
      console.log(`AI Cache cleaned: removed ${cleaned} expired entries`);
    }
  }
}

// Singleton instance
const aiCache = new AICacheManager();

// Export functions for use in components
export const getCachedResponse = (question: string): string | null => {
  return aiCache.get(question);
};

export const setCachedResponse = (question: string, answer: string, ttl?: number): void => {
  aiCache.set(question, answer, ttl);
};

export const clearAICache = (): void => {
  aiCache.clear();
};

export const getAICacheStats = () => {
  return aiCache.getStats();
};

export const cleanupAICache = (): void => {
  aiCache.cleanup();
};

// Auto cleanup on page load
if (typeof window !== 'undefined') {
  aiCache.cleanup();
}

export default aiCache; 