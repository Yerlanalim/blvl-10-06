import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header Skeleton */}
      <div className="p-4 border-b space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Messages Area Skeleton */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {/* AI Quota indicator */}
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Message bubbles */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md space-y-2 ${
              i % 2 === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-lg p-3`}>
              <Skeleton className={`h-4 w-32 ${i % 2 === 0 ? 'bg-blue-400' : 'bg-gray-300'}`} />
              <Skeleton className={`h-4 w-24 ${i % 2 === 0 ? 'bg-blue-400' : 'bg-gray-300'}`} />
            </div>
          </div>
        ))}

        {/* Loading message */}
        <div className="flex justify-start">
          <div className="bg-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex space-x-1">
              <Skeleton className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
              <Skeleton className="h-2 w-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.2s]" />
              <Skeleton className="h-2 w-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      </div>

      {/* Input Area Skeleton */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Skeleton className="flex-1 h-10 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
} 