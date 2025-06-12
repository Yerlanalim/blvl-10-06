interface AIQuotaReminderEmailProps {
  firstName: string;
  messagesRemaining: number;
  tierType: 'free' | 'paid';
  isDaily: boolean; // true for paid users (daily reset), false for free users (total)
  unsubscribeUrl: string;
}

export function generateAIQuotaReminderEmail({
  firstName,
  messagesRemaining,
  tierType,
  isDaily,
  unsubscribeUrl
}: AIQuotaReminderEmailProps): string {
  const isFree = tierType === 'free';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Messages Running Low</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container { 
            background: white; 
            border-radius: 12px; 
            padding: 40px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .warning-emoji { 
            font-size: 48px; 
            margin-bottom: 10px;
          }
          .warning-title { 
            font-size: 24px; 
            color: #d97706; 
            margin-bottom: 20px;
          }
          .quota-section { 
            background: ${isFree ? '#fff7ed' : '#fef3c7'}; 
            border: 1px solid ${isFree ? '#fed7aa' : '#fcd34d'}; 
            border-radius: 12px; 
            padding: 24px; 
            margin: 20px 0;
            text-align: center;
          }
          .quota-number { 
            font-size: 48px; 
            font-weight: bold; 
            color: ${isFree ? '#ea580c' : '#d97706'}; 
            display: block;
            margin-bottom: 10px;
          }
          .quota-label { 
            font-size: 18px; 
            color: #374151; 
            margin-bottom: 16px;
          }
          .reset-info { 
            font-size: 14px; 
            color: #6b7280; 
            background: #f9fafb; 
            padding: 12px; 
            border-radius: 6px; 
            display: inline-block;
          }
          .tips-section { 
            background: #f0f9ff; 
            border-left: 4px solid #0ea5e9; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 0 8px 8px 0;
          }
          .upgrade-section { 
            background: #fef2f2; 
            border: 1px solid #fecaca; 
            border-radius: 12px; 
            padding: 24px; 
            margin: 20px 0; 
            text-align: center;
          }
          .cta-button { 
            display: inline-block; 
            background: #2563eb; 
            color: white; 
            padding: 14px 28px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            margin: 20px 0;
          }
          .upgrade-button { 
            background: #dc2626; 
          }
          .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            font-size: 14px; 
            color: #6b7280; 
            text-align: center;
          }
          .unsubscribe { 
            color: #9ca3af; 
            text-decoration: none; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="warning-emoji">⚠️</div>
            <h1 class="warning-title">AI Messages Running Low</h1>
            <p>Hi ${firstName}, your AI assistant quota needs attention!</p>
          </div>
          
          <div class="quota-section">
            <span class="quota-number">${messagesRemaining}</span>
            <div class="quota-label">Messages Remaining</div>
            <div class="reset-info">
              ${isDaily ? '🔄 Resets in less than 24 hours' : '❌ No automatic reset'}
            </div>
          </div>
          
          <div class="tips-section">
            <h3>💡 Make the Most of Your Remaining Messages</h3>
            <ul>
              <li><strong>Ask specific questions</strong> - Get focused answers about concepts you're studying</li>
              <li><strong>Request examples</strong> - Ask Leo for real-world applications of what you're learning</li>
              <li><strong>Get clarification</strong> - If something isn't clear, ask for simpler explanations</li>
              <li><strong>Review summaries</strong> - Ask for key takeaways from completed lessons</li>
            </ul>
          </div>
          
          ${isFree ? `
            <div class="upgrade-section">
              <h3>🚀 Get Unlimited Daily AI Access</h3>
              <p>Upgrade to Premium and get <strong>30 fresh AI messages every day</strong>!</p>
              <p>Plus unlock all 10 business levels and advanced learning materials.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/upgrade" class="cta-button upgrade-button">
                Upgrade to Premium
              </a>
            </div>
          ` : `
            <div style="background: #ecfdf5; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <h3 style="color: #059669; margin-top: 0;">✨ Premium Perks</h3>
              <p>As a Premium member, your AI quota resets every 24 hours!</p>
              <p>Check back tomorrow for 30 fresh messages with Leo.</p>
            </div>
          `}
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3>🎯 Continue Learning Without AI</h3>
            <p>Remember, you can always continue progressing through levels! Each level has rich content, videos, and tests that don't require AI assistance.</p>
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/levels" class="cta-button">
                Continue Learning
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>Happy learning!<br>The BizLevel Team</p>
            <p><a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe from these emails</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
} 