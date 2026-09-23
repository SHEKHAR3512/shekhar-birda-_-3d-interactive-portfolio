import { emailService } from '../../src/lib/email/emailService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { id, subject, description, customerName, customerEmail, category, priority } = req.body || {};

    if (!subject || !customerEmail) {
      return res.status(400).json({ error: 'Subject and customer email are required.' });
    }

    const emailSubject = `[Support Ticket #${id || 'NEW'}] ${priority?.toUpperCase() || 'NORMAL'}: ${subject}`;
    const emailBody = `
New Support Ticket Opened in Shekhar Birda's Portfolio Support Hub:
===================================================================

Ticket ID      : ${id || 'N/A'}
Priority       : ${priority || 'normal'}
Category       : ${category || 'technical'}
Customer Name  : ${customerName || 'Anonymous Explorer'}
Customer Email : ${customerEmail}
Timestamp      : ${new Date().toISOString()}

Description:
-------------------------------------------------------------------
${description || 'No description provided.'}
-------------------------------------------------------------------

You can reply directly to: ${customerEmail}
`;

    const targetEmail = process.env.NOTIFICATION_EMAIL || 'shekharbirda@gmail.com';
    const result = await emailService.sendEmail({
      to: targetEmail,
      subject: emailSubject,
      text: emailBody,
    });

    return res.status(200).json({
      success: true,
      ticketId: id,
      messageId: result.messageId,
      simulated: result.simulated,
    });
  } catch (err: any) {
    console.error('[API /api/support/ticket] Error:', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
