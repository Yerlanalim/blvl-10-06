"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Tables } from '@/lib/types';

interface TestWidgetProps {
  questions: Tables<'test_questions'>[];
  isCompleted: boolean;
  onComplete: () => void;
}

export default function TestWidget({ questions, isCompleted, onComplete }: TestWidgetProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(isCompleted);
  const [score, setScore] = useState<number | null>(null);

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No test questions available for this step.
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = selectedAnswers[currentQuestionIndex] !== undefined;

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

  const submitTest = () => {
    // Calculate score
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    
    const finalScore = Math.round((correct / questions.length) * 100);
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
    
    return (
      <div className="space-y-6">
        <Card className={`border-2 ${passed ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              {passed ? (
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              ) : (
                <AlertCircle className="h-16 w-16 text-orange-600 mx-auto" />
              )}
            </div>
            
            <h3 className={`text-xl font-semibold mb-2 ${passed ? 'text-green-700' : 'text-orange-700'}`}>
              {passed ? 'Test Passed!' : 'Test Not Passed'}
            </h3>
            
            <p className={`text-lg mb-4 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
              Your Score: {score}%
            </p>
            
            <p className="text-gray-600 mb-6">
              {passed 
                ? 'Congratulations! You can proceed to the next step.'
                : 'You need at least 70% to pass. Please review the material and try again.'
              }
            </p>
            
            {!passed && (
              <Button onClick={resetTest} variant="outline">
                Retake Test
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Question Progress */}
      <div className="text-sm text-gray-600 mb-4">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      {/* Question */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-6">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-primary-600 bg-primary-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-full h-full rounded-full bg-white border-2 border-primary-600" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!hasAnsweredCurrent}
        >
          {isLastQuestion ? 'Submit Test' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
} 