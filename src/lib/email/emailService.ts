import nodemailer from 'nodemailer';

export interface EmailSendOptions {
  to: string;
  subject: string;
  html?: string;
  text: string;
  inReplyTo?: string;
}

export interface EmailWebhookPayload {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  messageId?: string;
}

export class EmailService {
  private host: string;
  private port: number;
  private user: string;
  private pass: string;
  private fromEmail: string;

  constructor() {
    this.host = process.env.EMAIL_HOST || '';
    this.port = parseInt(process.env.EMAIL_PORT || '587', 10);
    this.user = process.env.EMAIL_USER || '';
    this.pass = process.env.EMAIL_PASSWORD || '';
    this.fromEmail = process.env.SUPPORT_EMAIL || 'shekharbirda@gmail.com';
  }

  public isConfigured(): boolean {
    return Boolean(this.host && this.user && this.pass);
  }

  public getStatus(): { configured: boolean; host?: string; supportEmail: string; mode: string } {
    return {
      configured: this.isConfigured(),
      host: this.host ? `${this.host}:${this.port}` : undefined,
      supportEmail: this.fromEmail,
      mode: this.isConfigured() ? 'Live SMTP Provider (Nodemailer)' : 'Simulation & Diagnostic Adapter',
    };
  }

  public async sendEmail(options: EmailSendOptions): Promise<{ success: boolean; messageId: string; simulated?: boolean }> {
    if (!this.isConfigured()) {
      console.log(`[EmailService] Outbound Notice (Configure EMAIL_HOST/USER/PASSWORD in .env for live SMTP): To: ${options.to} | Subject: "${options.subject}"`);
      return {
        success: true,
        messageId: `sim-mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        simulated: true,
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        host: this.host,
        port: this.port,
        secure: this.port === 465,
        auth: {
          user: this.user,
          pass: this.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${process.env.SENDER_NAME || 'Shekhar Birda Portfolio'}" <${this.fromEmail || this.user}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        inReplyTo: options.inReplyTo,
      });

      console.log(`[EmailService] Outbound email dispatched successfully: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
        simulated: false,
      };
    } catch (err: any) {
      console.error('[EmailService] SMTP Dispatch error:', err?.message);
      throw err;
    }
  }

  public handleIncomingEmailWebhook(payload: EmailWebhookPayload): {
    conversationId?: string;
    sender: string;
    subject: string;
    content: string;
  } {
    console.log(`[EmailService] Inbound email received from ${payload.from}: "${payload.subject}"`);
    return {
      sender: payload.from,
      subject: payload.subject || 'Inbound Email Inquiry',
      content: payload.text || 'No message content provided.',
    };
  }
}

export const emailService = new EmailService();
