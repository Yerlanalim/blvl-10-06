"use client";

import { useEffect, useState, useCallback } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { LevelArtifacts, UserArtifactsResult } from '@/lib/types';
import { realtimeManager } from '@/lib/supabase/realtime-manager';

export function useUserArtifacts(userId?: string) {
  const [artifactsData, setArtifactsData] = useState<UserArtifactsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserArtifacts = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      // Get user artifacts with level information in one query
      const { data: artifacts, error: artifactsError } = await supabase
        .from('user_artifacts')
        .select(`
          id,
          file_id,
          file_name,
          file_path,
          unlocked_at,
          level_id,
          level:levels(id, title, order_index)
        `)
        .eq('user_id', userId)
        .order('level_id', { ascending: true });

      if (artifactsError) {
        throw artifactsError;
      }

      if (!artifacts) {
        setArtifactsData({
          artifacts: [],
          artifactsByLevel: {},
          totalCount: 0
        });
        return;
      }

      // Create artifacts by level (one artifact per level)
      const artifactsByLevel: Record<number, LevelArtifacts> = {};
      
      artifacts.forEach(artifact => {
        const levelId = artifact.level_id;
        
        artifactsByLevel[levelId] = {
          level_id: levelId,
          level_title: artifact.level?.title || `Level ${levelId}`,
          level_order: artifact.level?.order_index || levelId,
          artifact: {
            id: artifact.id,
            file_id: artifact.file_id,
            file_name: artifact.file_name,
            file_path: artifact.file_path,
            unlocked_at: artifact.unlocked_at,
            level_id: artifact.level_id
          }
        };
      });

      // Convert to array and sort by level order
      const artifactsArray = Object.values(artifactsByLevel)
        .sort((a, b) => a.level_order - b.level_order);

      setArtifactsData({
        artifacts: artifactsArray,
        artifactsByLevel,
        totalCount: artifacts.length
      });
      
    } catch (err) {
      console.error('Error loading user artifacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load artifacts');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadUserArtifacts();
    
    // Set up realtime subscription using centralized manager
    const subscriberId = `useUserArtifacts-${userId}-${Date.now()}`;
    let cleanup: (() => void) | null = null;
    
    const setupSubscription = async () => {
      try {
        const unsubscribe = await realtimeManager.subscribe(
          userId,
          {
            table: 'user_artifacts',
            event: '*',
            filter: `user_id=eq.${userId}`,
            callback: loadUserArtifacts
          },
          subscriberId
        );

        cleanup = () => unsubscribe();
      } catch (error) {
        console.warn('Failed to setup realtime subscription for artifacts:', error);
      }
    };

    setupSubscription();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [userId, loadUserArtifacts]);

  const refreshArtifacts = () => {
    if (userId) {
      loadUserArtifacts();
    }
  };

  return {
    artifactsData,
    loading,
    error,
    refreshArtifacts
  };
} 