import { createSSRClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';

// Dynamic import для ChatInterface с loading состоянием
const ChatInterface = dynamic(() => import('@/components/chat/ChatInterface'), {
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-600">Loading AI Assistant...</p>
      </div>
    </div>
  )
});

export default async function ChatPage() {
  const supabase = await createSSRClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="h-full flex flex-col">
      <ErrorBoundary>
        <ChatInterface userId={user.id} />
      </ErrorBoundary>
    </div>
  );
} 