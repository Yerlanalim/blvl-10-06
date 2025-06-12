import { Skeleton } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Level Header Skeleton */}
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-80 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      {/* Step Indicator Skeleton */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-full" />
        ))}
      </div>

      {/* Main Content Card Skeleton */}
      <div className="border rounded-lg p-6 space-y-6">
        {/* Card Header */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {/* Text content skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Video placeholder or other content */}
          <Skeleton className="h-64 w-full rounded-md" />

          {/* Buttons area */}
          <div className="flex justify-center">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>

      {/* Navigation Buttons Skeleton */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
} 