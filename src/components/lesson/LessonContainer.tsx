"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StepIndicator from './StepIndicator';
import NavigationButtons from './NavigationButtons';
import TextContent from './TextContent';
import VideoPlayer from './VideoPlayer';
import TestWidget from './TestWidget';
import CompletionScreen from './CompletionScreen';
import { createSPASassClient } from '@/lib/supabase/client';
import { Tables, LessonStepWithQuestions, StepType, ArtifactTemplate } from '@/lib/types';
import { Loader2, AlertCircle } from 'lucide-react';

interface LessonContainerProps {
  level: Tables<'levels'>;
  lessonSteps: LessonStepWithQuestions[];
  currentStepIndex: number;
  userId: string;
}

export default function LessonContainer({ 
  level, 
  lessonSteps, 
  currentStepIndex, 
  userId 
}: LessonContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepProgress, setStepProgress] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [artifactTemplate, setArtifactTemplate] = useState<ArtifactTemplate | null>(null);

  // Load existing progress and artifact template
  useEffect(() => {
    if (level?.id && userId) {
      loadStepProgress();
      loadArtifactTemplate();
    }
  }, [level?.id, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStepProgress = async () => {
    try {
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('current_step, completed_at')
        .eq('user_id', userId)
        .eq('level_id', level.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError;
      }

      if (progress) {
        // Mark all steps up to current_step as completed
        const completedSteps: Record<number, boolean> = {};
        for (let i = 0; i < progress.current_step; i++) {
          completedSteps[i] = true;
        }
        setStepProgress(completedSteps);
        setIsCompleted(!!progress.completed_at);
      }
      
    } catch (err) {
      console.error('Error loading step progress:', err);
    }
  };

  const loadArtifactTemplate = async () => {
    try {
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      const { data: template, error: templateError } = await supabase
        .from('artifact_templates')
        .select('*')
        .eq('level_id', level.id)
        .single();

      if (templateError && templateError.code !== 'PGRST116') {
        throw templateError;
      }

      setArtifactTemplate(template);
      
    } catch (err) {
      console.error('Error loading artifact template:', err);
    }
  };

  const updateProgress = async (stepIndex: number, completed: boolean = true) => {
    try {
      setLoading(true);
      
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      // Update local state
      setStepProgress(prev => ({
        ...prev,
        [stepIndex]: completed
      }));

      // Calculate new current_step (highest completed step + 1)
      const newStepProgress = { ...stepProgress, [stepIndex]: completed };
      const completedStepIndexes = Object.keys(newStepProgress)
        .map(Number)
        .filter(index => newStepProgress[index]);
      const newCurrentStep = Math.max(0, ...completedStepIndexes) + 1;

      // Check if level is completed (all steps done)
      const levelCompleted = completedStepIndexes.length >= lessonSteps.length;

      // Update or insert progress record
      const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          level_id: level.id,
          current_step: newCurrentStep,
          completed_at: levelCompleted ? new Date().toISOString() : null,
          test_scores: {}, // Will be updated by test components
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,level_id'
        });

      if (upsertError) {
        throw upsertError;
      }

      // If level completed, update user profile
      if (levelCompleted && !isCompleted) {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('completed_lessons, current_level')
          .eq('user_id', userId)
          .single();

        if (!profileError && profile) {
          const updatedCompletedLessons = profile.completed_lessons || [];
          if (!updatedCompletedLessons.includes(level.id)) {
            updatedCompletedLessons.push(level.id);
            
            // Update profile with new completion and potentially new current level
            const newCurrentLevel = Math.max(profile.current_level, level.id + 1);
            
            await supabase
              .from('user_profiles')
              .update({
                completed_lessons: updatedCompletedLessons,
                current_level: newCurrentLevel,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId);
          }
        }
        
        setIsCompleted(true);
      }
      
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to save progress');
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = async () => {
    await updateProgress(currentStepIndex, true);
  };

  const handleNavigation = (direction: 'previous' | 'next') => {
    const newIndex = direction === 'next' 
      ? Math.min(currentStepIndex + 1, lessonSteps.length - 1)
      : Math.max(currentStepIndex - 1, 0);
    
    // Update URL to reflect new step
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('step', (newIndex + 1).toString());
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleLevelComplete = () => {
    // Navigate back to levels page
    router.push('/app/levels');
  };

  const renderCurrentStep = () => {
    // If all steps completed, show completion screen
    if (isCompleted) {
      return (
        <CompletionScreen 
          level={level}
          userId={userId}
          artifactTemplate={artifactTemplate}
          onContinue={handleLevelComplete}
        />
      );
    }

    const currentStep = lessonSteps[currentStepIndex];
    if (!currentStep) return null;

    const stepType = currentStep.step_type as StepType;
    const isStepCompleted = stepProgress[currentStepIndex] || false;

    switch (stepType) {
      case 'text':
        return (
          <TextContent 
            content={currentStep.content}
            isCompleted={isStepCompleted}
            onComplete={handleStepComplete}
          />
        );
      
      case 'video':
        return (
          <VideoPlayer 
            content={currentStep.content}
            isCompleted={isStepCompleted}
            onComplete={handleStepComplete}
          />
        );
      
      case 'test':
        return (
          <TestWidget 
            questions={currentStep.test_questions || []}
            isCompleted={isStepCompleted}
            onComplete={handleStepComplete}
          />
        );
      
      default:
        return (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unknown step type: {stepType}
            </AlertDescription>
          </Alert>
        );
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Level Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Level {level.order_index}: {level.title}
        </h1>
        <p className="text-gray-600">{level.description}</p>
      </div>

      {/* Step Indicator */}
      <StepIndicator
        totalSteps={lessonSteps.length}
        currentStep={currentStepIndex + 1}
        completedSteps={Object.keys(stepProgress).map(Number).filter(i => stepProgress[i])}
      />

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStepIndex + 1} of {lessonSteps.length}
            {lessonSteps[currentStepIndex] && (
              <span className="ml-2 text-base font-normal text-gray-600">
                ({lessonSteps[currentStepIndex].step_type})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600">Saving progress...</span>
            </div>
          )}
          
          {!loading && renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      {!isCompleted && (
        <NavigationButtons
          currentStep={currentStepIndex + 1}
          totalSteps={lessonSteps.length}
          canGoNext={stepProgress[currentStepIndex] || false}
          onPrevious={() => handleNavigation('previous')}
          onNext={() => handleNavigation('next')}
          onComplete={handleLevelComplete}
        />
      )}
    </div>
  );
} 