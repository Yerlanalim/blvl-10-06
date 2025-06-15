import { Resend } from 'resend';
import { generateWelcomeEmail } from './templates/welcome';
import { generateLevelCompleteEmail } from './templates/level-complete';
import { generateWeeklyProgressEmail } from './templates/weekly-progress';
import { generateAIQuotaReminderEmail } from './templates/ai-quota-reminder';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email types for different notifications
export type EmailType = 'welcome' | 'level-complete' | 'weekly-progress' | 'ai-quota-reminder';

// Base email configuration
interface BaseEmailData {
  to: string;
  firstName: string;
  unsubscribeUrl: string;
}

// Specific email data interfaces
export interface WelcomeEmailData extends BaseEmailData {
  type: 'welcome';
}

export interface LevelCompleteEmailData extends BaseEmailData {
  type: 'level-complete';
  levelNumber: number;
  levelTitle: string;
  nextLevelTitle?: string;
  artifactsUnlocked: number;
  totalLevelsCompleted: number;
}

export interface WeeklyProgressEmailData extends BaseEmailData {
  type: 'weekly-progress';
  levelsCompletedThisWeek: number;
  totalLevelsCompleted: number;
  aiMessagesUsed: number;
  aiMessagesRemaining: number;
  artifactsUnlocked: number;
  currentLevel?: {
    number: number;
    title: string;
    progress: number;
  };
}

export interface AIQuotaReminderEmailData extends BaseEmailData {
  type: 'ai-quota-reminder';
  messagesRemaining: number;
  tierType: 'free' | 'paid';
  isDaily: boolean;
}

export type EmailData = 
  | WelcomeEmailData 
  | LevelCompleteEmailData 
  | WeeklyProgressEmailData 
  | AIQuotaReminderEmailData;

// Email sending result
export interface EmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

// Generate unsubscribe URL
function generateUnsubscribeUrl(email: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const encodedEmail = encodeURIComponent(email);
  return `${baseUrl}/api/email/unsubscribe?email=${encodedEmail}`;
}

// Email subject generators
function getEmailSubject(emailData: EmailData): string {
  switch (emailData.type) {
    case 'welcome':
      return '🎯 Welcome to BizLevel - Your Business Mastery Journey Begins!';
    case 'level-complete':
      return `🎉 Level ${emailData.levelNumber} Complete - ${emailData.levelTitle}`;
    case 'weekly-progress':
      return '📈 Your Weekly BizLevel Progress Report';
    case 'ai-quota-reminder':
      return `⚠️ AI Messages Running Low - ${emailData.messagesRemaining} Remaining`;
    default:
      return 'BizLevel Notification';
  }
}

// Generate email HTML content
function generateEmailHTML(emailData: EmailData): string {
  const unsubscribeUrl = generateUnsubscribeUrl(emailData.to);
  
  switch (emailData.type) {
    case 'welcome':
      return generateWelcomeEmail({
        firstName: emailData.firstName,
        unsubscribeUrl
      });
      
    case 'level-complete':
      return generateLevelCompleteEmail({
        firstName: emailData.firstName,
        levelNumber: emailData.levelNumber,
        levelTitle: emailData.levelTitle,
        nextLevelTitle: emailData.nextLevelTitle,
        artifactsUnlocked: emailData.artifactsUnlocked,
        totalLevelsCompleted: emailData.totalLevelsCompleted,
        unsubscribeUrl
      });
      
    case 'weekly-progress':
      return generateWeeklyProgressEmail({
        firstName: emailData.firstName,
        levelsCompletedThisWeek: emailData.levelsCompletedThisWeek,
        totalLevelsCompleted: emailData.totalLevelsCompleted,
        aiMessagesUsed: emailData.aiMessagesUsed,
        aiMessagesRemaining: emailData.aiMessagesRemaining,
        artifactsUnlocked: emailData.artifactsUnlocked,
        currentLevel: emailData.currentLevel,
        unsubscribeUrl
      });
      
    case 'ai-quota-reminder':
      return generateAIQuotaReminderEmail({
        firstName: emailData.firstName,
        messagesRemaining: emailData.messagesRemaining,
        tierType: emailData.tierType,
        isDaily: emailData.isDaily,
        unsubscribeUrl
      });
      
    default:
      throw new Error(`Unknown email type: ${(emailData as any).type}`);
  }
}

// Log email attempt
async function logEmailAttempt(emailData: EmailData, result: EmailResult) {
  try {
    console.log(`[EMAIL] ${emailData.type} to ${emailData.to}:`, {
      success: result.success,
      emailId: result.emailId,
      error: result.error,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[EMAIL] Logging failed:', error);
  }
}

// Main function to send emails
export async function sendEmail(emailData: EmailData): Promise<EmailResult> {
  try {
    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    // Generate email content
    const subject = getEmailSubject(emailData);
    const html = generateEmailHTML(emailData);
    
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'BizLevel <noreply@bizlevel.com>',
      to: [emailData.to],
      subject,
      html,
      headers: {
        'List-Unsubscribe': `<${generateUnsubscribeUrl(emailData.to)}>`,
      },
    });

    if (error) {
      const result: EmailResult = {
        success: false,
        error: `Resend API error: ${error.message || 'Unknown error'}`
      };
      await logEmailAttempt(emailData, result);
      return result;
    }

    const result: EmailResult = {
      success: true,
      emailId: data?.id
    };
    
    await logEmailAttempt(emailData, result);
    return result;

  } catch (error) {
    const result: EmailResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    await logEmailAttempt(emailData, result);
    return result;
  }
}

// Convenience functions for specific email types
export async function sendWelcomeEmail(
  to: string, 
  firstName: string
): Promise<EmailResult> {
  return sendEmail({
    type: 'welcome',
    to,
    firstName,
    unsubscribeUrl: generateUnsubscribeUrl(to)
  });
}

export async function sendLevelCompleteEmail(
  to: string,
  firstName: string,
  levelData: {
    levelNumber: number;
    levelTitle: string;
    nextLevelTitle?: string;
    artifactsUnlocked: number;
    totalLevelsCompleted: number;
  }
): Promise<EmailResult> {
  return sendEmail({
    type: 'level-complete',
    to,
    firstName,
    unsubscribeUrl: generateUnsubscribeUrl(to),
    ...levelData
  });
}

export async function sendWeeklyProgressEmail(
  to: string,
  firstName: string,
  progressData: {
    levelsCompletedThisWeek: number;
    totalLevelsCompleted: number;
    aiMessagesUsed: number;
    aiMessagesRemaining: number;
    artifactsUnlocked: number;
    currentLevel?: {
      number: number;
      title: string;
      progress: number;
    };
  }
): Promise<EmailResult> {
  return sendEmail({
    type: 'weekly-progress',
    to,
    firstName,
    unsubscribeUrl: generateUnsubscribeUrl(to),
    ...progressData
  });
}

export async function sendAIQuotaReminderEmail(
  to: string,
  firstName: string,
  quotaData: {
    messagesRemaining: number;
    tierType: 'free' | 'paid';
    isDaily: boolean;
  }
): Promise<EmailResult> {
  return sendEmail({
    type: 'ai-quota-reminder',
    to,
    firstName,
    unsubscribeUrl: generateUnsubscribeUrl(to),
    ...quotaData
  });
} 