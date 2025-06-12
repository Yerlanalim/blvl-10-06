'use client';

export interface QueuedAction {
  id: string;
  type: 'api_call' | 'data_update' | 'file_upload';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  headers?: Record<string, string>;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

class OfflineActionQueue {
  private queue: QueuedAction[] = [];
  private isProcessing = false;
  private readonly STORAGE_KEY = 'bizlevel_offline_queue';
  private readonly MAX_QUEUE_SIZE = 50;

  constructor() {
    // Load queue from localStorage on initialization
    this.loadFromStorage();
    
    // Listen for online events to process queue
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.processQueue();
      });
    }
  }

  // Add action to queue
  enqueue(action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>): string {
    const queuedAction: QueuedAction = {
      ...action,
      id: this.generateId(),
      timestamp: Date.now(),
      retries: 0,
    };

    // Prevent queue from growing too large
    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      console.warn('[OfflineQueue] Queue is full, removing oldest action');
      this.queue.shift();
    }

    this.queue.push(queuedAction);
    this.saveToStorage();

    console.log(`[OfflineQueue] Action queued: ${action.type} - ${action.endpoint}`);
    
    // Try to process immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }

    return queuedAction.id;
  }

  // Remove action from queue
  dequeue(actionId: string): boolean {
    const index = this.queue.findIndex(action => action.id === actionId);
    if (index > -1) {
      this.queue.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Get all queued actions
  getQueue(): QueuedAction[] {
    return [...this.queue];
  }

  // Get queue size
  getQueueSize(): number {
    return this.queue.length;
  }

  // Clear entire queue
  clearQueue(): void {
    this.queue = [];
    this.saveToStorage();
    console.log('[OfflineQueue] Queue cleared');
  }

  // Process queue when coming back online
  async processQueue(): Promise<void> {
    if (this.isProcessing || !navigator.onLine || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`[OfflineQueue] Processing ${this.queue.length} queued actions`);

    const actionsToProcess = [...this.queue];
    
    for (const action of actionsToProcess) {
      try {
        await this.executeAction(action);
        this.dequeue(action.id);
        console.log(`[OfflineQueue] Successfully executed action: ${action.type}`);
      } catch (error) {
        console.error(`[OfflineQueue] Failed to execute action: ${action.type}`, error);
        
        // Increment retry count
        action.retries++;
        
        if (action.retries >= action.maxRetries) {
          console.warn(`[OfflineQueue] Max retries reached for action: ${action.type}, removing from queue`);
          this.dequeue(action.id);
        } else {
          console.log(`[OfflineQueue] Retrying action: ${action.type} (${action.retries}/${action.maxRetries})`);
        }
      }

      // Small delay between actions to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
    this.saveToStorage();
  }

  // Execute a single action
  private async executeAction(action: QueuedAction): Promise<void> {
    const { endpoint, method, data, headers } = action;

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Generate unique ID for actions
  private generateId(): string {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Save queue to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('[OfflineQueue] Failed to save queue to storage:', error);
    }
  }

  // Load queue from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        console.log(`[OfflineQueue] Loaded ${this.queue.length} actions from storage`);
      }
    } catch (error) {
      console.error('[OfflineQueue] Failed to load queue from storage:', error);
      this.queue = [];
    }
  }
}

// Singleton instance
let actionQueueInstance: OfflineActionQueue | null = null;

export function getActionQueue(): OfflineActionQueue {
  if (!actionQueueInstance) {
    actionQueueInstance = new OfflineActionQueue();
  }
  return actionQueueInstance;
}

// Helper function to queue API calls when offline
export function queueOfflineAction(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  data?: any,
  maxRetries: number = 3
): string | null {
  if (navigator.onLine) {
    // If online, don't queue - execute immediately
    return null;
  }

  const queue = getActionQueue();
  return queue.enqueue({
    type: 'api_call',
    endpoint,
    method,
    data,
    maxRetries,
  });
}

// Hook for React components to use the offline queue
export function useOfflineQueue() {
  const queue = getActionQueue();

  return {
    queueAction: (action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) => queue.enqueue(action),
    removeAction: (actionId: string) => queue.dequeue(actionId),
    getQueueSize: () => queue.getQueueSize(),
    getQueue: () => queue.getQueue(),
    clearQueue: () => queue.clearQueue(),
    processQueue: () => queue.processQueue(),
  };
} 