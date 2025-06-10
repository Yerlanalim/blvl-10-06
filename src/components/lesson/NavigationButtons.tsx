"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number; // 1-based
  totalSteps: number;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export default function NavigationButtons({ 
  currentStep, 
  totalSteps, 
  canGoNext, 
  onPrevious, 
  onNext, 
  onComplete 
}: NavigationButtonsProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      {/* Previous Button */}
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {/* Step Counter */}
      <div className="text-sm text-gray-600">
        Step {currentStep} of {totalSteps}
      </div>

      {/* Next/Complete Button */}
      {isLastStep ? (
        <Button
          onClick={onComplete}
          disabled={!canGoNext}
          className="flex items-center gap-2"
        >
          <Flag className="h-4 w-4" />
          Complete Level
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 