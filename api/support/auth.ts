export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { passcode } = req.body || {};
  const adminSecret = process.env.AUTH_SECRET || 'SHEKHAR999';

  if (passcode === adminSecret) {
    const token = `adm_${Buffer.from(Date.now().toString()).toString('base64')}_sec`;
    return res.status(200).json({ success: true, token, agentName: 'Shekhar Birda (Lead Architect)' });
  }

  return res.status(401).json({ success: false, error: 'Invalid admin authentication passcode.' });
}
