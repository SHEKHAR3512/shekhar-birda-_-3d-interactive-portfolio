import { SupportMessage, KnowledgeDoc } from '../support/types';
import { queryKnowledgeDocs, buildRAGContext } from '../knowledge/knowledgeBase';

export interface ProviderResponse {
  text: string;
  modelUsed: string;
  handoffRequested?: boolean;
  groundedDocIds?: string[];
}

export interface AIProvider {
  name: string;
  generateReply(options: {
    messages: SupportMessage[];
    customerName?: string;
  }): Promise<ProviderResponse>;
}

// Regex and keyword matcher for intelligent human handoff detection
export function detectHandoffIntent(userMessage: string): boolean {
  const lower = userMessage.toLowerCase().trim();
  const handoffPhrases = [
    'talk to human',
    'speak to human',
    'talk to a human',
    'speak to an agent',
    'talk to an agent',
    'talk to agent',
    'human agent',
    'human please',
    'agent please',
    'talk to shekhar',
    'speak with shekhar',
    'hire shekhar',
    'schedule interview',
    'book an interview',
    'escalate to human',
    'connect to representative',
    'contact human',
    'live agent',
    'customer service rep',
  ];

  return handoffPhrases.some(phrase => lower.includes(phrase));
}

const SYSTEM_CORE_DIRECTIVE = `You are the AI Customer Support Agent for Shekhar Birda's Portfolio & Engineering Center.
Your duty is to assist visitors, recruiters, hiring managers, and prospective clients with complete accuracy.
STRICT SCOPE DIRECTIVE:
- Answer ONLY questions related to Shekhar Birda's engineering experience, skills, live projects, architecture, availability, and contact options.
- NEVER invent or hallucinate projects, companies, certifications, or achievements.
- If you lack information on a topic, respond gracefully:
  "I don't have that specific detail in my knowledge base. Would you like me to connect you with Shekhar or schedule a direct follow-up?"
- Keep responses concise, professional, articulate, and formatted with clean Markdown bullet points where helpful.
- If the visitor requests a human, expresses urgent hiring needs, or asks to speak with Shekhar directly, acknowledge warmly and note that you are escalating the ticket.`;

/**
 * 1. Offline Deterministic Grounded Provider (Zero cost, 100% factual accuracy, zero external key required)
 */
export class GroundedLocalProvider implements AIProvider {
  name = 'grounded-local';

  async generateReply({ messages }: { messages: SupportMessage[] }): Promise<ProviderResponse> {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const handoff = detectHandoffIntent(lastMsg);

    if (handoff) {
      return {
        text: `I understand you would like to connect with a human representative! I have updated your ticket status to **Waiting for Agent**, and Shekhar Birda has been alerted. You can also reach him immediately at **shekharjaat751@gmail.com** or WhatsApp at **+91 9996231869**.`,
        modelUsed: 'Portfolio Grounded Engine (Offline)',
        handoffRequested: true,
      };
    }

    const matchedDocs = queryKnowledgeDocs(lastMsg, 2);
    const docIds = matchedDocs.map(d => d.id);

    if (matchedDocs.length > 0) {
      const primary = matchedDocs[0];
      const secondary = matchedDocs[1];

      let reply = `### ${primary.title}\n${primary.content}`;
      if (secondary && secondary.category !== primary.category) {
        reply += `\n\n### Related Reference: ${secondary.title}\n${secondary.summary}`;
      }
      reply += `\n\n*Would you like to know more about this or connect directly with Shekhar?*`;

      return {
        text: reply,
        modelUsed: 'Portfolio Grounded Engine (Offline)',
        groundedDocIds: docIds,
        handoffRequested: false,
      };
    }

    return {
      text: `Hello! I am Shekhar Birda's AI Support Assistant. Shekhar is a **Senior React Native & React.js Developer** with 2+ years of production experience at Apptunix.\n\nHere are quick areas I can assist you with:\n- **Flagship Projects:** Snibbl (12k+ users, 99.8% crash-free), EDU-Match, Magrudy's, Gulf Bar Show\n- **Technical Stack:** React Native, TurboModules, Fabric, Hermes, React.js, TypeScript, Next.js, Firebase\n- **Hiring & Availability:** Open to Full-Time, Contract, and Global Remote roles\n- **Live Human Support:** Ask to "talk to human" anytime to connect with Shekhar!\n\nHow can I help you today?`,
      modelUsed: 'Portfolio Grounded Engine (Offline)',
      handoffRequested: false,
    };
  }
}

/**
 * 2. Google Gemini Provider via @google/genai
 */
export class GeminiProvider implements AIProvider {
  name = 'gemini';
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model = 'gemini-2.5-flash') {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.model = process.env.AI_MODEL || model;
  }

  async generateReply({ messages }: { messages: SupportMessage[] }): Promise<ProviderResponse> {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const handoff = detectHandoffIntent(lastMsg);

    if (handoff) {
      return {
        text: `I've paused automated AI responses and routed your conversation to a human support agent. Shekhar Birda will respond shortly. You can also reach him directly via WhatsApp at **+91 9996231869** or email at **shekharjaat751@gmail.com**.`,
        modelUsed: this.model,
        handoffRequested: true,
      };
    }

    if (!this.apiKey) {
      // Graceful fallback to grounded engine if key is not configured
      const fallback = new GroundedLocalProvider();
      return fallback.generateReply({ messages });
    }

    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const ragContext = buildRAGContext(lastMsg);

      const recentHistory = messages.slice(-5, -1).map(m => ({
        role: m.senderType === 'CUSTOMER' ? 'user' : 'model',
        parts: [{ text: m.content.slice(0, 400) }]
      }));

      const chat = ai.chats.create({
        model: this.model,
        history: recentHistory,
        config: {
          systemInstruction: `${SYSTEM_CORE_DIRECTIVE}\n${ragContext}`,
          temperature: 0.25,
          maxOutputTokens: 350,
        },
      });

      const result = await chat.sendMessage({ message: lastMsg });
      return {
        text: result.text || 'I am ready to help with any questions regarding Shekhar Birda’s portfolio and projects.',
        modelUsed: `Google ${this.model}`,
        handoffRequested: false,
      };
    } catch (err: any) {
      console.warn('Gemini Provider encountered error, falling back to grounded local engine:', err?.message);
      const fallback = new GroundedLocalProvider();
      return fallback.generateReply({ messages });
    }
  }
}

/**
 * 3. Ollama Local AI Provider (Self-Hosted / Open-Source Models)
 */
export class OllamaProvider implements AIProvider {
  name = 'ollama';
  private baseUrl: string;
  private model: string;

  constructor(baseUrl = 'http://localhost:11434', model = 'llama3.2') {
    this.baseUrl = process.env.OLLAMA_BASE_URL || baseUrl;
    this.model = process.env.AI_MODEL || model;
  }

  async generateReply({ messages }: { messages: SupportMessage[] }): Promise<ProviderResponse> {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const handoff = detectHandoffIntent(lastMsg);

    if (handoff) {
      return {
        text: `Connecting you with a human support agent. Shekhar Birda has been notified. You can also reach him at **shekharjaat751@gmail.com**.`,
        modelUsed: `Ollama (${this.model})`,
        handoffRequested: true,
      };
    }

    const ragContext = buildRAGContext(lastMsg);

    try {
      const ollamaMessages = [
        { role: 'system', content: `${SYSTEM_CORE_DIRECTIVE}\n${ragContext}` },
        ...messages.slice(-5).map(m => ({
          role: m.senderType === 'CUSTOMER' ? 'user' : 'assistant',
          content: m.content
        }))
      ];

      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: ollamaMessages,
          stream: false,
          options: { temperature: 0.3 }
        }),
      });

      if (!res.ok) {
        throw new Error(`Ollama request failed with status: ${res.status}`);
      }

      const data = await res.json();
      return {
        text: data?.message?.content || 'Unable to generate response from Ollama.',
        modelUsed: `Ollama (${this.model})`,
        handoffRequested: false,
      };
    } catch (err: any) {
      console.warn('Ollama unavailable or offline, using grounded local fallback:', err?.message);
      const fallback = new GroundedLocalProvider();
      return fallback.generateReply({ messages });
    }
  }
}

/**
 * 4. OpenAI-Compatible Provider (Groq, vLLM, DeepSeek, OpenAI)
 */
export class OpenAICompatibleProvider implements AIProvider {
  name = 'openai-compatible';
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'gpt-4o-mini';
  }

  async generateReply({ messages }: { messages: SupportMessage[] }): Promise<ProviderResponse> {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const handoff = detectHandoffIntent(lastMsg);

    if (handoff) {
      return {
        text: `I've paused AI automated replies. A human agent will take over your conversation. Contact: **shekharjaat751@gmail.com**.`,
        modelUsed: this.model,
        handoffRequested: true,
      };
    }

    if (!this.apiKey) {
      const fallback = new GroundedLocalProvider();
      return fallback.generateReply({ messages });
    }

    try {
      const ragContext = buildRAGContext(lastMsg);
      const openAiMessages = [
        { role: 'system', content: `${SYSTEM_CORE_DIRECTIVE}\n${ragContext}` },
        ...messages.slice(-5).map(m => ({
          role: m.senderType === 'CUSTOMER' ? 'user' : 'assistant',
          content: m.content
        }))
      ];

      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: openAiMessages,
          max_tokens: 350,
          temperature: 0.3
        })
      });

      if (!res.ok) throw new Error(`OpenAI request failed: ${res.status}`);
      const data = await res.json();
      return {
        text: data?.choices?.[0]?.message?.content || 'Response generated.',
        modelUsed: `${this.model}`,
        handoffRequested: false,
      };
    } catch (err: any) {
      console.warn('OpenAI provider error, falling back to grounded engine:', err?.message);
      const fallback = new GroundedLocalProvider();
      return fallback.generateReply({ messages });
    }
  }
}

/**
 * Factory function: Resolves the active AI provider based on environment variables
 */
export function getAIProvider(): AIProvider {
  const providerType = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  switch (providerType) {
    case 'ollama':
      return new OllamaProvider();
    case 'openai':
    case 'openai-compatible':
    case 'groq':
      return new OpenAICompatibleProvider();
    case 'grounded':
    case 'local':
    case 'mock':
      return new GroundedLocalProvider();
    case 'gemini':
    default:
      if (process.env.GEMINI_API_KEY) {
        return new GeminiProvider();
      }
      // If no Gemini key is provided, return grounded local provider with 100% uptime
      return new GroundedLocalProvider();
  }
}
