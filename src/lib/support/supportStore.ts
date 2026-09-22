import {
  SupportConversation,
  SupportMessage,
  SupportTicket,
  SupportAnalytics,
  ConversationStatus,
  PriorityLevel,
  SenderType,
} from './types';
import { db, isFirebaseConfigured } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const STORAGE_KEY_CONVERSATIONS = 'shekhar_support_conversations_v1';
const STORAGE_KEY_MESSAGES_PREFIX = 'shekhar_support_messages_';
const STORAGE_KEY_TICKETS = 'shekhar_support_tickets_v1';

// Cross-tab broadcast channel for instant multi-window sync in development
let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('shekhar_support_sync_bus');
  } catch {
    // Ignore in restricted environments
  }
}

// Initial realistic demo conversations for instant SaaS feel
const INITIAL_DEMO_CONVERSATIONS: SupportConversation[] = [
  {
    id: 'conv-recruiter-01',
    customerId: 'cust-sarah-j',
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@techrecruiting-global.com',
    customerPhone: '+1 (415) 890-3412',
    subject: 'Senior React Native Opportunity (Remote US/UK)',
    status: 'waiting_for_agent',
    priority: 'high',
    channel: 'web',
    aiEnabled: false,
    lastMessage: 'I reviewed your work on Snibbl. Are you available for a 20-minute chat this Thursday?',
    lastMessageTime: Date.now() - 1000 * 60 * 18,
    unreadCount: 1,
    tags: ['Recruiter', 'Full-Time', 'US Remote'],
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    updatedAt: Date.now() - 1000 * 60 * 18,
  },
  {
    id: 'conv-client-uae',
    customerId: 'cust-tariq-m',
    customerName: 'Tariq Mansoor',
    customerEmail: 'tariq@gulfretail-innovations.ae',
    customerPhone: '+971 50 123 4567',
    subject: 'Snibbl Architecture & Double-Claim Prevention',
    status: 'ai_handling',
    priority: 'normal',
    channel: 'web',
    aiEnabled: true,
    lastMessage: 'How did you configure atomic inventory locks in Firebase Realtime DB?',
    lastMessageTime: Date.now() - 1000 * 60 * 45,
    unreadCount: 0,
    tags: ['Technical', 'Architecture', 'UAE'],
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    updatedAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: 'conv-general-03',
    customerId: 'cust-alex-c',
    customerName: 'Alex Chen',
    customerEmail: 'alex.chen@startupfoundry.io',
    subject: 'Contract React 19 / Three.js Frontend Build',
    status: 'resolved',
    priority: 'normal',
    channel: 'web',
    aiEnabled: true,
    lastMessage: 'Thanks Shekhar! Received the proposal and will review it with our CTO.',
    lastMessageTime: Date.now() - 1000 * 60 * 60 * 14,
    unreadCount: 0,
    tags: ['Consulting', 'Vite', 'Three.js'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    updatedAt: Date.now() - 1000 * 60 * 60 * 14,
  }
];

const INITIAL_DEMO_MESSAGES: Record<string, SupportMessage[]> = {
  'conv-recruiter-01': [
    {
      id: 'msg-01-1',
      conversationId: 'conv-recruiter-01',
      senderType: 'CUSTOMER',
      senderName: 'Sarah Jenkins',
      content: 'Hi Shekhar, I came across your interactive space portfolio. Truly exceptional work on both the 3D graphics and your project metrics.',
      createdAt: Date.now() - 1000 * 60 * 35,
    },
    {
      id: 'msg-01-2',
      conversationId: 'conv-recruiter-01',
      senderType: 'AI',
      senderName: 'AI Support Assistant',
      content: 'Hello Sarah! Thank you for exploring Shekhar Birda’s portfolio. Shekhar is an architect specializing in React Native and React.js with 2+ years of production experience at Apptunix.',
      createdAt: Date.now() - 1000 * 60 * 34,
      metadata: { modelUsed: 'Gemini 2.5 Flash' },
    },
    {
      id: 'msg-01-3',
      conversationId: 'conv-recruiter-01',
      senderType: 'CUSTOMER',
      senderName: 'Sarah Jenkins',
      content: 'I reviewed your work on Snibbl. Are you available for a 20-minute chat this Thursday? I want to speak to a human directly.',
      createdAt: Date.now() - 1000 * 60 * 18,
    },
    {
      id: 'msg-01-4',
      conversationId: 'conv-recruiter-01',
      senderType: 'SYSTEM',
      content: 'Automated AI replies paused. Conversation transitioned to Waiting for Agent.',
      createdAt: Date.now() - 1000 * 60 * 18,
      metadata: { handoffTriggered: true },
    }
  ],
  'conv-client-uae': [
    {
      id: 'msg-02-1',
      conversationId: 'conv-client-uae',
      senderType: 'CUSTOMER',
      senderName: 'Tariq Mansoor',
      content: 'Hello, we are building a multi-vendor delivery app in Dubai. How did you configure atomic inventory locks in Firebase Realtime DB on Snibbl?',
      createdAt: Date.now() - 1000 * 60 * 46,
      metadata: { channel: 'whatsapp' },
    },
    {
      id: 'msg-02-2',
      conversationId: 'conv-client-uae',
      senderType: 'AI',
      senderName: 'AI Support Assistant',
      content: 'In Snibbl, Shekhar engineered atomic transaction blocks using Firebase Realtime Database transactions (`runTransaction`). When multiple users attempt to claim the final mystery food bag, the first transaction securely commits the state lock while competing attempts safely abort and notify the user with sub-second latency.',
      createdAt: Date.now() - 1000 * 60 * 45,
      metadata: { modelUsed: 'Gemini 2.5 Flash', groundedDocIds: ['project-snibbl'] },
    }
  ]
};

class SupportStore {
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize localStorage with demo conversations if not present
      if (!localStorage.getItem(STORAGE_KEY_CONVERSATIONS)) {
        localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(INITIAL_DEMO_CONVERSATIONS));
        for (const [convId, msgs] of Object.entries(INITIAL_DEMO_MESSAGES)) {
          localStorage.setItem(`${STORAGE_KEY_MESSAGES_PREFIX}${convId}`, JSON.stringify(msgs));
        }
      }

      // Listen to cross-tab updates
      if (syncChannel) {
        syncChannel.onmessage = () => {
          this.notify();
        };
      }
    }
  }

  private notify() {
    this.listeners.forEach(cb => cb());
    if (syncChannel) {
      try {
        syncChannel.postMessage({ timestamp: Date.now() });
      } catch {
        // Ignore
      }
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // ================= CONVERSATIONS =================

  public getConversations(): SupportConversation[] {
    if (typeof window === 'undefined') return INITIAL_DEMO_CONVERSATIONS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      return raw ? JSON.parse(raw) : INITIAL_DEMO_CONVERSATIONS;
    } catch {
      return INITIAL_DEMO_CONVERSATIONS;
    }
  }

  public getConversation(id: string): SupportConversation | null {
    const list = this.getConversations();
    return list.find(c => c.id === id) || null;
  }

  public getOrCreateVisitorConversation(): SupportConversation {
    const VISITOR_CONV_KEY = 'shekhar_support_active_visitor_conv_id';
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem(VISITOR_CONV_KEY);
      if (savedId) {
        const existing = this.getConversation(savedId);
        if (existing) {
          // If existing was marked resolved, create a fresh visitor conversation
          if (existing.status === 'resolved') {
            const freshConv = this.createConversation({
              customerId: 'cust-visitor-session',
              customerName: 'Portfolio Explorer',
              customerEmail: 'explorer@portfolio.local',
              subject: 'AI Support Chat',
              channel: 'web',
              initialMessage: 'Greetings! How can I assist you with Shekhar Birda’s portfolio today?',
            });
            localStorage.setItem(VISITOR_CONV_KEY, freshConv.id);
            return freshConv;
          }
          return existing;
        }
      }
    }

    const newConv = this.createConversation({
      customerId: 'cust-visitor-session',
      customerName: 'Portfolio Explorer',
      customerEmail: 'explorer@portfolio.local',
      subject: 'AI Support Chat',
      channel: 'web',
      initialMessage: 'Greetings! I am exploring Shekhar Birda’s portfolio.',
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(VISITOR_CONV_KEY, newConv.id);
    }
    return newConv;
  }

  public createConversation(data: {
    customerName: string;
    customerEmail: string;
    customerId?: string;
    subject?: string;
    channel?: 'web' | 'email' | 'whatsapp';
    initialMessage?: string;
  }): SupportConversation {
    const newConv: SupportConversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      customerId: data.customerId || `cust-${Date.now()}`,
      customerName: data.customerName || 'Anonymous Visitor',
      customerEmail: data.customerEmail || 'visitor@portfolio.local',
      subject: data.subject || 'Portfolio Inquiry',
      status: 'ai_handling',
      priority: 'normal',
      channel: data.channel || 'web',
      aiEnabled: true,
      lastMessage: data.initialMessage || 'Started conversation',
      lastMessageTime: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const list = [newConv, ...this.getConversations()];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(list));
      this.notify();
    }

    if (data.initialMessage) {
      this.addMessage({
        conversationId: newConv.id,
        senderType: 'CUSTOMER',
        senderName: newConv.customerName,
        content: data.initialMessage,
      });
    }

    // Attempt Firebase sync in background if available
    if (isFirebaseConfigured() && db) {
      try {
        setDoc(doc(db, 'support_conversations', newConv.id), {
          ...newConv,
          serverTimestamp: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Firebase conversation write notice:', e);
      }
    }

    return newConv;
  }

  public updateConversation(id: string, updates: Partial<SupportConversation>): SupportConversation | null {
    const list = this.getConversations();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...updates,
      updatedAt: Date.now(),
    };
    list[index] = updated;

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(list));
      this.notify();
    }

    if (isFirebaseConfigured() && db) {
      try {
        setDoc(doc(db, 'support_conversations', id), updates, { merge: true });
      } catch (e) {
        console.warn('Firebase conversation update notice:', e);
      }
    }

    return updated;
  }

  // ================= MESSAGES =================

  public getMessages(conversationId: string): SupportMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_MESSAGES_PREFIX}${conversationId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public addMessage(msg: Omit<SupportMessage, 'id' | 'createdAt'>): SupportMessage {
    const newMsg: SupportMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };

    const currentMessages = this.getMessages(msg.conversationId);
    const updatedMessages = [...currentMessages, newMsg];

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `${STORAGE_KEY_MESSAGES_PREFIX}${msg.conversationId}`,
        JSON.stringify(updatedMessages)
      );

      // Update conversation snippet and timestamp
      const convUpdates: Partial<SupportConversation> = {
        lastMessage: msg.content,
        lastMessageTime: newMsg.createdAt,
      };

      if (msg.senderType === 'CUSTOMER') {
        const conv = this.getConversation(msg.conversationId);
        convUpdates.unreadCount = (conv?.unreadCount || 0) + 1;
      } else if (msg.senderType === 'AGENT') {
        convUpdates.unreadCount = 0;
      }

      this.updateConversation(msg.conversationId, convUpdates);
      this.notify();
    }

    if (isFirebaseConfigured() && db) {
      try {
        setDoc(doc(db, 'support_conversations', msg.conversationId, 'messages', newMsg.id), {
          ...newMsg,
          serverTimestamp: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Firebase message write notice:', e);
      }
    }

    return newMsg;
  }

  // ================= TICKETS =================

  public getTickets(): SupportTicket[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TICKETS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public createTicket(data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>): SupportTicket {
    const newTicket: SupportTicket = {
      ...data,
      id: `TCK-${Date.now().toString().slice(-6)}`,
      status: 'new',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const list = [newTicket, ...this.getTickets()];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(list));
      this.notify();
    }

    if (isFirebaseConfigured() && db) {
      try {
        setDoc(doc(db, 'support_tickets', newTicket.id), {
          ...newTicket,
          serverTimestamp: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Firebase ticket write notice:', e);
      }
    }

    return newTicket;
  }

  // ================= ANALYTICS =================

  public getAnalytics(): SupportAnalytics {
    const convs = this.getConversations();
    const total = convs.length;
    const open = convs.filter(c => c.status === 'open' || c.status === 'ai_handling' || c.status === 'agent_handling').length;
    const waiting = convs.filter(c => c.status === 'waiting_for_agent').length;
    const resolved = convs.filter(c => c.status === 'resolved').length;
    const aiHandled = convs.filter(c => c.aiEnabled).length;
    const humanHandled = convs.filter(c => !c.aiEnabled || c.status === 'agent_handling' || c.status === 'waiting_for_agent').length;

    const webCount = convs.filter(c => c.channel === 'web').length;
    const emailCount = convs.filter(c => c.channel === 'email').length;
    const waCount = convs.filter(c => c.channel === 'whatsapp').length;

    return {
      totalConversations: total,
      openConversations: open,
      waitingForAgent: waiting,
      resolvedConversations: resolved,
      aiHandledCount: aiHandled,
      humanHandledCount: humanHandled,
      aiResolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 85,
      avgResponseTimeSeconds: 42,
      channelBreakdown: {
        web: webCount,
        email: emailCount,
        whatsapp: waCount,
      },
      topCategories: [
        { category: 'React Native & Mobile Architecture', count: 18 },
        { category: 'Hiring & Availability Inquiry', count: 14 },
        { category: 'Live Project Case Studies (Snibbl/EDU-Match)', count: 12 },
        { category: 'Contract & Consulting Scope', count: 7 },
        { category: 'Three.js & WebGL Performance', count: 5 },
      ],
      recentActivityTimeline: [
        { date: 'Mon', conversations: 6, resolved: 5 },
        { date: 'Tue', conversations: 9, resolved: 8 },
        { date: 'Wed', conversations: 12, resolved: 10 },
        { date: 'Thu', conversations: 8, resolved: 7 },
        { date: 'Fri', conversations: 14, resolved: 12 },
        { date: 'Sat', conversations: 4, resolved: 4 },
        { date: 'Sun', conversations: 7, resolved: 6 },
      ]
    };
  }
}

export const supportStore = new SupportStore();
