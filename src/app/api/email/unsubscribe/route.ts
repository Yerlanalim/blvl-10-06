import { NextRequest, NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const supabase = await createSSRSassClient();
    const client = supabase.getSupabaseClient();

    // Update user preferences to disable email notifications
    const { error } = await client
      .from('user_profiles')
      .update({ 
        email_notifications: false,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) {
      console.error('[UNSUBSCRIBE] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to process unsubscribe request' },
        { status: 500 }
      );
    }

    // Return a simple HTML page confirming unsubscribe
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Unsubscribed - BizLevel</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 500px; 
              margin: 50px auto; 
              padding: 20px;
              text-align: center;
            }
            .container { 
              background: white; 
              border-radius: 12px; 
              padding: 40px; 
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              border: 1px solid #e5e7eb;
            }
            .checkmark { 
              font-size: 48px; 
              color: #10b981; 
              margin-bottom: 20px;
            }
            h1 { 
              color: #374151; 
              margin-bottom: 16px; 
            }
            p { 
              color: #6b7280; 
              margin-bottom: 24px; 
            }
            .button { 
              display: inline-block; 
              background: #2563eb; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600;
              margin-top: 20px;
            }
            .button:hover { 
              background: #1d4ed8; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="checkmark">✅</div>
            <h1>Successfully Unsubscribed</h1>
            <p>You have been unsubscribed from BizLevel email notifications.</p>
            <p>You can still access all your learning content and progress in your account.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/levels" class="button">
              Continue Learning
            </a>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('[UNSUBSCRIBE] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createSSRSassClient();
    const client = supabase.getSupabaseClient();

    // Update user preferences to disable email notifications
    const { error } = await client
      .from('user_profiles')
      .update({ 
        email_notifications: false,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) {
      console.error('[UNSUBSCRIBE] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to process unsubscribe request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from email notifications'
    });

  } catch (error) {
    console.error('[UNSUBSCRIBE] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 