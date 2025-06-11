import { createSSRClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ChatInterface from '@/components/chat/ChatInterface';

export default async function ChatPage() {
  const supabase = await createSSRClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="h-full flex flex-col">
      <ChatInterface userId={user.id} />
    </div>
  );
} 