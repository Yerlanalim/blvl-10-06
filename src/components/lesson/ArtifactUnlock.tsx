"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Download, CheckCircle, Loader2, FileText, AlertCircle } from 'lucide-react';
import { createSPASassClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ArtifactTemplateType = Tables<'artifact_templates'>;

interface ArtifactUnlockProps {
  levelId: number;
  userId: string;
  artifactTemplate: ArtifactTemplateType | null;
}

export default function ArtifactUnlock({ levelId, userId, artifactTemplate }: ArtifactUnlockProps) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isAlreadyUnlocked, setIsAlreadyUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  const checkArtifactStatus = useCallback(async () => {
    try {
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();

      const { data, error } = await supabase
        .from('user_artifacts')
        .select('id')
        .eq('user_id', userId)
        .eq('level_id', levelId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsAlreadyUnlocked(!!data);
    } catch (err) {
      console.error('Error checking artifact status:', err);
    }
  }, [userId, levelId]);

  // Check if artifact is already unlocked
  useEffect(() => {
    if (levelId && userId && artifactTemplate) {
      checkArtifactStatus();
    }
  }, [levelId, userId, artifactTemplate, checkArtifactStatus]);

  const handleUnlockArtifact = useCallback(async () => {
    if (!artifactTemplate || isAlreadyUnlocked) return;

    try {
      setIsUnlocking(true);
      setError(null);

      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();

      // Create the user artifact record
      const { error: insertError } = await supabase
        .from('user_artifacts')
        .insert({
          user_id: userId,
          level_id: levelId,
          file_name: artifactTemplate.file_name,
          file_path: `artifacts/${artifactTemplate.file_name}`,
          file_id: null // Will be updated when actual file is uploaded
        });

      if (insertError) {
        throw insertError;
      }

      setIsAlreadyUnlocked(true);
      setUnlockSuccess(true);

      // Show success message for 3 seconds
      setTimeout(() => {
        setUnlockSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Error unlocking artifact:', err);
      setError(err instanceof Error ? err.message : 'Failed to unlock artifact');
    } finally {
      setIsUnlocking(false);
    }
  }, [userId, levelId, artifactTemplate, isAlreadyUnlocked]);

  const handleDownloadArtifact = useCallback(() => {
    if (!artifactTemplate) return;

    // Check SSR compatibility
    if (typeof window === 'undefined') return;

    // For now, just create a placeholder download
    // In a real implementation, this would download from Supabase storage
    const blob = new Blob(['This is a placeholder file for ' + artifactTemplate.title], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifactTemplate.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [artifactTemplate]);

  if (!artifactTemplate) {
    return null; // No artifact for this level
  }

  return (
    <Card className={`border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 transition-all duration-1000 ${unlockSuccess ? 'animate-pulse' : ''}`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
          {isAlreadyUnlocked ? (
            <CheckCircle className="h-8 w-8 text-white" />
          ) : (
            <Gift className="h-8 w-8 text-white animate-bounce" />
          )}
        </div>
        <CardTitle className="text-2xl font-bold text-purple-800">
          {isAlreadyUnlocked ? 'Material Unlocked!' : 'Bonus Material Unlocked!'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {unlockSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Artifact successfully unlocked! You can now download your materials.
            </AlertDescription>
          </Alert>
        )}

        {/* Artifact Details */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <FileText className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-purple-800">{artifactTemplate.file_type.includes('pdf') ? 'PDF Document' : 'Excel Workbook'}</span>
          </div>
          
          <h3 className="text-xl font-bold text-purple-900">
            {artifactTemplate.title}
          </h3>
          
          <p className="text-purple-700 leading-relaxed max-w-md mx-auto">
            {artifactTemplate.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          {isAlreadyUnlocked ? (
            <Button 
              onClick={handleDownloadArtifact}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Material
            </Button>
          ) : (
            <Button 
              onClick={handleUnlockArtifact}
              disabled={isUnlocking}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isUnlocking ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  <Gift className="h-5 w-5 mr-2" />
                  Unlock Material
                </>
              )}
            </Button>
          )}
        </div>

        {/* Bonus Message */}
        {!isAlreadyUnlocked && (
          <div className="text-center">
            <p className="text-sm text-purple-600 font-medium">
              🎉 Congratulations! Complete this level to unlock your bonus material
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 