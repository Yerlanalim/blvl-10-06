"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Lock, CheckCircle, BookOpen, Crown } from 'lucide-react';
import { Tables } from '@/lib/types';
import { trackLevelStarted } from '@/lib/analytics';

interface LevelCardProps {
  level: Tables<'levels'>;
  isLocked: boolean;
  isCompleted: boolean;
  progress?: number; // Progress as percentage (0-100)
  progressDetails?: {
    currentStep: number;
    totalSteps: number;
  };
  tierRestriction?: boolean; // Is locked due to tier restriction
  upgradeHint?: boolean; // Show upgrade to premium hint
  lockReason?: string; // Reason for lock
  remainingInTier?: number; // Levels remaining in current tier
  tierType?: 'free' | 'paid'; // Current user tier
  onUpgrade?: () => void; // Callback for upgrading
}

const LevelCard: React.FC<LevelCardProps> = ({
  level,
  isLocked,
  isCompleted,
  progress = 0,
  progressDetails,
  tierRestriction = false,
  upgradeHint = false,
  lockReason,
  remainingInTier,
  tierType,
  onUpgrade
}) => {
  // All hooks must be called at the top level - before any conditions
  const handleClick = React.useCallback(() => {
    if (isLocked || tierRestriction) {
      if (onUpgrade && upgradeHint) {
        onUpgrade();
      }
      return;
    }

    if (typeof window !== 'undefined') {
      trackLevelStarted(level.order_index, level.title, tierType || 'free');
    }
  }, [isLocked, tierRestriction, onUpgrade, upgradeHint, level.order_index, level.title, tierType]);

  const cardStyles = React.useMemo(() => {
    if (tierRestriction) {
      return 'border-orange-200 bg-orange-50/50 opacity-75';
    }
    if (isLocked) {
      return 'border-gray-200 bg-gray-50/50 opacity-60';
    }
    if (isCompleted) {
      return 'border-green-200 bg-green-50/50 shadow-sm';
    }
    return 'border-blue-200 bg-white hover:shadow-md transition-shadow';
  }, [tierRestriction, isLocked, isCompleted]);

  const getIcon = () => {
    if (tierRestriction) return <Crown className="h-5 w-5 text-orange-500" />;
    if (isLocked) return <Lock className="h-5 w-5 text-gray-400" />;
    if (isCompleted) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <BookOpen className="h-5 w-5 text-blue-500" />;
  };

  const getButtonText = () => {
    if (tierRestriction) {
      return upgradeHint ? 'Upgrade to Access' : 'Requires Premium';
    }
    if (isLocked) return lockReason || 'Locked';
    if (isCompleted) return 'Review';
    if (progress > 0) return 'Continue';
    return 'Start Level';
  };

  const getButtonVariant = () => {
    if (tierRestriction && upgradeHint) return 'bg-orange-600 hover:bg-orange-700 text-white';
    if (isLocked || tierRestriction) return 'bg-gray-400 text-white cursor-not-allowed';
    if (isCompleted) return 'bg-green-600 hover:bg-green-700 text-white';
    return 'bg-blue-600 hover:bg-blue-700 text-white';
  };

  const canClick = !isLocked && !tierRestriction;

  return (
    <Card className={`relative flex flex-col h-full ${cardStyles}`}>
      {/* Tier restriction badge */}
      {tierRestriction && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
          Premium
        </div>
      )}

      {/* Remaining levels hint */}
      {remainingInTier !== undefined && remainingInTier > 0 && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
          {remainingInTier} left
        </div>
      )}

      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            {getIcon()}
            Level {level.order_index}
          </span>
          {progress > 0 && progress < 100 && (
            <span className="text-sm font-normal text-blue-600">
              {Math.round(progress)}%
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-sm">
          {level.title}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col">
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {level.description}
        </p>

        {/* Progress information */}
        {progressDetails && (
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Step {progressDetails.currentStep} of {progressDetails.totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        {canClick ? (
          <Link
            href={`/app/level/${level.id}`}
            onClick={handleClick}
            className={`
              w-full px-4 py-2 rounded-lg font-medium text-center transition-colors block
              ${getButtonVariant()}
            `}
          >
            {getButtonText()}
          </Link>
        ) : (
          <button
            onClick={handleClick}
            className={`
              w-full px-4 py-2 rounded-lg font-medium text-center transition-colors
              ${getButtonVariant()}
              ${!canClick ? 'pointer-events-none' : ''}
            `}
          >
            {getButtonText()}
          </button>
        )}

        {/* Upgrade hint */}
        {tierRestriction && upgradeHint && (
          <p className="text-xs text-orange-600 mt-2 text-center">
            Unlock all levels with Premium
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LevelCard; 