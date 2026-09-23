import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  Headphones,
  Bot,
  User,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  BarChart3,
  MessageSquare,
  ArrowLeft,
  X,
  ShieldCheck,
  Tag,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Sliders,
  Archive,
  Mail,
  Phone,
} from 'lucide-react';
import { supportStore } from '../../lib/support/supportStore';
import { getLiveFirestoreMetrics } from '../../lib/firebase';
import {
  SupportConversation,
  SupportMessage,
  SupportAnalytics,
  ConversationStatus,
  PriorityLevel,
} from '../../lib/support/types';
import { sound } from '../../utils/sound';

interface SupportDashboardProps {
  onReturnToPortfolio: () => void;
  onOpenPortal: () => void;
}

export function SupportDashboard({ onReturnToPortfolio, onOpenPortal }: SupportDashboardProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(sessionStorage.getItem('shekhar_support_admin_token'));
    }
    return false;
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Navigation & Views
  const [activeTab, setActiveTab] = useState<'conversations' | 'analytics'>('conversations');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Conversations & Active Selection
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);

  // Composer State
  const [composerText, setComposerText] = useState('');
  const [composerMode, setComposerMode] = useState<'reply' | 'internal_note'>('reply');

  // Analytics Data
  const [analytics, setAnalytics] = useState<SupportAnalytics | null>(null);
  const [liveCloudMetrics, setLiveCloudMetrics] = useState<{
    inquiriesCount: number;
    ticketsCount: number;
    guestbookCount: number;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations and analytics
  useEffect(() => {
    const refreshData = () => {
      const convList = supportStore.getConversations();
      setConversations(convList);
      setAnalytics(supportStore.getAnalytics());

      // Fetch live cloud metrics from Firestore
      getLiveFirestoreMetrics()
        .then((m) => setLiveCloudMetrics(m))
        .catch(() => { });

      if (convList.length > 0 && !activeConvId) {
        setActiveConvId(convList[0].id);
      }
    };

    refreshData();
    const unsubscribe = supportStore.subscribe(() => {
      refreshData();
    });

    return unsubscribe;
  }, [activeConvId]);

  // Load messages for active conversation
  useEffect(() => {
    if (activeConvId) {
      setMessages(supportStore.getMessages(activeConvId));
    } else {
      setMessages([]);
    }
  }, [activeConvId, conversations]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || null;

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/support/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sound.playClick();
        sessionStorage.setItem('shekhar_support_admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid passcode. Default passcode is: SHEKHAR999');
      }
    } catch {
      // Local fallback for offline mode
      if (passcode === 'SHEKHAR999') {
        sound.playClick();
        sessionStorage.setItem('shekhar_support_admin_token', 'local-demo-token');
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid passcode. Default passcode is: SHEKHAR999');
      }
    }
  };

  const handleLogout = () => {
    sound.playClick();
    sessionStorage.removeItem('shekhar_support_admin_token');
    setIsAuthenticated(false);
  };

  // Composer submit
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() || !activeConvId) return;

    sound.playClick();
    const isInternal = composerMode === 'internal_note';

    supportStore.addMessage({
      conversationId: activeConvId,
      senderType: isInternal ? 'INTERNAL_NOTE' : 'AGENT',
      senderName: 'Shekhar Birda (Lead Architect)',
      content: composerText.trim(),
      metadata: { isInternalNote: isInternal },
    });

    // If agent replied publicly and conversation was waiting for agent, update to agent_handling
    if (!isInternal && activeConversation?.status === 'waiting_for_agent') {
      supportStore.updateConversation(activeConvId, {
        status: 'agent_handling',
      });
    }

    setComposerText('');
  };

  // Status & AI Control Actions
  const handleTakeOverAI = () => {
    if (!activeConvId) return;
    sound.playClick();

    supportStore.addMessage({
      conversationId: activeConvId,
      senderType: 'SYSTEM',
      content: 'Agent took over conversation. Automated AI paused.',
    });

    supportStore.updateConversation(activeConvId, {
      status: 'agent_handling',
      aiEnabled: false,
    });
  };

  const handleReturnToAI = () => {
    if (!activeConvId) return;
    sound.playClick();

    supportStore.addMessage({
      conversationId: activeConvId,
      senderType: 'SYSTEM',
      content: 'Agent returned conversation to AI Assistant.',
    });

    supportStore.updateConversation(activeConvId, {
      status: 'ai_handling',
      aiEnabled: true,
    });
  };

  const handleMarkResolved = () => {
    if (!activeConvId) return;
    sound.playClick();

    supportStore.addMessage({
      conversationId: activeConvId,
      senderType: 'SYSTEM',
      content: 'Conversation marked as resolved by Shekhar Birda.',
    });

    supportStore.updateConversation(activeConvId, {
      status: 'resolved',
    });
  };

  const handleStatusChange = (newStatus: ConversationStatus) => {
    if (!activeConvId) return;
    supportStore.updateConversation(activeConvId, { status: newStatus });
  };

  const handlePriorityChange = (newPriority: PriorityLevel) => {
    if (!activeConvId) return;
    supportStore.updateConversation(activeConvId, { priority: newPriority });
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'open'
          ? c.status !== 'resolved'
          : c.status === statusFilter;

    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subject && c.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // ================= AUTHENTICATION MODAL =================
  if (!isAuthenticated) {
    return (
      <div className="h-full w-full overflow-y-auto bg-[#030712] flex items-center justify-center p-4 text-slate-100 font-sans select-text">
        <div className="w-full max-w-md bg-[#071324] border border-sky-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center mx-auto text-sky-400">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">Support Agent Console</h1>
            <p className="text-xs text-slate-400">
              Restricted area for Shekhar Birda and authorized support personnel.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Admin Passcode / Auth Secret
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full px-4 py-3 bg-[#0b172a] border border-sky-500/30 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-mono text-xs font-bold tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Authenticate & Access Console
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <button
              onClick={() => {
                sound.playClick();
                onReturnToPortfolio();
              }}
              className="hover:text-sky-300 transition-colors cursor-pointer"
            >
              ← Back to Portfolio
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onOpenPortal();
              }}
              className="hover:text-sky-300 transition-colors cursor-pointer"
            >
              Open Customer Portal →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= AUTHENTICATED AGENT CONSOLE =================
  return (
    <div className="h-full w-full bg-[#030712] text-slate-100 flex flex-col font-sans select-text overflow-hidden">
      {/* ================= CONSOLE TOP BAR ================= */}
      <header className="h-14 border-b border-sky-500/15 bg-[#07111f] px-5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onReturnToPortfolio();
            }}
            title="Return to main portfolio"
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Portfolio</span>
          </button>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xs tracking-wider font-mono text-slate-100 uppercase">
              Agent Console
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              Live Session
            </span>
          </div>
        </div>

        {/* View Switcher (Conversations vs Analytics) */}
        <div className="flex items-center gap-1 bg-[#0b172a] p-1 rounded-xl border border-sky-500/20">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('conversations');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'conversations'
              ? 'bg-sky-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Inbox ({conversations.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('analytics');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'analytics'
              ? 'bg-sky-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onOpenPortal();
            }}
            className="hidden md:flex items-center gap-1 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
          >
            <span>Customer View (/support)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="px-2.5 py-1 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-mono transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* ================= VIEW: ANALYTICS TAB ================= */}
      {activeTab === 'analytics' && analytics && (
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between pb-4 border-b border-sky-500/15">
            <div>
              <h2 className="text-xl font-bold text-white">Support Metrics & Resolution Analytics</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Real-time operational telemetry across Web Chat, Email, and WhatsApp channels.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('conversations')}
              className="px-3 py-1.5 rounded-lg border border-sky-500/30 text-sky-300 text-xs font-mono hover:bg-sky-500/10 transition-colors cursor-pointer"
            >
              Back to Inbox
            </button>
          </div>

          {/* Live Firebase Cloud Synchronization Status */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 to-indigo-950/40 border border-sky-500/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Firebase Cloud Firestore Live Synchronization
                </h4>
                <p className="text-[11px] text-sky-200/70 font-mono">
                  Project: <span className="text-sky-300 font-bold">shekhar-jaat-portfolio</span> • Status: <span className="text-emerald-400 font-bold">ONLINE & SECURED</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs">
              <div className="text-center sm:text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Inquiries in Cloud</span>
                <span className="text-base font-extrabold text-white">
                  {liveCloudMetrics ? liveCloudMetrics.inquiriesCount : '...'}
                </span>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Tickets in Cloud</span>
                <span className="text-base font-extrabold text-sky-400">
                  {liveCloudMetrics ? liveCloudMetrics.ticketsCount : '...'}
                </span>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Guestbook Endorsements</span>
                <span className="text-base font-extrabold text-amber-400">
                  {liveCloudMetrics ? liveCloudMetrics.guestbookCount : '...'}
                </span>
              </div>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#071324] border border-sky-500/20">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Total Conversations</span>
              <p className="text-3xl font-extrabold text-white mt-1">{analytics.totalConversations}</p>
              <span className="text-[11px] font-mono text-sky-400">All inbound queries</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#071324] border border-amber-500/20">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Waiting for Agent</span>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">{analytics.waitingForAgent}</p>
              <span className="text-[11px] font-mono text-amber-300">Escalated / Pending human</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#071324] border border-emerald-500/20">
              <span className="text-[10px] font-mono text-slate-400 uppercase">AI Resolution Rate</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{analytics.aiResolutionRate}%</p>
              <span className="text-[11px] font-mono text-emerald-300">Resolved without human escalation</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#071324] border border-sky-500/20">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Avg Response Time</span>
              <p className="text-3xl font-extrabold text-sky-400 mt-1">{analytics.avgResponseTimeSeconds}s</p>
              <span className="text-[11px] font-mono text-slate-400">&lt;1s for AI, &lt;2h for human</span>
            </div>
          </div>

          {/* Breakdown Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Channel Breakdown */}
            <div className="p-6 rounded-2xl bg-[#071324] border border-sky-500/20">
              <h3 className="font-bold text-sm text-slate-100 mb-4 flex items-center gap-2">
                <span>Inbound Channel Distribution</span>
              </h3>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-slate-300">
                    <span>Web Floating Widget</span>
                    <span>{analytics.channelBreakdown.web}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: '100%' }} />
                  </div>
                </div>

                {analytics.channelBreakdown.whatsapp > 0 && (
                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span>WhatsApp Direct API</span>
                      <span>{analytics.channelBreakdown.whatsapp}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '25%' }} />
                    </div>
                  </div>
                )}

                {analytics.channelBreakdown.email > 0 && (
                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span>Inbound SMTP Email</span>
                      <span>{analytics.channelBreakdown.email}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '10%' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Customer Topics */}
            <div className="p-6 rounded-2xl bg-[#071324] border border-sky-500/20">
              <h3 className="font-bold text-sm text-slate-100 mb-4">Most Queried Engineering Topics</h3>
              <div className="space-y-2.5">
                {analytics.topCategories.map((cat, idx) => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
                  >
                    <span className="text-slate-300">
                      <span className="font-mono text-sky-400 mr-2">#{idx + 1}</span>
                      {cat.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono text-[11px]">
                      {cat.count} inquiries
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW: 3-COLUMN INBOX WORKSPACE ================= */}
      {activeTab === 'conversations' && (
        <div className="flex-1 flex overflow-hidden">
          {/* ================= LEFT COLUMN: CONVERSATION LIST ================= */}
          <aside className="w-80 lg:w-96 border-r border-sky-500/15 bg-[#050c18] flex flex-col shrink-0">
            {/* Search & Status Filters */}
            <div className="p-3 border-b border-sky-500/15 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0b172a] border border-sky-500/20 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[11px] font-mono">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'waiting_for_agent', label: 'Escalated' },
                  { id: 'ai_handling', label: 'AI Active' },
                  { id: 'resolved', label: 'Resolved' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setStatusFilter(tab.id);
                    }}
                    className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${statusFilter === tab.id
                      ? 'bg-sky-500/20 border border-sky-400/40 text-sky-200'
                      : 'text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Feed */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  No conversations matching current filter.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === activeConvId;
                  const isWaiting = conv.status === 'waiting_for_agent';
                  const isResolved = conv.status === 'resolved';

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        sound.playClick();
                        setActiveConvId(conv.id);
                      }}
                      className={`p-3.5 transition-colors cursor-pointer border-l-2 ${isSelected
                        ? 'bg-[#0b172a] border-l-sky-400'
                        : isWaiting
                          ? 'bg-amber-500/5 hover:bg-[#0b172a]/60 border-l-amber-400'
                          : 'hover:bg-[#0b172a]/40 border-l-transparent'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-xs text-slate-200 truncate">
                          {conv.customerName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {conv.subject && (
                        <p className="text-[11px] font-medium text-sky-300 truncate mb-1">
                          {conv.subject}
                        </p>
                      )}

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2 font-sans">
                        {conv.lastMessage}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                          {/* Channel Badge */}
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                            {conv.channel}
                          </span>

                          {/* AI / Human Badge */}
                          {conv.aiEnabled ? (
                            <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                              <Bot className="w-2.5 h-2.5" />
                              <span>AI Active</span>
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                              <Headphones className="w-2.5 h-2.5" />
                              <span>Human</span>
                            </span>
                          )}
                        </div>

                        {/* Status pill */}
                        {isWaiting && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Waiting
                          </span>
                        )}
                        {isResolved && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* ================= CENTER COLUMN: CONVERSATION VIEW ================= */}
          <main className="flex-1 flex flex-col bg-[#071324] overflow-hidden">
            {activeConversation ? (
              <>
                {/* Conversation Header & Action Bar */}
                <div className="p-3.5 border-b border-sky-500/15 bg-[#0a182c] flex items-center justify-between shrink-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-sm text-white">{activeConversation.customerName}</h2>
                      <span className="text-xs text-slate-400 font-mono">({activeConversation.customerEmail})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                        {activeConversation.channel}
                      </span>
                    </div>
                    {activeConversation.subject && (
                      <p className="text-xs text-sky-300 mt-0.5">{activeConversation.subject}</p>
                    )}
                  </div>

                  {/* Agent Command Buttons */}
                  <div className="flex items-center gap-2">
                    {activeConversation.aiEnabled ? (
                      <button
                        onClick={handleTakeOverAI}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Headphones className="w-3.5 h-3.5" />
                        <span>Take Over from AI</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleReturnToAI}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Return to AI</span>
                      </button>
                    )}

                    {activeConversation.status !== 'resolved' && (
                      <button
                        onClick={handleMarkResolved}
                        className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-200 font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Timeline */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 select-text text-sm">
                  {messages.map((m) => {
                    if (m.senderType === 'SYSTEM') {
                      return (
                        <div key={m.id} className="text-center my-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-slate-400">
                            {m.content}
                          </span>
                        </div>
                      );
                    }

                    if (m.senderType === 'INTERNAL_NOTE') {
                      return (
                        <div key={m.id} className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-xs font-sans my-2">
                          <div className="flex items-center justify-between pb-1 mb-1 border-b border-amber-500/20 text-[10px] font-mono text-amber-300">
                            <span className="flex items-center gap-1 font-bold">
                              <Lock className="w-3 h-3" />
                              INTERNAL NOTE (Visible only to agents)
                            </span>
                            <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>
                      );
                    }

                    const isCustomer = m.senderType === 'CUSTOMER';
                    const isAgent = m.senderType === 'AGENT';

                    return (
                      <div
                        key={m.id}
                        className={`flex gap-2.5 ${isAgent ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isAgent && (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isCustomer
                              ? 'bg-sky-500/20 border border-sky-400/40 text-sky-300'
                              : 'bg-slate-800 border border-slate-700 text-slate-300'
                              }`}
                          >
                            {isCustomer ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                        )}

                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${isAgent
                            ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-tr-none'
                            : isCustomer
                              ? 'bg-[#0c1c34] border border-sky-500/30 text-slate-100 rounded-tl-none'
                              : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-1 pb-1 border-b border-white/10 text-[10px] font-mono">
                            <span className={isAgent ? 'text-purple-200 font-bold' : 'text-sky-300 font-bold'}>
                              {m.senderName || (isAgent ? 'Shekhar Birda' : 'Visitor')}
                            </span>
                            <span className="text-slate-400">{new Date(m.createdAt).toLocaleTimeString()}</span>
                          </div>

                          <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>

                        {isAgent && (
                          <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-400/50 flex items-center justify-center shrink-0 mt-0.5 text-purple-300">
                            <Headphones className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Composer */}
                <form onSubmit={handleSendMessage} className="p-3.5 bg-[#050c18] border-t border-sky-500/15 shrink-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setComposerMode('reply')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider transition-colors cursor-pointer ${composerMode === 'reply'
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      Public Reply (Customer)
                    </button>
                    <button
                      type="button"
                      onClick={() => setComposerMode('internal_note')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${composerMode === 'internal_note'
                        ? 'bg-amber-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>Internal Note</span>
                    </button>
                  </div>

                  <div className="flex items-end gap-2">
                    <textarea
                      rows={2}
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder={
                        composerMode === 'reply'
                          ? 'Reply directly to customer as Shekhar Birda (Press Enter to send)...'
                          : 'Add an internal note only visible to team and admin...'
                      }
                      className={`flex-1 p-3 rounded-xl border text-xs focus:outline-none resize-none transition-colors ${composerMode === 'internal_note'
                        ? 'bg-[#1e1a0b] border-amber-500/40 text-amber-100 placeholder:text-amber-500/60 focus:border-amber-400'
                        : 'bg-[#0b172a] border-sky-500/25 text-slate-100 placeholder:text-slate-500 focus:border-sky-400'
                        }`}
                    />

                    <button
                      type="submit"
                      disabled={!composerText.trim()}
                      className={`p-3 rounded-xl text-white disabled:opacity-40 transition-all cursor-pointer ${composerMode === 'internal_note'
                        ? 'bg-amber-600 hover:bg-amber-500'
                        : 'bg-purple-600 hover:bg-purple-500'
                        }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs">
                Select a conversation from the left to view messages.
              </div>
            )}
          </main>

          {/* ================= RIGHT COLUMN: CUSTOMER & TELEMETRY ================= */}
          {activeConversation && (
            <aside className="w-72 lg:w-80 border-l border-sky-500/15 bg-[#050c18] p-4 flex flex-col shrink-0 overflow-y-auto space-y-5 text-xs font-mono">
              {/* Customer Profile Card */}
              <div className="p-4 rounded-2xl bg-[#071324] border border-sky-500/20 space-y-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Customer Telemetry</span>
                <div>
                  <p className="text-sm font-bold text-white font-sans">{activeConversation.customerName}</p>
                  <p className="text-[11px] text-sky-400 mt-0.5">{activeConversation.customerEmail}</p>
                  {activeConversation.customerPhone && (
                    <p className="text-[11px] text-slate-300 mt-0.5">{activeConversation.customerPhone}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Channel:</span>
                    <span className="text-slate-200 capitalize">{activeConversation.channel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First Contact:</span>
                    <span className="text-slate-200">{new Date(activeConversation.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Status Controls */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 text-[10px] uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={activeConversation.status}
                    onChange={(e) => handleStatusChange(e.target.value as ConversationStatus)}
                    className="w-full p-2 bg-[#0b172a] border border-sky-500/25 rounded-xl text-slate-200 focus:outline-none focus:border-sky-400"
                  >
                    <option value="open">Open</option>
                    <option value="ai_handling">AI Handling</option>
                    <option value="waiting_for_agent">Waiting for Agent</option>
                    <option value="agent_handling">Agent Handling</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={activeConversation.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as PriorityLevel)}
                    className="w-full p-2 bg-[#0b172a] border border-sky-500/25 rounded-xl text-slate-200 focus:outline-none focus:border-sky-400"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">AI Automation</span>
                  <button
                    onClick={() => {
                      if (activeConversation.aiEnabled) {
                        handleTakeOverAI();
                      } else {
                        handleReturnToAI();
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${activeConversation.aiEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                  >
                    {activeConversation.aiEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <span className="block text-slate-400 text-[10px] uppercase tracking-wider mb-1.5">Conversation Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {(activeConversation.tags || ['Inquiry', 'Frontend']).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
