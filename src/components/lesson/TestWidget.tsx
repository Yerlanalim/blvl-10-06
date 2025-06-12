"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, RotateCcw, TrendingUp, Award } from 'lucide-react';
import { Tables } from '@/lib/types';
import { trackTestSubmitted } from '@/lib/analytics';

interface TestWidgetProps {
  questions: Tables<'test_questions'>[];
  isCompleted: boolean;
  onComplete: () => void;
  levelId?: number;
  userTier?: 'free' | 'paid';
}

export default function TestWidget({ questions, isCompleted, onComplete, levelId, userTier = 'free' }: TestWidgetProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(isCompleted);
  const [score, setScore] = useState<number | null>(null);
  const [testStartTime] = useState<number>(Date.now());

  if (questions.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-yellow-800 font-medium">No test questions available</p>
          <p className="text-yellow-600 text-sm mt-2">This step will be marked as completed automatically.</p>
          <Button onClick={onComplete} className="mt-4">Continue</Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = selectedAnswers[currentQuestionIndex] !== undefined;
  const totalAnswered = Object.keys(selectedAnswers).length;
  const progressPercentage = Math.round((totalAnswered / questions.length) * 100);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      submitTest();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const submitTest = () => {
    // Calculate score
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    
    const finalScore = Math.round((correct / questions.length) * 100);
    const timeSpent = Math.round((Date.now() - testStartTime) / 1000);
    
    // Track test submission
    if (levelId) {
      const skillCategory = questions[0]?.skill_category || 'general';
      trackTestSubmitted(
        levelId,
        finalScore,
        questions.length,
        timeSpent,
        correct,
        skillCategory,
        userTier
      );
    }
    
    setScore(finalScore);
    setShowResults(true);
    
    // Auto-complete if passing score (70% or higher)
    if (finalScore >= 70) {
      onComplete();
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(null);
  };

  if (showResults) {
    const passed = score !== null && score >= 70;
    const correctAnswers = questions.filter((q, i) => selectedAnswers[i] === q.correct_answer).length;
    
    return (
      <div className="space-y-6">
        <Card className={`border-2 ${passed ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
          <CardContent className="pt-6 text-center">
            <div className="mb-6">
              {passed ? (
                <div className="relative">
                  <Award className="h-20 w-20 text-green-600 mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <RotateCcw className="h-16 w-16 text-orange-600 mx-auto" />
                </div>
              )}
            </div>
            
            <h3 className={`text-2xl font-bold mb-3 ${passed ? 'text-green-700' : 'text-orange-700'}`}>
              {passed ? 'Excellent Work!' : 'Almost There!'}
            </h3>
            
            <div className={`text-3xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
              {score}%
            </div>
            
            <p className="text-gray-600 mb-4">
              You answered <strong>{correctAnswers} out of {questions.length}</strong> questions correctly
            </p>
            
            {passed ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Test Passed!</span>
                </div>
                <p className="text-green-600">
                  Great job! You can proceed to the next step.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-orange-700 font-medium">
                  You need at least 70% to pass
                </p>
                <p className="text-orange-600">
                  Review the material and try again. You&apos;ve got this!
                </p>
                <Button 
                  onClick={resetTest} 
                  variant="outline" 
                  className="mt-4 border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Test
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Question Review</h4>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correct_answer;
                
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-700">
                      Question {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        <div className="flex items-center gap-2">
          <span>Progress:</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="font-medium">{progressPercentage}%</span>
        </div>
      </div>

      {/* Question */}
      <Card className="border-primary-200">
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {currentQuestion.question}
            </h3>
            {currentQuestion.skill_category && (
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                {currentQuestion.skill_category}
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-sm ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-primary-600 bg-primary-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          ← Previous
        </Button>
        
        <div className="text-sm text-gray-500">
          {totalAnswered} of {questions.length} answered
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!hasAnsweredCurrent}
          className="flex items-center gap-2"
        >
          {isLastQuestion ? 'Submit Test' : 'Next →'}
        </Button>
      </div>
    </div>
  );
} 