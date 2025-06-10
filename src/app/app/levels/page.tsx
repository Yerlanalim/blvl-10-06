"use client";

import React, { useState, useEffect } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LevelGrid from '@/components/level/LevelGrid';
import { useUserProgress } from '@/lib/hooks/useUserProgress';
import { createSPASassClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/types';
import { Loader2, AlertCircle, Trophy, BookOpen } from 'lucide-react';

export default function LevelsPage() {
  const { user } = useGlobal();
  const [levels, setLevels] = useState<Tables<'levels'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    userProgress, 
    progressData, 
    loading: progressLoading, 
    error: progressError 
  } = useUserProgress(user?.id);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      const { data, error: levelsError } = await supabase
        .from('levels')
        .select('*')
        .order('order_index', { ascending: true });

      if (levelsError) {
        throw levelsError;
      }

      setLevels(data || []);
      
    } catch (err) {
      console.error('Error loading levels:', err);
      setError(err instanceof Error ? err.message : 'Failed to load levels');
    } finally {
      setLoading(false);
    }
  };

  if (loading || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (error || progressError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || progressError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const completedCount = userProgress?.completedLevels.length || 0;
  const totalCount = levels.length;
  const currentLevel = userProgress?.currentLevel || 1;
  const tierType = userProgress?.tierType || 'free';
  const accessibleCount = tierType === 'paid' ? totalCount : Math.min(3, totalCount);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Master Business Skills
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Progress through 10 comprehensive levels to build your business expertise
        </p>
        
        {/* Progress Summary */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2 mx-auto">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-2 mx-auto">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{currentLevel}</div>
                  <div className="text-sm text-gray-600">Current Level</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2 mx-auto">
                    <span className="text-blue-600 font-bold">{accessibleCount}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{accessibleCount}</div>
                  <div className="text-sm text-gray-600">
                    Available {tierType === 'free' && '(Free)'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tier Notice for Free Users */}
      {tierType === 'free' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're on the free plan with access to the first 3 levels. 
            <a href="/app/user-settings" className="ml-1 text-primary-600 hover:underline">
              Upgrade to unlock all 10 levels
            </a>
          </AlertDescription>
        </Alert>
      )}

      {/* Levels Grid */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Path</CardTitle>
            <CardDescription>
              Each level builds upon the previous one. Complete lessons in order to unlock the next level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LevelGrid 
              levels={levels}
              userProgress={userProgress ? {
                currentLevel: userProgress.currentLevel,
                completedLevels: userProgress.completedLevels,
                tierType: userProgress.tierType
              } : undefined}
              progressData={progressData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 