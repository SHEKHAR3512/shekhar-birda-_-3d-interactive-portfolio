import { emailService } from '../../src/lib/email/emailService';
import { whatsappService } from '../../src/lib/whatsapp/whatsappService';

export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  return res.status(200).json({
    aiProvider: process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? 'gemini' : 'grounded-local'),
    aiModel: process.env.AI_MODEL || 'gemini-2.5-flash',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasOllamaConfigured: Boolean(process.env.OLLAMA_BASE_URL),
    hasOpenAIConfigured: Boolean(process.env.OPENAI_API_KEY),
    email: emailService.getStatus(),
    whatsapp: whatsappService.getStatus(),
    timestamp: Date.now(),
  });
}
