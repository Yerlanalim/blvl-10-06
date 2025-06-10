"use client";

import React from 'react';
import LevelCard from './LevelCard';
import { Tables } from '@/lib/types';

interface LevelGridProps {
  levels: Tables<'levels'>[];
  userProgress?: {
    currentLevel: number;
    completedLevels: number[];
    tierType: 'free' | 'paid';
  };
  progressData?: Record<number, number>; // levelId -> progress percentage
}

export default function LevelGrid({ levels, userProgress, progressData = {} }: LevelGridProps) {
  const getLevelState = (level: Tables<'levels'>) => {
    if (!userProgress) {
      return { isLocked: true, isCompleted: false, progress: 0 };
    }

    const { currentLevel, completedLevels, tierType } = userProgress;
    
    // Check if level is completed
    const isCompleted = completedLevels.includes(level.id);
    
    // Check tier access - free users can only access levels 1-3
    const tierAccess = tierType === 'paid' || level.id <= 3;
    
    // Check level progression - user can access current level and below
    const levelAccess = level.id <= currentLevel;
    
    // Level is locked if either tier or level access is denied
    const isLocked = !tierAccess || !levelAccess;
    
    // Get progress for this level
    const progress = progressData[level.id] || 0;
    
    return { isLocked, isCompleted, progress };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {levels
        .sort((a, b) => a.order_index - b.order_index)
        .map((level) => {
          const { isLocked, isCompleted, progress } = getLevelState(level);
          
          return (
            <LevelCard
              key={level.id}
              level={level}
              isLocked={isLocked}
              isCompleted={isCompleted}
              progress={progress}
            />
          );
        })}
    </div>
  );
} 