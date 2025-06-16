"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const router = useRouter();

  useEffect(() => {
    const redirectToNewUX = async () => {
      const resolvedParams = await params;
      // Redirect to new progressive UX
      router.replace(`/app/level/${resolvedParams.id}`);
    };
    
    redirectToNewUX();
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600">Redirecting to new experience...</p>
      </div>
    </div>
  );
} 