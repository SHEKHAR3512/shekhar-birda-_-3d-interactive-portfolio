import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Headphones,
  Paperclip,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { supportStore } from '../../lib/support/supportStore';
import { SupportConversation, SupportMessage } from '../../lib/support/types';
import { queryKnowledgeDocs } from '../../lib/knowledge/knowledgeBase';
import { detectHandoffIntent } from '../../lib/ai/aiProviders';
import { sound } from '../../utils/sound';

interface SupportWidgetProps {
  onNavigateToPortal?: () => void;
}

export function SupportWidget({ onNavigateToPortal }: SupportWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeConversation, setActiveConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showAttachmentNotice, setShowAttachmentNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or fetch current active conversation
  useEffect(() => {
    const initConversation = () => {
      const conv = supportStore.getOrCreateVisitorConversation();
      setActiveConversation(conv);
      setMessages(supportStore.getMessages(conv.id));
    };

    initConversation();
    const unsubscribe = supportStore.subscribe(() => {
      const conv = supportStore.getOrCreateVisitorConversation();
      setActiveConversation(conv);
      setMessages(supportStore.getMessages(conv.id));
    });

    return unsubscribe;
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiTyping, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConversation) return;

    sound.playClick();
    setInputText('');

    // Add user message
    supportStore.addMessage({
      conversationId: activeConversation.id,
      senderType: 'CUSTOMER',
      senderName: 'You',
      content: text,
    });

    // Check if user explicitly requested a human agent in this message
    if (detectHandoffIntent(text)) {
      handleRequestHuman();
      return;
    }

    // If conversation was waiting for agent or AI was paused, auto-resume AI so questions get immediate answers
    if (!activeConversation.aiEnabled || activeConversation.status === 'waiting_for_agent') {
      supportStore.updateConversation(activeConversation.id, {
        status: 'ai_handling',
        aiEnabled: true,
      });
    } else if (activeConversation.status === 'agent_handling') {
      supportStore.addMessage({
        conversationId: activeConversation.id,
        senderType: 'SYSTEM',
        content: 'Your message has been sent to Shekhar Birda. He will reply shortly.',
      });
      return;
    }

    // Call AI service
    setIsAiTyping(true);
    try {
      const allMsgs = [...supportStore.getMessages(activeConversation.id)];
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMsgs,
          conversationId: activeConversation.id,
          customerName: activeConversation.customerName,
        }),
      });

      if (!res.ok) {
        throw new Error(`AI query failed with status ${res.status}`);
      }

      const data = await res.json();
      setIsAiTyping(false);

      // Add AI reply to store
      supportStore.addMessage({
        conversationId: activeConversation.id,
        senderType: 'AI',
        senderName: 'AI Support Assistant',
        content: data.text || data.reply || 'I am ready to help with any questions about Shekhar’s experience.',
        metadata: {
          modelUsed: data.modelUsed,
          groundedDocIds: data.groundedDocIds,
          handoffTriggered: data.handoffRequested,
        },
      });

      // If handoff was requested, update conversation status
      if (data.handoffRequested) {
        supportStore.updateConversation(activeConversation.id, {
          status: 'waiting_for_agent',
          aiEnabled: false,
        });
      }
      sound.playCoin();
    } catch (err) {
      console.warn('AI support fetch error, generating client grounded fallback:', err);
      setIsAiTyping(false);

      // Formulate factual grounded reply on the client
      const matched = queryKnowledgeDocs(text, 2);
      let replyText = `Hello! I am Shekhar Birda's AI Support Assistant. Shekhar is a **Senior React Native & React.js Developer** with 2+ years of production experience at Apptunix.`;
      if (matched.length > 0) {
        replyText = `### ${matched[0].title}\n${matched[0].content}`;
        if (matched[1] && matched[1].category !== matched[0].category) {
          replyText += `\n\n### Related Reference: ${matched[1].title}\n${matched[1].summary}`;
        }
      }

      supportStore.addMessage({
        conversationId: activeConversation.id,
        senderType: 'AI',
        senderName: 'AI Support Assistant',
        content: replyText,
        metadata: { modelUsed: 'Portfolio Grounded Engine (Client Engine)' },
      });
      sound.playCoin();
    }
  };

  const handleQuickAction = (actionText: string) => {
    handleSendMessage(actionText);
  };

  const handleRequestHuman = () => {
    if (!activeConversation) return;
    sound.playClick();

    supportStore.addMessage({
      conversationId: activeConversation.id,
      senderType: 'SYSTEM',
      content: 'Visitor requested a human agent. Automated AI replies have been paused.',
      metadata: { handoffTriggered: true },
    });

    supportStore.updateConversation(activeConversation.id, {
      status: 'waiting_for_agent',
      aiEnabled: false,
    });
  };

  const handleResumeAI = () => {
    if (!activeConversation) return;
    sound.playClick();

    supportStore.addMessage({
      conversationId: activeConversation.id,
      senderType: 'SYSTEM',
      content: 'AI Assistant resumed. Automated responses are now active.',
    });

    supportStore.updateConversation(activeConversation.id, {
      status: 'ai_handling',
      aiEnabled: true,
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* ================= FLOATING LAUNCHER BUTTON ================= */}
      {!isOpen && (
        <button
          onClick={() => {
            sound.playClick();
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-500 text-white shadow-[0_8px_30px_rgba(2,132,199,0.45)] hover:shadow-[0_10px_40px_rgba(2,132,199,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 border border-sky-300/40 cursor-pointer"
          title="Open AI Customer Support Center"
        >
          {/* Animated pulse ring */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900" />
          </span>

          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-5 h-5 text-white animate-pulse" />
          </div>

          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-wider uppercase font-mono">Need Help?</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/25 font-mono">AI Support</span>
            </div>
            <p className="text-[10px] text-sky-100 font-mono">Replies instantly</p>
          </div>
        </button>
      )}

      {/* ================= CHAT PANEL (MODERN SAAS STYLE) ================= */}
      {isOpen && (
        <div
          className={`w-[94vw] sm:w-[410px] bg-[#07111f]/95 backdrop-blur-xl border border-sky-500/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-[64px]' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#0d1e38] to-[#0a182c] border-b border-sky-500/20 flex items-center justify-between text-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-sky-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#07111f]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm tracking-wide">Shekhar AI Support</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Usually replies in &lt;1 second</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              {onNavigateToPortal && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateToPortal();
                  }}
                  title="Open Dedicated Support Portal (/support)"
                  className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  sound.playClick();
                  setIsMinimized(!isMinimized);
                }}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsOpen(false);
                }}
                title="Close Support"
                className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Human Agent Waiting Banner */}
              {activeConversation?.status === 'waiting_for_agent' && (
                <div className="px-4 py-2.5 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Waiting for a human agent...</span>
                  </div>
                  <button
                    onClick={handleResumeAI}
                    className="px-2 py-1 rounded bg-amber-500/25 hover:bg-amber-500/40 text-amber-100 font-mono text-[10px] tracking-wider transition-colors cursor-pointer"
                  >
                    Resume AI
                  </button>
                </div>
              )}

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 select-text text-sm scroll-smooth">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Sparkles className="w-8 h-8 text-sky-400 mx-auto mb-2 opacity-60" />
                    <p className="text-xs">Ask anything about Shekhar’s engineering stack, projects, or hire him directly.</p>
                  </div>
                )}

                {messages.map((m) => {
                  if (m.senderType === 'SYSTEM') {
                    return (
                      <div key={m.id} className="text-center my-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-slate-300">
                          {m.content}
                        </span>
                      </div>
                    );
                  }

                  const isUser = m.senderType === 'CUSTOMER';
                  const isAgent = m.senderType === 'AGENT';

                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isAgent
                              ? 'bg-purple-600/30 border border-purple-400/50 text-purple-300'
                              : 'bg-sky-500/20 border border-sky-400/40 text-sky-400'
                          }`}
                        >
                          {isAgent ? <Headphones className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-tr-none'
                            : isAgent
                            ? 'bg-[#18152e] border border-purple-500/40 text-slate-100 rounded-tl-none'
                            : 'bg-[#0f1f38] border border-sky-500/20 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {!isUser && (
                          <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-white/10 text-[10px] font-mono">
                            <span className={isAgent ? 'text-purple-300 font-semibold' : 'text-sky-300 font-semibold'}>
                              {isAgent ? 'Shekhar Birda (Support)' : 'AI Copilot'}
                            </span>
                            {m.metadata?.modelUsed && (
                              <span className="text-slate-400 text-[9px]">{m.metadata.modelUsed}</span>
                            )}
                          </div>
                        )}

                        <div className="whitespace-pre-wrap">{m.content}</div>

                        <div
                          className={`text-[9px] mt-1 font-mono text-right ${
                            isUser ? 'text-sky-200/80' : 'text-slate-400'
                          }`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* AI Typing Indicator */}
                {isAiTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                      <Bot className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div className="bg-[#0f1f38] border border-sky-500/20 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[11px] font-mono text-slate-400 ml-1">Formulating verified reply...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Suggestion Chips */}
              <div className="px-3 py-2 bg-[#050c17] border-t border-sky-500/15 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
                <button
                  onClick={() => handleQuickAction('Tell me about your work on Snibbl and food waste reduction.')}
                  className="px-2.5 py-1 rounded-full bg-sky-950/60 hover:bg-sky-900 border border-sky-500/30 text-sky-300 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer"
                >
                  🍎 Snibbl Case Study
                </button>
                <button
                  onClick={() => handleQuickAction('What is your React Native & mobile tech stack?')}
                  className="px-2.5 py-1 rounded-full bg-sky-950/60 hover:bg-sky-900 border border-sky-500/30 text-sky-300 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer"
                >
                  ⚡ Mobile Stack
                </button>
                <button
                  onClick={() => handleQuickAction('Are you available for full-time or contract roles?')}
                  className="px-2.5 py-1 rounded-full bg-sky-950/60 hover:bg-sky-900 border border-sky-500/30 text-sky-300 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer"
                >
                  💼 Hire Shekhar
                </button>
                <button
                  onClick={handleRequestHuman}
                  className="px-2.5 py-1 rounded-full bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Headphones className="w-3 h-3" />
                  <span>Talk to Human</span>
                </button>
              </div>

              {/* Attachment Simulated Notification */}
              {showAttachmentNotice && (
                <div className="px-3 py-1.5 bg-sky-500/15 text-[11px] text-sky-300 font-mono flex items-center justify-between border-t border-sky-500/20">
                  <span>Attachment simulated (PDF / PNG ready for upload)</span>
                  <button onClick={() => setShowAttachmentNotice(false)} className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Input Bar */}
              <div className="p-3 bg-[#07111f] border-t border-sky-500/20 flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowAttachmentNotice(true);
                  }}
                  title="Attach file / screenshot (Simulated)"
                  className="p-2 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask anything or request a human..."
                  className="flex-1 bg-[#0b172a] border border-sky-500/25 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 text-white transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
