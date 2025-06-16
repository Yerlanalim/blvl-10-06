"use client";

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BlockContainer from './BlockContainer';
import { createSPASassClient } from '@/lib/supabase/client';
import { Tables, LessonStepWithQuestions, StepType, ArtifactTemplate } from '@/lib/types';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { trackLessonStepCompleted } from '@/lib/analytics';

// Lazy load компоненты (как в LessonContainer)
const TextContent = lazy(() => import('../lesson/TextContent'));
const VideoPlayer = lazy(() => import('../lesson/VideoPlayer'));
const TestWidget = lazy(() => import('../lesson/TestWidget'));
const CompletionScreen = lazy(() => import('../lesson/CompletionScreen'));

interface LevelProgressiveViewProps {
  level: Tables<'levels'>;
  lessonSteps: LessonStepWithQuestions[];
  userId: string;
}

export default function LevelProgressiveView({ 
  level, 
  lessonSteps, 
  userId 
}: LevelProgressiveViewProps) {
  const router = useRouter();
  
  // Состояние (копируем из LessonContainer)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepProgress, setStepProgress] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [artifactTemplate, setArtifactTemplate] = useState<ArtifactTemplate | null>(null);
  const [userTier, setUserTier] = useState<'free' | 'paid'>('free');
  
  // Новое состояние для прогрессивной разблокировки
  const [unlockedBlocks, setUnlockedBlocks] = useState<number[]>([]);
  const [stepStartTimes] = useState<Record<number, number>>({});

  // Загрузка данных (копируем из LessonContainer)
  useEffect(() => {
    if (level?.id && userId) {
      loadStepProgress();
      loadArtifactTemplate();
      loadUserTier();
    }
  }, [level?.id, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Автоматическая разблокировка заголовка через 3 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      unlockBlock(1); // Разблокируем первый шаг
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // Запускаем только один раз

  const loadUserTier = async () => {
    try {
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('tier_type')
        .eq('user_id', userId)
        .single();

      if (!error && profile) {
        setUserTier(profile.tier_type as 'free' | 'paid' || 'free');
      }
    } catch (err) {
      console.error('Error loading user tier:', err);
    }
  };

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
        const unlockedIndexes: number[] = [0]; // Title всегда разблокирован
        
        for (let i = 0; i < progress.current_step; i++) {
          completedSteps[i] = true;
          unlockedIndexes.push(i + 1); // Разблокируем следующий блок
        }
        
        // Если не все завершено, разблокируем текущий шаг
        if (progress.current_step < lessonSteps.length && !completedSteps[progress.current_step]) {
          unlockedIndexes.push(progress.current_step + 1);
        }
        
        // Если уровень завершен, все блоки разблокированы для просмотра
        if (progress.completed_at) {
          // Добавляем все шаги для просмотра завершенного уровня
          for (let i = 1; i <= lessonSteps.length; i++) {
            if (!unlockedIndexes.includes(i)) {
              unlockedIndexes.push(i);
            }
          }
          unlockedIndexes.push(lessonSteps.length + 1); // completion блок
        }
        
        setStepProgress(completedSteps);
        setUnlockedBlocks(unlockedIndexes);
        setIsCompleted(!!progress.completed_at);
      } else {
        // Новый пользователь - заголовок разблокирован, через 3 сек откроется первый шаг
        setUnlockedBlocks([0]);
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

  // Логика разблокировки блоков
  const unlockBlock = (blockIndex: number) => {
    setUnlockedBlocks(prev => {
      if (prev.includes(blockIndex)) return prev;
      return [...prev, blockIndex];
    });
  };

  const getBlockState = (blockIndex: number): 'locked' | 'active' | 'completed' => {
    // Блок 0 - заголовок, блоки 1-N - шаги, блок N+1 - completion
    if (blockIndex === 0) {
      // Заголовок всегда активен для просмотра
      return 'active';
    }
    
    if (blockIndex === lessonSteps.length + 1) {
      // Completion блок
      return isCompleted ? 'active' : 'locked';
    }
    
    // Обычные шаги (blockIndex 1-N соответствуют stepIndex 0-(N-1))
    const stepIndex = blockIndex - 1;
    
    if (stepProgress[stepIndex]) return 'completed';
    if (unlockedBlocks.includes(blockIndex)) return 'active';
    return 'locked';
  };

  // Обновление прогресса (копируем из LessonContainer)
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
        // Разблокируем completion блок
        unlockBlock(lessonSteps.length + 1);
      }
      
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to save progress');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockComplete = async (blockIndex: number) => {
    // blockIndex 1-N соответствуют stepIndex 0-(N-1)
    const stepIndex = blockIndex - 1;
    
    // Track lesson step completion
    const currentStep = lessonSteps[stepIndex];
    if (currentStep) {
      const startTime = stepStartTimes[stepIndex] || Date.now();
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackLessonStepCompleted(
        level.order_index,
        currentStep.step_type as 'text' | 'video' | 'test',
        stepIndex + 1,
        timeSpent,
        userTier
      );
    }
    
    await updateProgress(stepIndex, true);
    
    // Разблокируем следующий блок
    unlockBlock(blockIndex + 1);
  };

  const handleLevelComplete = () => {
    // Navigate back to levels page
    router.push('/app/levels');
  };

  // Рендеринг содержимого шага (копируем switch из LessonContainer)
  const renderStepContent = (step: LessonStepWithQuestions, stepIndex: number) => {
    const stepType = step.step_type as StepType;
    const isStepCompleted = stepProgress[stepIndex] || false;
    const blockIndex = stepIndex + 1;

    // Записываем время начала шага
    if (!stepStartTimes[stepIndex]) {
      stepStartTimes[stepIndex] = Date.now();
    }

    const fallback = (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading step content...</span>
      </div>
    );

    const handleComplete = () => handleBlockComplete(blockIndex);

    switch (stepType) {
      case 'text':
        return (
          <Suspense fallback={fallback}>
            <TextContent 
              content={step.content}
              isCompleted={isStepCompleted}
              onComplete={handleComplete}
            />
          </Suspense>
        );
      
      case 'video':
        return (
          <Suspense fallback={fallback}>
            <VideoPlayer 
              content={step.content}
              isCompleted={isStepCompleted}
              onComplete={handleComplete}
            />
          </Suspense>
        );
      
      case 'test':
        return (
          <Suspense fallback={fallback}>
            <TestWidget 
              questions={step.test_questions || []}
              isCompleted={isStepCompleted}
              onComplete={handleComplete}
              levelId={level.order_index}
              userTier={userTier}
            />
          </Suspense>
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

  // Рендеринг заголовка уровня
  const renderLevelHeader = () => {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Level {level.order_index}: {level.title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {level.description}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <BookOpen className="h-4 w-4" />
          <span>{lessonSteps.length} steps to complete</span>
        </div>
      </div>
    );
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Заголовок уровня - Block 0 */}
      <BlockContainer
        title="Level Introduction"
        type="title"
        state={getBlockState(0)}
        order={0}
        onUnlock={() => unlockBlock(1)} // Разблокируем первый шаг через 3 сек
      >
        {renderLevelHeader()}
      </BlockContainer>

      {/* Все шаги уровня - Blocks 1-N */}
      {lessonSteps.map((step, stepIndex) => {
        const blockIndex = stepIndex + 1;
        const stepType = step.step_type as StepType;
        
        return (
          <BlockContainer
            key={stepIndex}
            title={`Step ${stepIndex + 1}: ${stepType.charAt(0).toUpperCase() + stepType.slice(1)}`}
            type={stepType}
            state={getBlockState(blockIndex)}
            order={blockIndex}
          >
            {renderStepContent(step, stepIndex)}
          </BlockContainer>
        );
      })}

      {/* Completion Screen - Block N+1 */}
      {isCompleted && (
        <BlockContainer
          title="Level Complete!"
          type="completion"
          state={getBlockState(lessonSteps.length + 1)}
          order={lessonSteps.length + 1}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600">Loading completion screen...</span>
            </div>
          }>
            <CompletionScreen 
              level={level}
              userId={userId}
              artifactTemplate={artifactTemplate}
              onContinue={handleLevelComplete}
              userTier={userTier}
            />
          </Suspense>
        </BlockContainer>
      )}

      {/* Loading overlay при сохранении */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
            <span className="text-gray-700">Saving progress...</span>
          </div>
        </div>
      )}
    </div>
  );
} 