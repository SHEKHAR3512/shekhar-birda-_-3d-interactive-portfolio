import { emailService } from '../../src/lib/email/emailService';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const incoming = emailService.handleIncomingEmailWebhook(req.body);
    return res.status(200).json({ status: 'received', subject: incoming.subject });
  } catch {
    return res.status(500).json({ error: 'Email webhook processing error' });
  }
}
