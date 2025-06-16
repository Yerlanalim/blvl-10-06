import { NextRequest, NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { sendWeeklyProgressEmail } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    // Simple auth check - could be enhanced with API key in production
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createSSRSassClient();
    const client = supabase.getSupabaseClient();
    
    // Get all users who want email notifications
    const { data: users, error: usersError } = await client
      .from('user_profiles')
      .select(`
        id,
        first_name,
        email,
        current_level,
        created_at,
        ai_messages_count,
        tier_type
      `)
      .eq('email_notifications', true)
      .not('email', 'is', null);

    if (usersError) {
      console.error('[WEEKLY_PROGRESS] Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users found with email notifications enabled',
        emailsSent: 0
      });
    }

    let emailsSent = 0;
    let errors = 0;

    // Process each user
    for (const user of users) {
      try {
        // Calculate date range for this week
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Get user's progress for the past week
        const { count: levelsCompletedThisWeek } = await client
          .from('user_progress')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('completed_at', weekAgo.toISOString())
          .not('completed_at', 'is', null);

        // Get total completed levels
        const { count: totalLevelsCompleted } = await client
          .from('user_progress')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .not('completed_at', 'is', null);

        // Get total artifacts unlocked
        const { count: artifactsUnlocked } = await client
          .from('user_artifacts')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id);

        // Get current level info if exists
        let currentLevelInfo: { number: number; title: string; progress: number } | undefined = undefined;
        if (user.current_level && user.current_level <= 10) {
          const { data: currentLevel } = await client
            .from('levels')
            .select('title')
            .eq('order_index', user.current_level)
            .single();

          // Get current level progress
          const { data: currentProgress } = await client
            .from('user_progress')
            .select('current_step')
            .eq('user_id', user.id)
            .eq('level_id', user.current_level)
            .single();

          if (currentLevel) {
            // Estimate progress (assuming 3 steps per level)
            const stepProgress = currentProgress?.current_step || 0;
            const progressPercent = Math.round((stepProgress / 3) * 100);

            currentLevelInfo = {
              number: user.current_level,
              title: currentLevel.title,
              progress: Math.min(progressPercent, 100)
            };
          }
        } else {
          currentLevelInfo = undefined;
        }

        // Calculate AI messages for the week (approximation)
        const totalAIMessages = user.ai_messages_count || 0;
        const aiMessagesUsed = Math.min(totalAIMessages, 30); // Cap for display

        // Calculate remaining messages
        let aiMessagesRemaining = 0;
        if (user.tier_type === 'free') {
          aiMessagesRemaining = Math.max(0, 30 - totalAIMessages);
        } else {
          // For paid users, assume daily reset, so remaining is likely 30 - today's usage
          aiMessagesRemaining = Math.max(0, 30 - (totalAIMessages % 30));
        }

        // Send weekly progress email
        const result = await sendWeeklyProgressEmail(
          user.email || '',
          user.first_name || (user.email ? user.email.split('@')[0] : 'User'),
          {
            levelsCompletedThisWeek: levelsCompletedThisWeek || 0,
            totalLevelsCompleted: totalLevelsCompleted || 0,
            aiMessagesUsed,
            aiMessagesRemaining,
            artifactsUnlocked: artifactsUnlocked || 0,
            currentLevel: currentLevelInfo
          }
        );

        if (result.success) {
          emailsSent++;
          console.log(`[WEEKLY_PROGRESS] Email sent to ${user.email}`);
        } else {
          errors++;
          console.error(`[WEEKLY_PROGRESS] Failed to send email to ${user.email}:`, result.error);
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (userError) {
        errors++;
        console.error(`[WEEKLY_PROGRESS] Error processing user ${user.id}:`, userError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Weekly progress emails processed`,
      totalUsers: users.length,
      emailsSent,
      errors
    });

  } catch (error) {
    console.error('[WEEKLY_PROGRESS] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required for testing' },
        { status: 400 }
      );
    }

    // Send a test weekly progress email
    const result = await sendWeeklyProgressEmail(
      email,
      'Test User',
      {
        levelsCompletedThisWeek: 2,
        totalLevelsCompleted: 3,
        aiMessagesUsed: 15,
        aiMessagesRemaining: 15,
        artifactsUnlocked: 3,
        currentLevel: {
          number: 4,
          title: 'Advanced Business Strategy',
          progress: 66
        }
      }
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test weekly progress email sent successfully',
        emailId: result.emailId
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[WEEKLY_PROGRESS] Test email error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 