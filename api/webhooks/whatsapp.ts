import { whatsappService } from '../../src/lib/whatsapp/whatsappService';

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;

    const verified = whatsappService.verifyWebhook(mode, token, challenge);
    if (verified) {
      return res.status(200).send(verified);
    }
    return res.status(403).send('Forbidden');
  }

  if (req.method === 'POST') {
    try {
      const parsed = whatsappService.parseWebhookPayload(req.body);
      if (parsed) {
        console.log(`[Vercel Webhook: WhatsApp] Message from ${parsed.senderPhone}: "${parsed.messageText}"`);
      }
      return res.status(200).json({ status: 'received' });
    } catch {
      return res.status(500).json({ error: 'Webhook processing error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
