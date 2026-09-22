export interface WhatsAppWebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: { body: string };
  type: string;
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry?: Array<{
    id: string;
    changes?: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: WhatsAppWebhookMessage[];
      };
      field: string;
    }>;
  }>;
}

export class WhatsAppService {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;
  private verifyToken: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v20.0';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'shekhar-portfolio-whatsapp-verify';
  }

  public isConfigured(): boolean {
    return Boolean(this.accessToken && this.phoneNumberId);
  }

  public getStatus(): { configured: boolean; phoneNumberId?: string; mode: string } {
    return {
      configured: this.isConfigured(),
      phoneNumberId: this.phoneNumberId ? `...${this.phoneNumberId.slice(-4)}` : undefined,
      mode: this.isConfigured() ? 'Live Meta Cloud API' : 'Ready for Meta Business API Configuration',
    };
  }

  /**
   * Validates Meta Webhook Verification challenge
   */
  public verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('[WhatsAppService] Meta webhook challenge verified successfully');
      return challenge;
    }
    return null;
  }

  /**
   * Dispatches outbound WhatsApp message via Meta Cloud API
   */
  public async sendMessage(to: string, text: string): Promise<{ success: boolean; messageId: string; simulated?: boolean }> {
    if (!this.isConfigured()) {
      console.log(`[WhatsAppService] Simulated Outbound WhatsApp Message to ${to}: "${text}"`);
      return {
        success: true,
        messageId: `sim-wa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        simulated: true,
      };
    }

    try {
      const endpoint = `${this.apiUrl}/${this.phoneNumberId}/messages`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { preview_url: false, body: text },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('[WhatsAppService] Meta API error:', errorData);
        throw new Error(`WhatsApp API responded with status ${res.status}`);
      }

      const data = await res.json();
      return {
        success: true,
        messageId: data?.messages?.[0]?.id || `wa-${Date.now()}`,
        simulated: false,
      };
    } catch (err: any) {
      console.error('[WhatsAppService] Failed to send WhatsApp message:', err?.message);
      throw err;
    }
  }

  /**
   * Parses incoming webhook payload from Meta
   */
  public parseWebhookPayload(payload: WhatsAppWebhookPayload): {
    senderPhone: string;
    senderName: string;
    messageText: string;
    messageId: string;
  } | null {
    try {
      const entry = payload.entry?.[0];
      const change = entry?.changes?.[0]?.value;
      const message = change?.messages?.[0];
      const contact = change?.contacts?.[0];

      if (!message || message.type !== 'text' || !message.text?.body) {
        return null;
      }

      return {
        senderPhone: message.from,
        senderName: contact?.profile?.name || message.from,
        messageText: message.text.body,
        messageId: message.id,
      };
    } catch (err) {
      console.error('[WhatsAppService] Error parsing webhook payload:', err);
      return null;
    }
  }
}

export const whatsappService = new WhatsAppService();
