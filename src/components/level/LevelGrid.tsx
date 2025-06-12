"use client";

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import LevelCard from './LevelCard';
import { Tables, LevelProgressDetails } from '@/lib/types';
import { useTierAccess } from '@/lib/hooks/useTierAccess';
import { useGlobal } from '@/lib/context/GlobalContext';

interface LevelGridProps {
  levels: Tables<'levels'>[];
  userProgress?: {
    currentLevel: number;
    completedLevels: number[];
    tierType: 'free' | 'paid';
  };
  progressData?: Record<number, number>; // levelId -> progress percentage
  progressDetails?: Record<number, LevelProgressDetails>;
}

interface LevelState {
  isLocked: boolean;
  isCompleted: boolean;
  progress: number;
  tierRestriction: boolean;
  reason?: string;
}

const LevelGrid = React.memo(function LevelGrid({ 
  levels, 
  userProgress, 
  progressData = {}, 
  progressDetails = {} 
}: LevelGridProps) {
  const { user } = useGlobal();
  const { canAccessLevel, maxLevels, tierType } = useTierAccess(user?.id);
  
  const [levelStates, setLevelStates] = useState<Record<number, LevelState>>({});
  const [isLoadingStates, setIsLoadingStates] = useState(true);

  // Memoize sorted levels to prevent recalculation
  const sortedLevels = useMemo(() => {
    return [...levels].sort((a, b) => a.order_index - b.order_index);
  }, [levels]);

  // Batch access checks for all levels to prevent multiple async calls
  const batchCheckLevelAccess = useCallback(async () => {
    if (!userProgress || !sortedLevels.length) {
      setIsLoadingStates(false);
      return;
    }

    try {
      setIsLoadingStates(true);
      
      // Batch all access checks in parallel
      const accessPromises = sortedLevels.map(async (level) => {
        const { completedLevels } = userProgress;
        
        // Check if level is completed
        const isCompleted = completedLevels.includes(level.id);
        
        // Use centralized tier access check
        const accessCheck = await canAccessLevel(level.id);
        const isLocked = !accessCheck.canAccess;
        
        // Get progress for this level
        const progress = progressData[level.id] || 0;
        
        return {
          levelId: level.id,
          state: {
            isLocked,
            isCompleted,
            progress,
            tierRestriction: accessCheck.tierRestriction || false,
            reason: accessCheck.reason
          }
        };
      });

      // Wait for all access checks to complete
      const results = await Promise.all(accessPromises);
      
      // Update state with all results at once
      const newStates = results.reduce((acc, { levelId, state }) => {
        acc[levelId] = state;
        return acc;
      }, {} as Record<number, LevelState>);

      setLevelStates(newStates);
    } catch (error) {
      console.error('Error checking level access:', error);
    } finally {
      setIsLoadingStates(false);
    }
  }, [sortedLevels, userProgress, canAccessLevel, progressData]);

  // Debounced effect to prevent multiple rapid state updates
  useEffect(() => {
    const timer = setTimeout(() => {
      batchCheckLevelAccess();
    }, 100);

    return () => clearTimeout(timer);
  }, [batchCheckLevelAccess]);

  // Memoize level card wrapper to prevent unnecessary re-renders
  const LevelCardWrapper = React.memo(function LevelCardWrapper({ 
    level 
  }: { 
    level: Tables<'levels'> 
  }) {
    const levelState = levelStates[level.id];

    if (isLoadingStates || !levelState) {
      // Show loading state
      return (
        <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
      );
    }

    const details = progressDetails[level.id];
    const showUpgradeHint = levelState.tierRestriction && tierType === 'free';
    
    // Calculate remaining levels in current tier
    const remainingInTier = tierType === 'free' ? Math.max(0, maxLevels - level.id + 1) : undefined;

    return (
      <LevelCard
        level={level}
        isLocked={levelState.isLocked}
        isCompleted={levelState.isCompleted}
        progress={levelState.progress}
        progressDetails={details && details.total_steps > 0 ? {
          currentStep: details.current_step,
          totalSteps: details.total_steps
        } : undefined}
        tierRestriction={levelState.tierRestriction}
        upgradeHint={showUpgradeHint}
        lockReason={levelState.reason}
        remainingInTier={remainingInTier}
        tierType={tierType}
      />
    );
  }, (prevProps, nextProps) => {
    return prevProps.level.id === nextProps.level.id;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedLevels.map((level) => (
        <LevelCardWrapper key={level.id} level={level} />
      ))}
    </div>
  );
});

export default LevelGrid; 