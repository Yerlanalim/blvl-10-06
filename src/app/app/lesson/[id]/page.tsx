"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGlobal } from '@/lib/context/GlobalContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLevelAccess } from '@/lib/hooks/useLevelAccess';
import LessonContainer from '@/components/lesson/LessonContainer';
import { createSPASassClient } from '@/lib/supabase/client';
import { LessonStepWithQuestions } from '@/lib/types';
import { Loader2, AlertCircle, Lock } from 'lucide-react';

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const { user } = useGlobal();
  const searchParams = useSearchParams();
  const [levelId, setLevelId] = useState<number | null>(null);
  const [lessonSteps, setLessonSteps] = useState<LessonStepWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract level ID from params
  useEffect(() => {
    const extractParams = async () => {
      const resolvedParams = await params;
      const id = parseInt(resolvedParams.id);
      if (isNaN(id)) {
        setError('Invalid lesson ID');
        setLoading(false);
        return;
      }
      setLevelId(id);
    };
    
    extractParams();
  }, [params]);

  // Check level access
  const { 
    canAccess, 
    isLocked, 
    reason, 
    level,
    loading: accessLoading,
    error: accessError 
  } = useLevelAccess(levelId || 0, user?.id);

  // Load lesson steps
  useEffect(() => {
    if (!levelId || !canAccess) return;
    
    loadLessonSteps();
  }, [levelId, canAccess]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLessonSteps = async () => {
    if (!levelId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      // Load lesson steps with associated test questions
      const { data: steps, error: stepsError } = await supabase
        .from('lesson_steps')
        .select(`
          *,
          test_questions (*)
        `)
        .eq('level_id', levelId)
        .order('order_index', { ascending: true });

      if (stepsError) {
        throw stepsError;
      }

      setLessonSteps(steps || []);
      
    } catch (err) {
      console.error('Error loading lesson steps:', err);
      setError(err instanceof Error ? err.message : 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  // Handle loading states
  if (accessLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  // Handle access errors
  if (accessError || error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {accessError || error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle access denied
  if (isLocked || !canAccess) {
    return (
      <div className="space-y-6">
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            {reason || 'You do not have access to this lesson'}
          </AlertDescription>
        </Alert>
        
        <div className="text-center py-12">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Level Locked
          </h2>
          <p className="text-gray-600 mb-6">
            {reason || 'Complete previous levels to unlock this lesson'}
          </p>
          <a 
            href="/app/levels"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Back to Levels
          </a>
        </div>
      </div>
    );
  }

  // Handle no lesson steps
  if (lessonSteps.length === 0) {
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

  // Get current step from URL params
  const currentStepIndex = parseInt(searchParams.get('step') || '1') - 1;
  const validStepIndex = Math.max(0, Math.min(currentStepIndex, lessonSteps.length - 1));

  return (
    <LessonContainer
      level={level!}
      lessonSteps={lessonSteps}
      currentStepIndex={validStepIndex}
      userId={user?.id || ''}
    />
  );
} 