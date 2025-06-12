interface WelcomeEmailProps {
  firstName: string;
  unsubscribeUrl: string;
}

export function generateWelcomeEmail({ firstName, unsubscribeUrl }: WelcomeEmailProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to BizLevel</title>
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
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 10px;
          }
          .welcome-title { 
            font-size: 24px; 
            color: #1f2937; 
            margin-bottom: 20px;
          }
          .content { 
            margin-bottom: 30px; 
          }
          .level-info { 
            background: #eff6ff; 
            border-left: 4px solid #2563eb; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 0 8px 8px 0;
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
            <div class="logo">🎯 BizLevel</div>
            <h1 class="welcome-title">Welcome to BizLevel, ${firstName}!</h1>
          </div>
          
          <div class="content">
            <p>Congratulations on joining BizLevel – the ultimate platform for mastering business skills in 10 structured levels!</p>
            
            <div class="level-info">
              <h3>🚀 Your Journey Starts Now</h3>
              <p><strong>Free Tier Benefits:</strong></p>
              <ul>
                <li>Access to first 3 business levels</li>
                <li>30 AI assistant messages (total)</li>
                <li>Downloadable learning materials</li>
                <li>Community access</li>
              </ul>
            </div>
            
            <p>Each level contains:</p>
            <ul>
              <li>📖 <strong>Text Content</strong> - Comprehensive learning materials</li>
              <li>🎥 <strong>Video Lessons</strong> - Expert-guided explanations</li>
              <li>📝 <strong>Knowledge Tests</strong> - Validate your understanding</li>
              <li>📊 <strong>Practical Artifacts</strong> - Real-world templates</li>
            </ul>
            
            <p>Ready to start your business mastery journey?</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/levels" class="cta-button">
                Start Level 1: Business Model Fundamentals
              </a>
            </div>
            
            <p>Need help? Leo, our AI assistant, is ready to guide you through your learning journey. Just visit the AI Assistant section in your dashboard.</p>
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