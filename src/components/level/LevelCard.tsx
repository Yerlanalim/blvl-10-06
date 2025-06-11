"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Lock, CheckCircle, BookOpen } from 'lucide-react';
import { Tables } from '@/lib/types';

interface LevelCardProps {
  level: Tables<'levels'>;
  isLocked: boolean;
  isCompleted: boolean;
  progress?: number; // Progress as percentage (0-100)
  progressDetails?: {
    currentStep: number;
    totalSteps: number;
  };
}

export default function LevelCard({ level, isLocked, isCompleted, progress = 0, progressDetails }: LevelCardProps) {
  // Validate props to ensure data integrity
  if (!level) {
    console.error('LevelCard: level prop is required');
    return null;
  }
  const cardContent = (
    <Card className={`h-full transition-all duration-200 hover:shadow-md ${
      isLocked 
        ? 'opacity-60 cursor-not-allowed' 
        : 'hover:scale-105 cursor-pointer'
    } ${
      isCompleted 
        ? 'border-green-200 bg-green-50' 
        : isLocked 
          ? 'border-gray-200' 
          : 'border-primary-200 hover:border-primary-300'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg flex items-center gap-2 ${
            isLocked ? 'text-gray-400' : isCompleted ? 'text-green-700' : 'text-primary-700'
          }`}>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
              {level.order_index}
            </span>
            {level.title}
          </CardTitle>
          <div className="flex items-center">
            {isLocked && <Lock className="h-5 w-5 text-gray-400" />}
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
            {!isLocked && !isCompleted && <BookOpen className="h-5 w-5 text-primary-600" />}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className={`mb-4 ${
          isLocked ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {level.description}
        </CardDescription>
        
        {/* Progress bar - only show if level is started */}
        {!isLocked && !isCompleted && progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>
                {progressDetails ? 
                  `${progressDetails.currentStep}/${progressDetails.totalSteps} steps` :
                  `${Math.round(progress)}%`
                }
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {isCompleted && (
          <div className="mt-4 text-sm text-green-600 font-medium">
            ✓ Level Completed
          </div>
        )}
        
        {isLocked && (
          <div className="mt-4 text-sm text-gray-400">
            Complete previous levels to unlock
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLocked) {
    return <div className="cursor-not-allowed">{cardContent}</div>;
  }

  return (
    <Link href={`/app/lesson/${level.id}`}>
      {cardContent}
    </Link>
  );
} 