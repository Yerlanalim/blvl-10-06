import { NextRequest, NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { sendEmail, EmailData } from '@/lib/email/send';
import { createErrorHandler, withGracefulDegradation } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  const errorHandler = createErrorHandler();
  
  try {
    const emailData = await request.json() as EmailData;

    // Validate required fields
    if (!emailData.to || !emailData.firstName || !emailData.type) {
      return errorHandler.validation('Missing required fields: to, firstName, type', {
        received: {
          to: !!emailData.to,
          firstName: !!emailData.firstName,
          type: !!emailData.type
        }
      });
    }

    // Check if user wants email notifications
    const supabase = await createSSRSassClient();
    const client = supabase.getSupabaseClient();
    const { data: userProfile, error: profileError } = await client
      .from('user_profiles')
      .select('email_notifications')
      .eq('email', emailData.to)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[EMAIL_SEND] Profile lookup error:', profileError);
      return errorHandler.internal('Failed to check user preferences', {
        supabaseError: profileError.message,
        errorCode: profileError.code
      });
    }

    // Skip sending if user has opted out
    if (userProfile && (userProfile as any).email_notifications === false) {
      return errorHandler.success({
        success: false,
        message: 'User has opted out of email notifications',
        skipped: true
      });
    }

    // Send the email
    const result = await sendEmail(emailData);

    if (result.success) {
      return errorHandler.success({
        success: true,
        emailId: result.emailId,
        message: 'Email sent successfully'
      });
    } else {
      return errorHandler.internal('Failed to send email', {
        emailError: result.error,
        emailType: emailData.type,
        recipient: emailData.to
      });
    }

  } catch (error) {
    console.error('[EMAIL_SEND] Unexpected error:', error);
    return errorHandler.internal('An unexpected error occurred', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    });
  }
}

// GET endpoint for testing with query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const email = searchParams.get('email');
    const firstName = searchParams.get('firstName');

    if (!type || !email || !firstName) {
      return NextResponse.json(
        { error: 'Missing required query parameters: type, email, firstName' },
        { status: 400 }
      );
    }

    // Create test email data based on type
    let emailData: EmailData;

    switch (type) {
      case 'welcome':
        emailData = {
          type: 'welcome',
          to: email,
          firstName,
          unsubscribeUrl: ''
        };
        break;

      case 'level-complete':
        emailData = {
          type: 'level-complete',
          to: email,
          firstName,
          levelNumber: 1,
          levelTitle: 'Business Model Fundamentals',
          nextLevelTitle: 'Market Research & Analysis',
          artifactsUnlocked: 1,
          totalLevelsCompleted: 1,
          unsubscribeUrl: ''
        };
        break;

      case 'weekly-progress':
        emailData = {
          type: 'weekly-progress',
          to: email,
          firstName,
          levelsCompletedThisWeek: 2,
          totalLevelsCompleted: 2,
          aiMessagesUsed: 15,
          aiMessagesRemaining: 15,
          artifactsUnlocked: 2,
          currentLevel: {
            number: 3,
            title: 'Financial Planning & Management',
            progress: 33
          },
          unsubscribeUrl: ''
        };
        break;

      case 'ai-quota-reminder':
        emailData = {
          type: 'ai-quota-reminder',
          to: email,
          firstName,
          messagesRemaining: 3,
          tierType: searchParams.get('tier') === 'paid' ? 'paid' : 'free',
          isDaily: searchParams.get('tier') === 'paid',
          unsubscribeUrl: ''
        };
        break;

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        );
    }

    // Send the test email
    const result = await sendEmail(emailData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        emailId: result.emailId,
        message: `Test ${type} email sent successfully`,
        testData: emailData
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
    console.error('[EMAIL_SEND] Test email error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 