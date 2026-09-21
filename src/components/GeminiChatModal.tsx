import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  X,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Cpu,
  Briefcase,
  Download,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import { sound } from '../utils/sound';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  modelUsed?: string;
}

interface GeminiChatModalProps {
  onClose: () => void;
  onOpenContact?: () => void;
}

const SUGGESTED_PROMPTS = [
  'Tell me about Snibbl (snibbl.com) architecture',
  'What did Shekhar build for EDU-Match (edumatchconnect.ai)?',
  'Tell me about Magrudy\'s (magrudy.com) loyalty system',
  'What tech stack powers Gulf Bar Show (gulfbarshow.com)?',
  'Is Shekhar available for Senior Frontend/Mobile roles?',
];

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({
  onClose,
  onOpenContact,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Greetings, explorer! I am **Shekhar Birda's Cosmic Co-Pilot**, protected by zero-cost free-tier safeguards.\n\nI can answer questions regarding Shekhar's **2+ years of production experience**, his live projects:\n- 🍎 **Snibbl:** [https://snibbl.com/](https://snibbl.com/) (12,000+ users, food rescue)\n- 🎓 **EDU-Match:** [https://edumatchconnect.ai/](https://edumatchconnect.ai/) (AI university & career matching)\n- 📚 **Magrudy's:** [https://www.magrudy.com/](https://www.magrudy.com/) (Omnichannel retail loyalty)\n- 🍸 **Gulf Bar Show:** [https://gulfbarshow.com/](https://gulfbarshow.com/) (Expo companion web app)\n\n*(Note: To keep this service 100% free and prevent abuse, I am strictly focused on Shekhar's work and hiring inquiries.)*\n\nHow can I help you today?`,
      timestamp: Date.now(),
      modelUsed: 'gemini-2.5-flash (Free Tier)',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-2.5-flash' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite'>('gemini-2.5-flash');
  const [selectedRole, setSelectedRole] = useState<'copilot' | 'architect' | 'recruiter'>('copilot');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isLoading) return;

    sound.playClick();

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: promptText,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Send conversation thread to backend server with anti-abuse & zero-cost controls
      const payloadMessages = newHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          model: selectedModel,
          role: selectedRole,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: data.reply || 'No response generated.',
        timestamp: Date.now(),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, aiMessage]);
      sound.playCoin();
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Notice:** ${err.message || 'Unable to fetch response.'}\n\nYou can always reach Shekhar Birda directly at [shekharjaat751@gmail.com](mailto:shekharjaat751@gmail.com).`,
        timestamp: Date.now(),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    sound.playClick();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Conversation cleared. I am ready for your next question regarding Shekhar Birda's engineering work!`,
        timestamp: Date.now(),
        modelUsed: selectedModel,
      },
    ]);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sound.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportTranscript = () => {
    const transcript = messages
      .map(
        (m) =>
          `[${new Date(m.timestamp).toLocaleTimeString()}] ${
            m.role === 'user' ? 'USER' : `GEMINI (${m.modelUsed || selectedModel})`
          }:\n${m.text}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shekhar-birda-chat-transcript-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    sound.playClick();
  };

  // Simple Markdown parser for bolding, bullet points, headers, and code
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-sky-300 text-sm mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullet list
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-200 my-0.5 leading-relaxed">
            {formatInline(content)}
          </li>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-200 my-0.5 leading-relaxed">
            {formatInline(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Standard paragraph
      return (
        <p key={idx} className="text-xs text-slate-200 leading-relaxed my-0.5">
          {formatInline(line)}
        </p>
      );
    });
  };

  const formatInline = (str: string) => {
    // Basic regex replace for **bold** and `code`
    const parts: (string | React.ReactNode)[] = [];
    const tokens = str.split(/(\*\*.*?\*\*|`.*?`)/g);

    tokens.forEach((tok, i) => {
      if (tok.startsWith('**') && tok.endsWith('**')) {
        parts.push(
          <strong key={i} className="font-bold text-white">
            {tok.slice(2, -2)}
          </strong>
        );
      } else if (tok.startsWith('`') && tok.endsWith('`')) {
        parts.push(
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px]">
            {tok.slice(1, -1)}
          </code>
        );
      } else {
        parts.push(tok);
      }
    });

    return parts;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="gemini-chat-container"
        className="relative w-full max-w-3xl h-[88vh] max-h-[760px] bg-[#090b10] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* TOP HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 bg-[#0d0f17] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide font-display">Gemini AI Co-Pilot</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-slate-400" />
                  FREE TIER PROTECTED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Anti-Abuse Safeguards Active • Strictly Scoped to Shekhar's Portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={exportTranscript}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
              title="Export Transcript (.txt)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              id="close-gemini-chat-btn"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
              title="Close Chat [Esc]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ROLE & MODEL CONTROLS STRIP */}
        <div className="px-5 py-2.5 bg-slate-900/40 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Persona Role Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Role:</span>
            <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('copilot');
                  sound.playClick();
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  selectedRole === 'copilot'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Co-Pilot</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('architect');
                  sound.playClick();
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  selectedRole === 'architect'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>Lead Architect</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('recruiter');
                  sound.playClick();
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  selectedRole === 'recruiter'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>Recruiter Screener</span>
              </button>
            </div>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Model:</span>
            <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSelectedModel('gemini-2.5-flash');
                  sound.playClick();
                }}
                title="Gemini 2.5 Flash: 100% Free Tier Eligible in Google AI Studio"
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  selectedModel === 'gemini-2.5-flash'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>2.5 Flash (Free)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedModel('gemini-3.5-flash');
                  sound.playClick();
                }}
                title="Gemini 3.5 Flash: General tasks & free tier recommended"
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  selectedModel === 'gemini-3.5-flash'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>3.5 Flash</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedModel('gemini-3.1-flash-lite');
                  sound.playClick();
                }}
                title="Gemini 3.1 Flash Lite: Fast low-latency Q&A"
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>3.1 Lite</span>
              </button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE MESSAGE THREAD */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                    isUser
                      ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
                      : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className="flex-1 group relative">
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs leading-relaxed border shadow-md ${
                      isUser
                        ? 'bg-sky-950/40 border-sky-700/50 text-sky-100 rounded-tr-none'
                        : 'bg-slate-900/80 border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {renderFormattedText(m.text)}
                  </div>

                  {/* Message Meta & Copy Action */}
                  <div
                    className={`flex items-center gap-2 mt-1 px-1 text-[10px] font-mono text-slate-500 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {m.modelUsed && !isUser && (
                      <span className="text-[9px] bg-slate-800/80 px-1.5 py-0.2 rounded text-slate-400 border border-slate-700/60">
                        {m.modelUsed}
                      </span>
                    )}
                    <button
                      onClick={() => copyMessage(m.id, m.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white cursor-pointer"
                      title="Copy text"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-300">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Thinking with {selectedModel}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* SUGGESTED PROMPT CHIPS */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-[#0c0e15] overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar">
          <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">Prompts:</span>
          {SUGGESTED_PROMPTS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="text-[11px] text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 px-2.5 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95 disabled:opacity-40 font-mono"
            >
              {p}
            </button>
          ))}
        </div>

        {/* INPUT FORM */}
        <div className="border-t border-slate-800/80 bg-[#0d0f17] p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 bg-[#07080d] border border-slate-800 focus-within:border-slate-600 rounded-2xl p-2 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                maxLength={350}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask Gemini Co-Pilot about Shekhar's projects, architecture, or skills (max 350 chars)...`}
                rows={1}
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-none max-h-24 px-1 py-1"
              />
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              id="send-gemini-chat-btn"
              className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-white disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95 shrink-0 font-mono"
            >
              <Send className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

          {/* ZERO-COST & ANTI-ABUSE ASSURANCE BAR */}
          <div className="flex items-center justify-between mt-2 px-1 text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-400/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free-tier protected • Max 10 msgs / 5 min • 0% cost guarantee</span>
            </div>
            <span className={input.length > 300 ? 'text-amber-400' : 'text-slate-500'}>
              {input.length}/350
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
