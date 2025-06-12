import { notFound } from 'next/navigation';
import { createSSRClient } from '@/lib/supabase/server';
import UpgradeClient from './UpgradeClient';

export default async function UpgradePage() {
  const supabase = await createSSRClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return notFound();
  }
  
  // Get user profile for current tier
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('tier_type, current_level, ai_messages_count')
    .eq('user_id', user.id)
    .single();
  
  if (!userProfile) {
    return notFound();
  }
  
  return (
    <UpgradeClient 
      userId={user.id}
      currentTier={userProfile.tier_type as 'free' | 'paid'}
      currentLevel={userProfile.current_level}
      aiMessagesUsed={userProfile.ai_messages_count}
    />
  );
} 