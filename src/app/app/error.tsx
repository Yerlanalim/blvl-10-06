'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Layout, MessageSquare } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('App error caught:', error);
    }
    
    // TODO: Send to error tracking service in production
    // Example: Sentry.captureException(error, {
    //   tags: { source: 'app-error-boundary', area: 'authenticated' },
    //   extra: { digest: error.digest, pathname: window.location.pathname }
    // });
  }, [error]);

  const handleGoToDashboard = () => {
    router.push('/app');
  };

  const handleGoToLevels = () => {
    router.push('/app/levels');
  };

  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  const isDataError = error.message.includes('database') || error.message.includes('supabase');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-xl text-destructive">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-base">
            {isNetworkError && 'Connection issue detected. Please check your internet connection.'}
            {isDataError && 'We\'re having trouble loading your data. This is usually temporary.'}
            {!isNetworkError && !isDataError && 'An unexpected error occurred while loading this page.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                Error details (development only)
              </summary>
              <pre className="mt-2 text-xs bg-muted p-3 rounded-md overflow-auto max-h-32 border">
                {error.toString()}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={reset}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleGoToDashboard}
                className="flex-1"
                variant="outline"
              >
                <Layout className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                onClick={handleGoToLevels}
                className="flex-1"
                variant="outline"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Levels
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 