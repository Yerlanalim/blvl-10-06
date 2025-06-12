interface LevelCompleteEmailProps {
  firstName: string;
  levelNumber: number;
  levelTitle: string;
  nextLevelTitle?: string;
  artifactsUnlocked: number;
  totalLevelsCompleted: number;
  unsubscribeUrl: string;
}

export function generateLevelCompleteEmail({
  firstName,
  levelNumber,
  levelTitle,
  nextLevelTitle,
  artifactsUnlocked,
  totalLevelsCompleted,
  unsubscribeUrl
}: LevelCompleteEmailProps): string {
  const isUpgradeNeeded = levelNumber >= 3 && !nextLevelTitle;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Level ${levelNumber} Complete!</title>
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
          .celebration { 
            font-size: 48px; 
            margin-bottom: 10px;
          }
          .congrats-title { 
            font-size: 24px; 
            color: #059669; 
            margin-bottom: 20px;
          }
          .level-badge { 
            background: linear-gradient(135deg, #10b981, #059669); 
            color: white; 
            padding: 16px 32px; 
            border-radius: 50px; 
            font-weight: bold; 
            font-size: 18px;
            display: inline-block;
            margin: 10px 0;
          }
          .progress-section { 
            background: #f0fdf4; 
            border-left: 4px solid #10b981; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 0 8px 8px 0;
          }
          .stats-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin: 20px 0;
          }
          .stat-item { 
            text-align: center; 
            padding: 15px; 
            background: #f8fafc; 
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .stat-number { 
            font-size: 24px; 
            font-weight: bold; 
            color: #2563eb; 
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
            <div class="celebration">🎉</div>
            <h1 class="congrats-title">Congratulations, ${firstName}!</h1>
            <div class="level-badge">Level ${levelNumber} Complete</div>
            <h2>${levelTitle}</h2>
          </div>
          
          <div class="progress-section">
            <h3>🏆 Your Achievement</h3>
            <p>You've successfully completed <strong>Level ${levelNumber}: ${levelTitle}</strong>!</p>
            
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-number">${totalLevelsCompleted}</div>
                <div>Levels Completed</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${artifactsUnlocked}</div>
                <div>Artifacts Unlocked</div>
              </div>
            </div>
          </div>
          
          ${nextLevelTitle ? `
            <div style="text-align: center; margin: 30px 0;">
              <p><strong>Ready for the next challenge?</strong></p>
              <p>Level ${levelNumber + 1}: ${nextLevelTitle} is now unlocked!</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/lesson/${levelNumber + 1}?step=1" class="cta-button">
                Start Level ${levelNumber + 1}
              </a>
            </div>
          ` : ''}
          
          ${isUpgradeNeeded ? `
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
              <p><strong>🚀 Ready to unlock all 10 levels?</strong></p>
              <p>Upgrade to Premium to access advanced business levels and get 30 AI messages daily!</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/upgrade" class="cta-button upgrade-button">
                Upgrade to Premium
              </a>
            </div>
          ` : ''}
          
          <div style="margin: 30px 0;">
            <h3>💡 Your Learning Materials</h3>
            <p>Don't forget to download your newly unlocked artifacts from the <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/storage">My Materials</a> section. These practical templates will help you implement what you've learned!</p>
          </div>
          
          <div class="footer">
            <p>Keep up the excellent work!<br>The BizLevel Team</p>
            <p><a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe from these emails</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
} 