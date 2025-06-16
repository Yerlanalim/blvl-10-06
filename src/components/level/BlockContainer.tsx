"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, Lock, Clock, PlayCircle } from 'lucide-react';

export interface BlockContainerProps {
  children: React.ReactNode;
  title: string;
  type: 'title' | 'text' | 'video' | 'test' | 'completion';
  state: 'locked' | 'active' | 'completed';
  order: number;
  onUnlock?: () => void; // Для auto-unlock заголовка
  className?: string;
}

const BlockContainer: React.FC<BlockContainerProps> = ({
  children,
  title,
  type,
  state,
  order,
  onUnlock,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(state !== 'locked');

  // Анимация появления при разблокировке
  useEffect(() => {
    if (state === 'active' && !hasAppeared) {
      setIsAnimating(true);
      setHasAppeared(true);
      
      // Убираем анимацию через 500ms
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [state, hasAppeared]);

  // Пульсация при активации
  useEffect(() => {
    if (state === 'active' && hasAppeared) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [state, hasAppeared]);

  // Автоматическая разблокировка для заголовка
  useEffect(() => {
    if (type === 'title' && state === 'locked' && onUnlock) {
      const timer = setTimeout(() => {
        onUnlock();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, state, onUnlock]);

  const getIcon = () => {
    switch (state) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'active':
        switch (type) {
          case 'title':
            return <PlayCircle className="h-5 w-5 text-blue-600" />;
          case 'text':
            return <PlayCircle className="h-5 w-5 text-blue-600" />;
          case 'video':
            return <PlayCircle className="h-5 w-5 text-purple-600" />;
          case 'test':
            return <PlayCircle className="h-5 w-5 text-orange-600" />;
          case 'completion':
            return <PlayCircle className="h-5 w-5 text-green-600" />;
          default:
            return <PlayCircle className="h-5 w-5 text-blue-600" />;
        }
      case 'locked':
      default:
        return type === 'title' ? 
          <Clock className="h-5 w-5 text-gray-400" /> : 
          <Lock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCardStyles = () => {
    const baseStyles = 'transition-all duration-500 ease-out';
    
    switch (state) {
      case 'completed':
        return `${baseStyles} border-green-200 bg-green-50/50 shadow-sm`;
      case 'active':
        const typeColors = {
          title: 'border-blue-200 bg-blue-50/30 shadow-md ring-2 ring-blue-100',
          text: 'border-blue-200 bg-blue-50/30 shadow-md ring-2 ring-blue-100',
          video: 'border-purple-200 bg-purple-50/30 shadow-md ring-2 ring-purple-100',
          test: 'border-orange-200 bg-orange-50/30 shadow-md ring-2 ring-orange-100',
          completion: 'border-green-200 bg-green-50/30 shadow-md ring-2 ring-green-100'
        };
        return `${baseStyles} ${typeColors[type] || typeColors.text}`;
      case 'locked':
      default:
        return `${baseStyles} border-gray-200 bg-gray-50/50`;
    }
  };

  const getContentStyles = () => {
    if (state === 'locked') {
      return 'pointer-events-none select-none opacity-60';
    }
    if (!isUnlocked) {
      return 'pointer-events-none select-none opacity-60';
    }
    return '';
  };

  // Проверяем, разблокирован ли блок для интерактивности
  const isUnlocked = state === 'active' || state === 'completed';

  const getAnimationClass = () => {
    if (!hasAppeared && state !== 'locked') {
      return 'animate-slideInFromBottom';
    }
    if (isAnimating && state === 'active') {
      return 'animate-pulse';
    }
    return '';
  };

  const getOrderBadge = () => {
    if (type === 'title') return null;
    
    return (
      <div className={`
        absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
        ${state === 'completed' ? 'bg-green-500 text-white' : 
          state === 'active' ? 'bg-blue-500 text-white' : 
          'bg-gray-400 text-gray-600'}
        transition-colors duration-300
      `}>
        {order}
      </div>
    );
  };

  return (
    <div 
      className={`
        relative ${className} ${getAnimationClass()}
        ${state === 'locked' ? 'cursor-not-allowed' : ''}
      `}
      aria-disabled={state === 'locked'}
      role="region"
      aria-label={`${title} - ${state}`}
    >
      {getOrderBadge()}
      
      <Card className={getCardStyles()}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            {getIcon()}
            <span className={state === 'locked' ? 'text-gray-500' : ''}>{title}</span>
            
            {/* Состояние блока */}
            <div className="ml-auto">
              {state === 'locked' && type === 'title' && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Unlocking in 3s...
                </span>
              )}
              {state === 'locked' && type !== 'title' && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Locked
                </span>
              )}
              {state === 'active' && (
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Active
                </span>
              )}
              {state === 'completed' && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Completed
                </span>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className={getContentStyles()}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockContainer; 