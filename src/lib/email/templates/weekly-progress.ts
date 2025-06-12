interface WeeklyProgressEmailProps {
  firstName: string;
  levelsCompletedThisWeek: number;
  totalLevelsCompleted: number;
  aiMessagesUsed: number;
  aiMessagesRemaining: number;
  artifactsUnlocked: number;
  currentLevel?: {
    number: number;
    title: string;
    progress: number; // 0-100
  };
  unsubscribeUrl: string;
}

export function generateWeeklyProgressEmail({
  firstName,
  levelsCompletedThisWeek,
  totalLevelsCompleted,
  aiMessagesUsed,
  aiMessagesRemaining,
  artifactsUnlocked,
  currentLevel,
  unsubscribeUrl
}: WeeklyProgressEmailProps): string {
  const hasProgress = levelsCompletedThisWeek > 0 || aiMessagesUsed > 0;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Weekly Progress</title>
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
          .week-emoji { 
            font-size: 48px; 
            margin-bottom: 10px;
          }
          .week-title { 
            font-size: 24px; 
            color: #374151; 
            margin-bottom: 20px;
          }
          .stats-section { 
            background: #f8fafc; 
            border-radius: 12px; 
            padding: 24px; 
            margin: 20px 0;
          }
          .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 16px; 
            margin: 20px 0;
          }
          .stat-card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center;
            border: 1px solid #e5e7eb;
          }
          .stat-number { 
            font-size: 28px; 
            font-weight: bold; 
            color: #2563eb; 
            display: block;
          }
          .stat-label { 
            font-size: 14px; 
            color: #6b7280; 
            margin-top: 4px;
          }
          .current-level { 
            background: linear-gradient(135deg, #eff6ff, #dbeafe); 
            border: 1px solid #93c5fd; 
            border-radius: 12px; 
            padding: 24px; 
            margin: 20px 0;
          }
          .progress-bar { 
            background: #e5e7eb; 
            border-radius: 10px; 
            height: 12px; 
            overflow: hidden; 
            margin: 15px 0;
          }
          .progress-fill { 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
            height: 100%; 
            border-radius: 10px; 
            transition: width 0.3s ease;
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
          .encouragement { 
            background: #f0f9ff; 
            border-left: 4px solid #0ea5e9; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 0 8px 8px 0;
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
            <div class="week-emoji">${hasProgress ? '📈' : '💙'}</div>
            <h1 class="week-title">Your Weekly Progress</h1>
            <p>Hello ${firstName}! Here's how you did this week on BizLevel.</p>
          </div>
          
          <div class="stats-section">
            <h3>📊 This Week's Stats</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-number">${levelsCompletedThisWeek}</span>
                <div class="stat-label">Levels Completed</div>
              </div>
              <div class="stat-card">
                <span class="stat-number">${totalLevelsCompleted}</span>
                <div class="stat-label">Total Levels</div>
              </div>
              <div class="stat-card">
                <span class="stat-number">${aiMessagesUsed}</span>
                <div class="stat-label">AI Messages Used</div>
              </div>
              <div class="stat-card">
                <span class="stat-number">${artifactsUnlocked}</span>
                <div class="stat-label">Artifacts Unlocked</div>
              </div>
            </div>
          </div>
          
          ${currentLevel ? `
            <div class="current-level">
              <h3>🎯 Current Progress</h3>
              <p><strong>Level ${currentLevel.number}: ${currentLevel.title}</strong></p>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${currentLevel.progress}%"></div>
              </div>
              <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">
                ${currentLevel.progress}% complete
              </p>
            </div>
          ` : ''}
          
          ${aiMessagesRemaining > 0 ? `
            <div style="background: #ecfdf5; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #059669; margin-top: 0;">🤖 AI Assistant Available</h3>
              <p>You have <strong>${aiMessagesRemaining} AI messages</strong> remaining. Leo is ready to help you understand concepts and guide your learning!</p>
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/chat" class="cta-button">
                  Chat with Leo
                </a>
              </div>
            </div>
          ` : ''}
          
          ${!hasProgress ? `
            <div class="encouragement">
              <h3>💪 Ready to Continue?</h3>
              <p>We noticed you haven't made progress this week. That's okay! Every expert was once a beginner.</p>
              <p>Even 15 minutes of learning can make a difference. Your business mastery journey is waiting!</p>
            </div>
          ` : `
            <div class="encouragement">
              <h3>🚀 Great Progress!</h3>
              <p>You're building real business skills with every lesson. Keep up the momentum!</p>
              <p>Remember: consistency beats intensity. A little progress each day leads to big results.</p>
            </div>
          `}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/levels" class="cta-button">
              Continue Learning
            </a>
          </div>
          
          <div class="footer">
            <p>Keep learning, keep growing!<br>The BizLevel Team</p>
            <p><a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe from these emails</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
} 