"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTierAccess } from '@/lib/hooks/useTierAccess';
import dynamic from 'next/dynamic';
import { createSPASassClient } from '@/lib/supabase/client';
import { LessonStepWithQuestions, Tables } from '@/lib/types';
import { Loader2, AlertCircle, Lock } from 'lucide-react';

// Dynamic import для LevelProgressiveView с loading состоянием
const LevelProgressiveView = dynamic(() => import('@/components/level/LevelProgressiveView'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
        <p className="text-gray-600">Loading level content...</p>
      </div>
    </div>
  )
});

interface LevelPageProps {
  params: Promise<{ id: string }>;
}

export default function LevelPage({ params }: LevelPageProps) {
  const { user } = useGlobal();
  const [levelId, setLevelId] = useState<number | null>(null);
  const [level, setLevel] = useState<Tables<'levels'> | null>(null);
  const [lessonSteps, setLessonSteps] = useState<LessonStepWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract level ID from params
  useEffect(() => {
    const extractParams = async () => {
      const resolvedParams = await params;
      const id = parseInt(resolvedParams.id);
      if (isNaN(id)) {
        setError('Invalid level ID');
        setLoading(false);
        return;
      }
      setLevelId(id);
    };
    
    extractParams();
  }, [params]);

  // Check level access using centralized tier system
  const { canAccessLevel, loading: tierLoading } = useTierAccess(user?.id);
  const [accessResult, setAccessResult] = useState<{
    canAccess: boolean;
    isLocked: boolean;
    reason?: string;
    tierRestriction?: boolean;
    progressRestriction?: boolean;
  } | null>(null);

  // Check access when levelId changes
  useEffect(() => {
    if (!levelId || !user?.id) return;
    
    const checkAccess = async () => {
      const result = await canAccessLevel(levelId);
      setAccessResult({
        canAccess: result.canAccess,
        isLocked: result.isLocked,
        reason: result.reason,
        tierRestriction: result.tierRestriction,
        progressRestriction: result.progressRestriction
      });
    };
    
    checkAccess();
  }, [levelId, user?.id, canAccessLevel]);

  // Load lesson steps
  useEffect(() => {
    if (!levelId || !accessResult?.canAccess) return;
    
    loadLessonSteps();
  }, [levelId, accessResult?.canAccess]);

  const loadLessonSteps = async () => {
    if (!levelId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      // Load level details and lesson steps in parallel
      const [levelResult, stepsResult] = await Promise.all([
        supabase
          .from('levels')
          .select('*')
          .eq('id', levelId)
          .single(),
        supabase
          .from('lesson_steps')
          .select(`
            *,
            test_questions (*)
          `)
          .eq('level_id', levelId)
          .order('order_index', { ascending: true })
      ]);

      if (levelResult.error) {
        throw levelResult.error;
      }

      if (stepsResult.error) {
        throw stepsResult.error;
      }

      setLevel(levelResult.data);
      setLessonSteps(stepsResult.data || []);
      
    } catch (err) {
      console.error('Error loading level data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load level');
    } finally {
      setLoading(false);
    }
  };

  // Мемоизируем expensive calculations
  const hasValidData = useMemo(() => {
    return level && lessonSteps.length > 0;
  }, [level, lessonSteps.length]);

  const canAccess = useMemo(() => {
    return accessResult && !accessResult.isLocked && accessResult.canAccess;
  }, [accessResult]);

  // Show loading state
  if (loading || tierLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading level...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading level: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle access restrictions
  if (!canAccess) {
    const isUpgradeNeeded = accessResult?.tierRestriction;
    const upgradeCTA = isUpgradeNeeded ? 'Upgrade to Premium' : 'Complete Previous Levels';

    return (
      <div className="space-y-6">
        <Alert variant={isUpgradeNeeded ? "default" : "destructive"}>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            {accessResult?.reason || 'You do not have access to this level'}
          </AlertDescription>
        </Alert>
        
        <div className="text-center py-12">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Level Locked
          </h2>
          <p className="text-gray-600 mb-6">
            {accessResult?.reason || 'Complete previous levels to unlock this lesson'}
          </p>
          
          <div className="space-y-3">
            <a 
              href="/app/levels"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 mr-3"
            >
              Back to Levels
            </a>
            
            {isUpgradeNeeded && (
              <a 
                href="/app/user-settings"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {upgradeCTA}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle no lesson data
  if (!hasValidData) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No lesson content available for this level
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <LevelProgressiveView
      level={level!}
      lessonSteps={lessonSteps}
      userId={user?.id || ''}
    />
  );
} 