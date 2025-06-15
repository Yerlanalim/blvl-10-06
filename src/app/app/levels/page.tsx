"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGlobal } from '@/lib/context/GlobalContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LevelGrid from '@/components/level/LevelGrid';
import { useUserProgress } from '@/lib/hooks/useUserProgress';
import { useTierAccess } from '@/lib/hooks/useTierAccess';
import { createSPASassClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/types';
import { Loader2, AlertCircle, Trophy, BookOpen, Lock } from 'lucide-react';

export default function LevelsPage() {
  const { user } = useGlobal();
  const searchParams = useSearchParams();
  const [levels, setLevels] = useState<Tables<'levels'>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Get hooks data with better error handling
  const { userProgress, loading: progressLoading, error: progressError } = useUserProgress(user?.id);
  const { tierType, maxLevels, loading: tierLoading, error: tierError } = useTierAccess(user?.id);

  // Combined loading state with minimum time to prevent flash
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const isLoading = useMemo(() => {
    return !isClient || progressLoading || tierLoading || minLoadingTime || !user;
  }, [isClient, progressLoading, tierLoading, minLoadingTime, user]);

  // Set minimum loading time and client state
  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => setMinLoadingTime(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Load levels data with enhanced error handling
  useEffect(() => {
    const loadLevels = async () => {
      if (!isClient || !user) {
        return;
      }

      try {
        setError(null);
        console.debug('Loading levels for user:', user.id);
        
        const supabaseClient = await createSPASassClient();
        if (!supabaseClient) {
          throw new Error('Failed to initialize Supabase client');
        }

        const { data, error: supabaseError } = await supabaseClient
          .getSupabaseClient()
          .from('levels')
          .select('*')
          .order('order_index');

        if (supabaseError) {
          console.error('Supabase error details:', {
            message: supabaseError.message,
            code: supabaseError.code,
            details: supabaseError.details,
            hint: supabaseError.hint
          });
          throw new Error(`Database error: ${supabaseError.message || 'Unknown database error'}`);
        }

        if (!data) {
          throw new Error('No levels data received from database');
        }

        console.debug('Successfully loaded levels:', data.length);
        setLevels(data);
      } catch (err) {
        console.error('Error loading levels - Full error details:', {
          error: err,
          errorMessage: err instanceof Error ? err.message : 'Unknown error',
          errorStack: err instanceof Error ? err.stack : undefined,
          userId: user?.id,
          timestamp: new Date().toISOString()
        });
        
        // Set a more descriptive error message
        const errorMessage = err instanceof Error 
          ? err.message 
          : `Failed to load levels. Please refresh the page or contact support if the problem persists.`;
        
        setError(errorMessage);
      }
    };

    loadLevels();
  }, [isClient, user]);

  // Memoized computed values for performance
  const { completedLevels, currentLevel, stats } = useMemo(() => {
    if (!userProgress) {
      return {
        completedLevels: [],
        currentLevel: 1,
        stats: { completed: 0, total: levels.length, progress: 0 }
      };
    }

    const completed = Object.entries(userProgress.progressByLevel)
      .filter(([, progress]) => progress.percentage >= 100)
      .map(([levelId]) => parseInt(levelId));

    const current = Math.max(1, ...completed) + 1;
    const totalProgress = Object.values(userProgress.progressByLevel).reduce((sum, p) => sum + p.percentage, 0);
    const avgProgress = levels.length > 0 ? totalProgress / levels.length : 0;

    return {
      completedLevels: completed,
      currentLevel: current,
      stats: {
        completed: completed.length,
        total: levels.length,
        progress: Math.round(avgProgress)
      }
    };
  }, [userProgress, levels.length]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading your levels...</p>
        </div>
      </div>
    );
  }

  // Show error state with more details
  if (error || progressError || tierError) {
    const displayError = error || progressError || tierError;
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Unable to load levels</p>
              <p className="text-sm">{displayError}</p>
              {process.env.NODE_ENV === 'development' && (
                <details className="text-xs">
                  <summary className="cursor-pointer">Debug Info</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                    {JSON.stringify({
                      error,
                      progressError,
                      tierError,
                      user: user?.id,
                      isClient,
                      timestamp: new Date().toISOString()
                    }, null, 2)}
                  </pre>
                </details>
              )}
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm underline text-blue-600 hover:text-blue-800"
              >
                Try refreshing the page
              </button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show not authenticated state
  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600">You need to be signed in to access your levels.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Business Journey</h1>
        <p className="text-gray-600">
          Master business fundamentals through 10 progressive levels
        </p>
      </div>

      {/* Success message */}
      {searchParams.get('completed') && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Trophy className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Congratulations! You&apos;ve completed a level. Keep up the great progress!
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold">{maxLevels}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">{stats.progress}%</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold">{stats.progress}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Limitation Alert */}
      {tierType === 'free' && levels.length > 3 && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You&apos;re on the free plan with access to the first 3 levels. 
            Upgrade to Premium to unlock all 10 business levels.
          </AlertDescription>
        </Alert>
      )}

      {/* Levels Grid */}
      <LevelGrid
        levels={levels}
        userProgress={{
          currentLevel,
          completedLevels,
          tierType
        }}
        progressData={Object.fromEntries(
          Object.entries(userProgress?.progressByLevel || {}).map(([key, value]) => [key, value.percentage])
        )}
        progressDetails={userProgress?.progressByLevel || {}}
      />
    </div>
  );
} 