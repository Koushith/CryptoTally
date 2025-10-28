import { Resend } from 'resend';

/**
 * Email Service
 *
 * Handles sending emails for workspace invitations using Resend
 * Falls back to console logging if RESEND_API_KEY is not configured
 */

export interface WorkspaceInvitationEmailData {
  to: string;
  workspaceName: string;
  inviterName: string;
  role: string;
  inviteToken: string;
  expiresAt: Date;
}

export class EmailService {
  private static readonly FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
  private static readonly RESEND_API_KEY = process.env.RESEND_API_KEY;
  private static readonly FROM_EMAIL = process.env.FROM_EMAIL || 'CryptoTally <onboarding@resend.dev>';

  /**
   * Send workspace invitation email
   *
   * @param data - Invitation email data
   */
  static async sendWorkspaceInvitation(data: WorkspaceInvitationEmailData): Promise<void> {
    const inviteUrl = `${this.FRONTEND_URL}/invite/${data.inviteToken}`;
    const expiresInDays = Math.ceil(
      (new Date(data.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    // If Resend API key is configured, send actual email
    if (this.RESEND_API_KEY) {
      try {
        const resend = new Resend(this.RESEND_API_KEY);

        await resend.emails.send({
          from: this.FROM_EMAIL,
          to: data.to,
          subject: `${data.inviterName} invited you to join ${data.workspaceName}`,
          html: this.generateInvitationEmailHTML(data, inviteUrl, expiresInDays),
        });

        console.log(`✅ Invitation email sent to ${data.to}`);
        return;
      } catch (error) {
        console.error('❌ Failed to send email via Resend:', error);
        console.log('📝 Falling back to console logging...\n');
        // Fall through to console logging
      }
    }

    // Fallback: Log to console for development
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 WORKSPACE INVITATION EMAIL (Console Mode)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`To: ${data.to}`);
    console.log(`Subject: ${data.inviterName} invited you to join ${data.workspaceName}`);
    console.log('\n--- EMAIL BODY ---');
    console.log(`Hi there!`);
    console.log('');
    console.log(`${data.inviterName} has invited you to join the "${data.workspaceName}" workspace on CryptoTally as a ${data.role}.`);
    console.log('');
    console.log(`Click the link below to accept the invitation:`);
    console.log(`${inviteUrl}`);
    console.log('');
    console.log(`This invitation will expire in ${expiresInDays} days.`);
    console.log('');
    console.log(`If you don't have an account, you'll be able to create one when you accept the invitation.`);
    console.log('');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  }

  /**
   * Generate invitation email HTML
   * (Template for future email service integration)
   */
  private static generateInvitationEmailHTML(
    data: WorkspaceInvitationEmailData,
    inviteUrl: string,
    expiresInDays: number
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Workspace Invitation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">CryptoTally</h1>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">You've been invited!</h2>

            <p style="color: #4b5563; font-size: 16px;">
              <strong>${data.inviterName}</strong> has invited you to join the <strong>${data.workspaceName}</strong> workspace on CryptoTally as a <strong>${data.role}</strong>.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Accept Invitation
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              This invitation will expire in <strong>${expiresInDays} days</strong>.
            </p>

            <p style="color: #6b7280; font-size: 14px;">
              If you don't have an account, you'll be able to create one when you accept the invitation.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${inviteUrl}" style="color: #667eea; word-break: break-all;">${inviteUrl}</a>
            </p>

            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}
