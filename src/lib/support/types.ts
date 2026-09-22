export type SenderType = 'CUSTOMER' | 'AI' | 'AGENT' | 'SYSTEM' | 'INTERNAL_NOTE';

export type ConversationStatus =
  | 'open'
  | 'ai_handling'
  | 'waiting_for_agent'
  | 'agent_handling'
  | 'resolved';

export type PriorityLevel = 'low' | 'normal' | 'high' | 'urgent';

export type SupportChannel = 'web' | 'email' | 'whatsapp';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  ipAddress?: string;
  browser?: string;
  createdAt: number;
}

export interface SupportMessage {
  id: string;
  conversationId: string;
  senderType: SenderType;
  senderName?: string;
  content: string;
  createdAt: number;
  metadata?: {
    modelUsed?: string;
    groundedDocIds?: string[];
    isInternalNote?: boolean;
    handoffTriggered?: boolean;
    channel?: SupportChannel;
    attachmentUrl?: string;
    attachmentName?: string;
  };
}

export interface SupportConversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject?: string;
  status: ConversationStatus;
  priority: PriorityLevel;
  assignedAgentId?: string;
  assignedAgentName?: string;
  aiEnabled: boolean;
  channel: SupportChannel;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface SupportTicket {
  id: string;
  conversationId?: string;
  subject: string;
  description: string;
  category: 'technical' | 'project_inquiry' | 'hiring' | 'general' | 'bug_report';
  priority: PriorityLevel;
  status: 'new' | 'investigating' | 'in_progress' | 'resolved' | 'closed';
  customerName: string;
  customerEmail: string;
  createdAt: number;
  updatedAt: number;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: 'profile' | 'skills' | 'projects' | 'experience' | 'hiring' | 'architecture' | 'faq';
  summary: string;
  content: string;
  tags: string[];
  slug: string;
  lastUpdated: string;
}

export interface SupportAnalytics {
  totalConversations: number;
  openConversations: number;
  waitingForAgent: number;
  resolvedConversations: number;
  aiHandledCount: number;
  humanHandledCount: number;
  aiResolutionRate: number; // Percentage 0-100
  avgResponseTimeSeconds: number;
  channelBreakdown: {
    web: number;
    email: number;
    whatsapp: number;
  };
  topCategories: {
    category: string;
    count: number;
  }[];
  recentActivityTimeline: {
    date: string;
    conversations: number;
    resolved: number;
  }[];
}
