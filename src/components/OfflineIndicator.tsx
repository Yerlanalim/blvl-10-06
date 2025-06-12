'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OfflineIndicatorProps {
  className?: string;
}

export default function OfflineIndicator({ className = '' }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    try {
      // Test connection with a simple HEAD request
      await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      setIsOnline(true);
      setShowOfflineMessage(false);
    } catch {
      // Still offline, don't change state (browser will handle it)
    }
  };

  // Small persistent indicator (always visible)
  const PersistentIndicator = () => (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isOnline ? 'opacity-30 hover:opacity-100' : 'opacity-100'
      } ${className}`}
    >
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
        isOnline 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <span className="hidden sm:inline">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span className="hidden sm:inline">Offline</span>
          </>
        )}
      </div>
    </div>
  );

  // Full offline message (shown when user goes offline)
  const OfflineMessage = () => (
    <div className={`fixed inset-x-4 top-4 z-50 transition-all duration-300 ${
      showOfflineMessage ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-red-800">
                You&apos;re offline
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Some features may not work properly. Check your internet connection.
              </p>
              <div className="mt-3 flex items-center space-x-3">
                <Button
                  onClick={handleRetry}
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Wifi className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button
                  onClick={() => setShowOfflineMessage(false)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-100"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <PersistentIndicator />
      <OfflineMessage />
    </>
  );
} 