"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, ArrowRight, BookOpen, Target, Award } from 'lucide-react';
import { Tables, ArtifactTemplate } from '@/lib/types';
import Confetti from '@/components/Confetti';
import ArtifactUnlock from './ArtifactUnlock';
import { createSPASassClient } from '@/lib/supabase/client';

interface CompletionScreenProps {
  level: Tables<'levels'>;
  userId: string;
  artifactTemplate: ArtifactTemplate | null;
  onContinue: () => void;
  userTier?: 'free' | 'paid';
}

export default function CompletionScreen({ level, userId, artifactTemplate, onContinue, userTier = 'free' }: CompletionScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);

  // Send level complete email
  const sendLevelCompleteEmail = useCallback(async () => {
    try {
      const supabase = await createSPASassClient();
      const client = supabase.getSupabaseClient();

      // Get user data
      const { data: { user } } = await client.auth.getUser();
      if (!user?.email) return;

      // Get user profile for first name
      const { data: profile } = await client
        .from('user_profiles')
        .select('first_name')
        .eq('user_id', userId)
        .single();

      // Get next level info
      const { data: nextLevel } = await client
        .from('levels')
        .select('title')
        .eq('order_index', level.order_index + 1)
        .single();

      // Count user's total artifacts
      const { count: artifactsCount } = await client
        .from('user_artifacts')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

      // Send level complete email via API
      const emailResponse = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'level-complete',
          to: user.email,
          firstName: profile?.first_name || user.email.split('@')[0],
          levelNumber: level.order_index,
          levelTitle: level.title,
          nextLevelTitle: nextLevel?.title,
          artifactsUnlocked: artifactsCount || 0,
          totalLevelsCompleted: level.order_index
        })
      });

      if (emailResponse.ok) {
        console.log(`[COMPLETION] Level complete email sent for level ${level.order_index}`);
      } else {
        console.error('[COMPLETION] Failed to send level complete email');
      }
    } catch (error) {
      console.error('[COMPLETION] Error sending level complete email:', error);
    }
  }, [level, userId]);

  useEffect(() => {
    // Start confetti animation
    setShowConfetti(true);
    
    // Start element animations after a short delay
    const timer = setTimeout(() => {
      setAnimateElements(true);
    }, 500);

    // Stop confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    // Send level complete email
    sendLevelCompleteEmail();

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, [sendLevelCompleteEmail]);

  const handleViewOverview = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/app/levels';
    }
  }, []);

  const handleReturnToLevels = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/app/levels';
    }
  }, []);

  const achievements = [
    {
      icon: BookOpen,
      label: "Content Mastered",
      description: "Read and understood all materials"
    },
    {
      icon: Target,
      label: "Tests Passed",
      description: "Successfully completed assessments"
    },
    {
      icon: Award,
      label: "Level Unlocked",
      description: `Access granted to Level ${level.order_index + 1}`
    }
  ];

  return (
    <>
      {/* Confetti Animation */}
      <Confetti active={showConfetti} />
      
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className={`relative transition-all duration-1000 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Trophy */}
          <div className="relative mx-auto w-40 h-40 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
              <Trophy className="h-20 w-20 text-white" />
            </div>
            
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border-4 border-yellow-300 opacity-30 animate-ping"></div>
            <div className="absolute inset-4 rounded-full border-2 border-orange-300 opacity-40 animate-pulse"></div>
            
            {/* Floating stars */}
            <Star className="absolute -top-2 -left-2 h-8 w-8 text-yellow-400 animate-bounce" style={{ animationDelay: '0s' }} />
            <Star className="absolute -top-4 right-4 h-6 w-6 text-yellow-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
            <Star className="absolute -bottom-2 -right-2 h-7 w-7 text-yellow-400 animate-bounce" style={{ animationDelay: '1s' }} />
            <Star className="absolute bottom-2 -left-4 h-5 w-5 text-yellow-400 animate-bounce" style={{ animationDelay: '1.5s' }} />
          </div>

          {/* Completion Message */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              Outstanding! 🎉
            </h1>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-primary-600">
                Level {level.order_index} Complete
              </h2>
              <p className="text-2xl font-medium text-gray-700">
                You&apos;ve mastered <span className="text-primary-600">{level.title}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Level Summary Card */}
        <Card className={`border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 transition-all duration-1000 delay-300 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <CardContent className="pt-8 pb-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                🎯 What You&apos;ve Accomplished
              </h3>
              
              <p className="text-lg text-green-700 leading-relaxed">
                {level.description}
              </p>
              
              {/* Achievement Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div 
                      key={index}
                      className={`text-center transition-all duration-500 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: `${800 + index * 200}ms` }}
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg border-2 border-green-200">
                        <Icon className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-green-800 mb-1">
                        {achievement.label}
                      </h4>
                      <p className="text-sm text-green-600">
                        {achievement.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Milestone */}
        <Card className={`border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all duration-1000 delay-500 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {level.order_index}
                </div>
                <div className="text-sm text-blue-500 font-medium">
                  Levels Completed
                </div>
              </div>
              
              <div className="h-12 w-px bg-blue-300"></div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {10 - level.order_index}
                </div>
                <div className="text-sm text-blue-500 font-medium">
                  Levels Remaining
                </div>
              </div>
              
              <div className="h-12 w-px bg-blue-300"></div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {Math.round((level.order_index / 10) * 100)}%
                </div>
                <div className="text-sm text-blue-500 font-medium">
                  Course Progress
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: animateElements ? `${(level.order_index / 10) * 100}%` : '0%',
                    transitionDelay: '1000ms'
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artifact Unlock */}
        {artifactTemplate && (
          <div className={`transition-all duration-1000 delay-600 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <ArtifactUnlock 
              levelId={level.id}
              userId={userId}
              artifactTemplate={artifactTemplate}
              userTier={userTier}
            />
          </div>
        )}

        {/* Next Steps */}
        <div className={`space-y-4 transition-all duration-1000 delay-700 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-2xl font-bold text-gray-900">
            Ready for the Next Challenge?
          </h3>
          <p className="text-lg text-gray-600">
            {level.order_index < 10 
              ? `Level ${level.order_index + 1} awaits with new business skills to master!`
              : "Congratulations! You've completed the entire course!"
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-900 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {level.order_index < 10 ? (
            <Button 
              onClick={onContinue}
              size="lg"
              className="flex items-center gap-3 px-8 py-4 text-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Level {level.order_index + 1}
              <ArrowRight className="h-6 w-6" />
            </Button>
          ) : (
                         <Button 
               onClick={handleViewOverview}
               size="lg"
               className="flex items-center gap-3 px-8 py-4 text-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all"
             >
               View Course Overview
               <Trophy className="h-6 w-6" />
             </Button>
          )}
          
                     <Button 
             variant="outline"
             size="lg"
             onClick={handleReturnToLevels}
             className="px-8 py-4 text-lg border-2 hover:bg-gray-50 transition-all"
           >
             Return to Levels
           </Button>
        </div>
      </div>
    </>
  );
} 