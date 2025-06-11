"use client";

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserArtifacts } from '@/lib/hooks/useUserArtifacts';
import { Download, ExternalLink } from 'lucide-react';

interface ArtifactsListProps {
  userId: string;
}

export function ArtifactsList({ userId }: ArtifactsListProps) {
  const { artifactsData, loading, error } = useUserArtifacts(userId);
  const router = useRouter();

  const handleViewAll = useCallback(() => {
    router.push('/app/storage');
  }, [router]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Learning Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading materials...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Learning Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600">Failed to load materials</div>
        </CardContent>
      </Card>
    );
  }

  const totalCount = artifactsData?.totalCount || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Learning Materials ({totalCount} unlocked)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalCount === 0 ? (
          <div className="text-sm text-muted-foreground">
            Complete lessons to unlock learning materials
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {artifactsData?.artifacts.slice(0, 3).map((levelArtifact) => (
                <div
                  key={levelArtifact.level_id}
                  className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded">
                      Level {levelArtifact.level_order}
                    </span>
                    <span className="text-sm font-medium">
                      {levelArtifact.artifact?.file_name || 'Material'}
                    </span>
                  </div>
                  <div className="text-green-600">
                    ✓
                  </div>
                </div>
              ))}
              
              {totalCount > 3 && (
                <div className="text-xs text-muted-foreground px-3">
                  ... and {totalCount - 3} more materials
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAll}
              className="w-full flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View All Materials
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
} 