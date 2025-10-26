import { env } from '../config/env';

/**
 * Telegram Bot Service
 * Centralized service for sending Telegram notifications
 */

// Notification Types
interface WaitlistNotification {
  email: string;
  name?: string;
  source?: string;
  userType?: string;
  companyName?: string;
  teamSize?: string;
  paymentVolume?: string;
  useCase?: string;
  referralSource?: string;
}

interface FeedbackNotification {
  email?: string;
  name?: string;
  type: string;
  message: string;
}

interface DeploymentNotification {
  projectName?: string;
  environmentName?: string;
  serviceName?: string;
  commitMessage?: string;
  deploymentUrl?: string;
  error?: string;
}

/**
 * Core function to send messages to Telegram
 */
async function sendToTelegram(message: string): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    console.log('⚠️  Telegram not configured. Skipping notification.');
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
    }

    console.log('✅ Telegram notification sent');
  } catch (error) {
    console.error('❌ Failed to send Telegram notification:', error);
  }
}

/**
 * Helper to get formatted timestamp
 */
function getTimestamp(): string {
  return new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

// ============================================================================
// PUBLIC API - Notification Functions
// ============================================================================

/**
 * Send waitlist signup notification
 */
export async function sendTelegramNotification(data: WaitlistNotification): Promise<void> {
  const message = formatWaitlistMessage(data);
  await sendToTelegram(message);
}

/**
 * Send feedback/bug report notification
 */
export async function sendFeedbackNotification(data: FeedbackNotification): Promise<void> {
  const message = formatFeedbackMessage(data);
  await sendToTelegram(message);
}

/**
 * Send server status notification
 */
export async function sendServerNotification(
  type: 'startup' | 'crash' | 'shutdown',
  details?: string
): Promise<void> {
  const message = formatServerNotification(type, details);
  await sendToTelegram(message);
}

/**
 * Send Railway deployment notification
 */
export async function sendDeploymentNotification(
  status: 'started' | 'completed' | 'failed',
  data: DeploymentNotification
): Promise<void> {
  const message = formatDeploymentNotification(status, data);
  await sendToTelegram(message);
}

// ============================================================================
// Message Formatters
// ============================================================================

function formatWaitlistMessage(data: WaitlistNotification): string {
  const lines: string[] = ['🎉 <b>New Waitlist Signup!</b>', ''];

  const fields = [
    { label: '📧 Email', value: data.email },
    { label: '👤 Name', value: data.name },
    { label: '💼 Profile', value: data.userType ? formatUserType(data.userType) : undefined },
    { label: '🏢 Company', value: data.companyName },
    { label: '👥 Team Size', value: data.teamSize },
    { label: '💰 Monthly Volume', value: data.paymentVolume },
    { label: '📝 Use Case', value: data.useCase },
    { label: '🔗 Source', value: data.referralSource ? formatReferralSource(data.referralSource) : undefined },
  ];

  fields.forEach(({ label, value }) => {
    if (value) lines.push(`${label}: ${value}`);
  });

  lines.push('');
  lines.push(`📍 Signup From: ${data.source === 'landing' ? '🌐 Landing Page' : '📱 App'}`);
  lines.push(`⏰ Time: ${getTimestamp()}`);

  return lines.join('\n');
}

function formatFeedbackMessage(data: FeedbackNotification): string {
  const typeConfig: Record<string, { emoji: string; label: string }> = {
    bug: { emoji: '🐛', label: 'Bug Report' },
    feature: { emoji: '✨', label: 'Feature Request' },
    feedback: { emoji: '💬', label: 'Feedback' },
  };

  const { emoji, label } = typeConfig[data.type] || { emoji: '📝', label: 'Feedback' };
  const lines: string[] = [`${emoji} <b>New ${label}!</b>`, ''];

  const fields = [
    { label: '👤 Name', value: data.name },
    { label: '📧 Email', value: data.email },
  ];

  fields.forEach(({ label, value }) => {
    if (value) lines.push(`${label}: ${value}`);
  });

  lines.push('', '💭 <b>Message:</b>', data.message, '', `⏰ Time: ${getTimestamp()}`);

  return lines.join('\n');
}

function formatServerNotification(type: 'startup' | 'crash' | 'shutdown', details?: string): string {
  const isProduction = env.NODE_ENV === 'production';
  const envEmoji = isProduction ? '🚀' : '🔧';
  const envLabel = isProduction ? 'Production' : 'Development';
  const lines: string[] = [];

  if (type === 'startup') {
    lines.push(`${envEmoji} <b>Server Started</b>`, '', `🌍 Environment: ${envLabel}`, `📍 Port: ${env.PORT}`, `⏰ Time: ${getTimestamp()}`, '', '✅ Server is ready to handle requests!');
  } else if (type === 'crash') {
    lines.push('🔴 <b>Server Crash Detected!</b>', '', `🌍 Environment: ${envLabel}`);
    if (details) {
      lines.push('', '❌ <b>Error:</b>', details.substring(0, 500));
    }
    lines.push('', `⏰ Time: ${getTimestamp()}`);
  } else if (type === 'shutdown') {
    lines.push('🛑 <b>Server Shutting Down</b>', '', `🌍 Environment: ${envLabel}`, `⏰ Time: ${getTimestamp()}`);
  }

  return lines.join('\n');
}

function formatDeploymentNotification(status: 'started' | 'completed' | 'failed', data: DeploymentNotification): string {
  const statusConfig: Record<string, { emoji: string; title: string; footer?: string }> = {
    started: { emoji: '🚂', title: 'Railway Deployment Started', footer: '⏳ Deployment in progress...' },
    completed: { emoji: '✅', title: 'Railway Deployment Successful!', footer: '🎉 Your app is now live!' },
    failed: { emoji: '❌', title: 'Railway Deployment Failed', footer: '🛠️ Check Railway logs for details' },
  };

  const { emoji, title, footer } = statusConfig[status];
  const lines: string[] = [`${emoji} <b>${title}</b>`, ''];

  const fields = [
    { label: '📦 Project', value: data.projectName },
    { label: '⚙️ Service', value: data.serviceName },
    { label: '🌍 Environment', value: data.environmentName },
    { label: '💬 Commit', value: data.commitMessage },
    { label: '🔗 URL', value: data.deploymentUrl },
  ];

  fields.forEach(({ label, value }) => {
    if (value) lines.push(`${label}: ${value}`);
  });

  if (data.error) {
    lines.push('', '🔴 <b>Error:</b>', data.error.substring(0, 300));
  }

  if (footer) {
    lines.push('', footer);
  }

  lines.push('', `⏰ Time: ${getTimestamp()}`);

  return lines.join('\n');
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatUserType(userType: string): string {
  const types: Record<string, string> = {
    individual: '👤 Individual / Solo',
    freelancer: '💻 Freelancer',
    startup: '🚀 Startup Founder / Employee',
    enterprise: '🏢 Enterprise / Large Company',
    accountant: '📊 Accountant / Tax Professional',
    other: '🔹 Other',
  };
  return types[userType] || userType;
}

function formatReferralSource(source: string): string {
  const sources: Record<string, string> = {
    twitter: '🐦 Twitter / X',
    linkedin: '💼 LinkedIn',
    friend: '👥 Friend / Colleague',
    search: '🔍 Google / Search Engine',
    reddit: '🤖 Reddit',
    newsletter: '📰 Newsletter / Blog',
    other: '🔹 Other',
  };
  return sources[source] || source;
}
