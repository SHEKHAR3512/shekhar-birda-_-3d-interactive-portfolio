import { getAIProvider } from '../../src/lib/ai/aiProviders';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages = [], customerName = 'Visitor' } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array cannot be empty.' });
    }

    const provider = getAIProvider();
    const result = await provider.generateReply({ messages, customerName });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel Support chat error:', error);
    return res.status(500).json({
      error: 'Internal support error',
      text: 'Connecting to offline portfolio guide. You can also reach Shekhar directly at shekharjaat751@gmail.com.',
      modelUsed: 'Vercel Fallback Engine',
      handoffRequested: true,
    });
  }
}
