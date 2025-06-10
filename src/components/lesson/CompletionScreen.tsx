"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import { Tables } from '@/lib/types';

interface CompletionScreenProps {
  level: Tables<'levels'>;
  onContinue: () => void;
}

export default function CompletionScreen({ level, onContinue }: CompletionScreenProps) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Celebration Animation */}
      <div className="relative">
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6">
          <Trophy className="h-16 w-16 text-white" />
        </div>
        
        {/* Animated stars */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Star className="h-6 w-6 text-yellow-400 absolute -top-4 -left-4 animate-pulse" />
          <Star className="h-4 w-4 text-yellow-400 absolute -top-2 right-8 animate-pulse delay-75" />
          <Star className="h-5 w-5 text-yellow-400 absolute -bottom-2 -right-2 animate-pulse delay-150" />
          <Star className="h-4 w-4 text-yellow-400 absolute bottom-4 -left-8 animate-pulse delay-300" />
        </div>
      </div>

      {/* Completion Message */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Congratulations! 🎉
        </h1>
        <h2 className="text-2xl font-semibold text-primary-600">
          Level {level.order_index} Complete
        </h2>
        <p className="text-xl text-gray-600">
          You&apos;ve successfully mastered <strong>{level.title}</strong>
        </p>
      </div>

      {/* Level Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">
              What you&apos;ve learned:
            </h3>
            <p className="text-green-700">
              {level.description}
            </p>
            
            {/* Achievement badges */}
            <div className="flex justify-center space-x-6 pt-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">Level Mastered</span>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm text-blue-600 font-medium">Skills Gained</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Ready for the next challenge?
        </h3>
        <p className="text-gray-600">
          Continue your journey and unlock Level {level.order_index + 1}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={onContinue}
          size="lg"
          className="flex items-center gap-2"
        >
          Continue to Next Level
          <ArrowRight className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline"
          size="lg"
          onClick={() => window.location.href = '/app/levels'}
        >
          View All Levels
        </Button>
      </div>
    </div>
  );
} 