"use client";

import React from 'react';
import { CheckCircle, Circle, Play } from 'lucide-react';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number; // 1-based
  completedSteps: number[]; // 0-based indexes
}

export default function StepIndicator({ totalSteps, currentStep, completedSteps }: StepIndicatorProps) {
  const getStepIcon = (stepIndex: number) => {
    const isCompleted = completedSteps.includes(stepIndex);
    const isCurrent = stepIndex + 1 === currentStep;
    
    if (isCompleted) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    } else if (isCurrent) {
      return <Play className="h-6 w-6 text-primary-600" />;
    } else {
      return <Circle className="h-6 w-6 text-gray-300" />;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    const isCompleted = completedSteps.includes(stepIndex);
    const isCurrent = stepIndex + 1 === currentStep;
    
    if (isCompleted) {
      return 'completed';
    } else if (isCurrent) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  const getConnectorClass = (stepIndex: number) => {
    const isCompleted = completedSteps.includes(stepIndex);
    const isNext = completedSteps.includes(stepIndex + 1);
    
    if (isCompleted || isNext) {
      return 'bg-green-600';
    } else {
      return 'bg-gray-300';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{completedSteps.length} of {totalSteps} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(completedSteps.length / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const status = getStepStatus(index);
          const isLast = index === totalSteps - 1;
          
          return (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  status === 'completed' 
                    ? 'bg-green-50 border-green-600' 
                    : status === 'current'
                      ? 'bg-primary-50 border-primary-600'
                      : 'bg-gray-50 border-gray-300'
                }`}>
                  {getStepIcon(index)}
                </div>
                
                {/* Step Number and Label */}
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    status === 'completed' 
                      ? 'text-green-600' 
                      : status === 'current'
                        ? 'text-primary-600'
                        : 'text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className={`text-xs mt-1 ${
                    status === 'completed' 
                      ? 'text-green-600' 
                      : status === 'current'
                        ? 'text-primary-600'
                        : 'text-gray-400'
                  }`}>
                    Step
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${getConnectorClass(index)}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Info */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
    </div>
  );
} 