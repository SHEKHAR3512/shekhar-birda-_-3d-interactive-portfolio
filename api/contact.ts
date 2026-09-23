import { emailService } from '../src/lib/email/emailService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, company, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }

    const emailSubject = `[Portfolio Inquiry] ${subject || 'New Client / Recruiter Transmission'}`;
    const emailBody = `
New Direct Work Inquiry via Shekhar Birda's 3D Interactive Portfolio:
===================================================================

Sender Name   : ${name}
Sender Email  : ${email}
Company / Org : ${company || 'N/A'}
Subject       : ${subject || 'General Inquiry'}
Timestamp     : ${new Date().toISOString()}

Message:
-------------------------------------------------------------------
${message}
-------------------------------------------------------------------

You can reply directly to: ${email}
`;

    const htmlBody = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f172a, #1e1b4b); color: #ffffff; padding: 24px;">
          <h2 style="margin: 0; font-size: 20px; color: #38bdf8;">✦ New Transmission: Shekhar Birda Portfolio</h2>
          <p style="margin: 6px 0 0 0; font-size: 14px; color: #94a3b8;">Direct client/recruiter inquiry from 3D Cosmos</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px; color: #64748b;">Sender:</td>
              <td style="padding: 6px 0; color: #0f172a;">${name} &lt;<a href="mailto:${email}">${email}</a>&gt;</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Company:</td>
              <td style="padding: 6px 0; color: #0f172a;">${company || 'Not Specified'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Subject:</td>
              <td style="padding: 6px 0; color: #0f172a;">${subject || 'General Work Inquiry'}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <h4 style="margin: 0 0 10px 0; color: #334155;">Message Content:</h4>
          <div style="background: #f8fafc; padding: 16px; border-radius: 6px; border-left: 4px solid #38bdf8; white-space: pre-wrap; font-size: 15px;">${message}</div>
          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${email}?subject=Re:%20${encodeURIComponent(subject || 'Portfolio Inquiry')}" style="display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-weight: bold;">Reply to ${name}</a>
          </div>
        </div>
      </div>
    `;

    // Dispatch email to Shekhar Birda
    const targetEmail = process.env.NOTIFICATION_EMAIL || 'shekharbirda@gmail.com';
    const dispatchResult = await emailService.sendEmail({
      to: targetEmail,
      subject: emailSubject,
      text: emailBody,
      html: htmlBody,
    });

    return res.status(200).json({
      success: true,
      messageId: dispatchResult.messageId,
      simulated: dispatchResult.simulated,
      message: 'Inquiry received and queued for dispatch.',
    });
  } catch (error: any) {
    console.error('[API /api/contact] Error processing inquiry:', error);
    return res.status(500).json({ error: error?.message || 'Internal Server Error' });
  }
}
