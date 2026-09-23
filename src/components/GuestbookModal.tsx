import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  Send,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_GUESTBOOK } from '../data/portfolioData';
import { GuestbookMessage } from '../types';
import { sound } from '../utils/sound';
import {
  subscribeToGuestbook,
  postGuestbookMessage,
  logAnalyticsEvent,
} from '../lib/firebase';

interface GuestbookModalProps {
  onClose: () => void;
}

export const GuestbookModal: React.FC<GuestbookModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<GuestbookMessage[]>(() => {
    const saved = localStorage.getItem('shekhar_guestbook');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_GUESTBOOK;
  });

  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [messageText, setMessageText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);

  // Real-time Firestore subscription + local BroadcastChannel fallback
  useEffect(() => {
    const unsubscribe = subscribeToGuestbook((remoteMessages) => {
      if (remoteMessages && remoteMessages.length > 0) {
        setMessages(remoteMessages);
        localStorage.setItem('shekhar_guestbook', JSON.stringify(remoteMessages));
      }
    }, INITIAL_GUESTBOOK);

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('portfolio_guestbook_realtime');
      bc.onmessage = (event) => {
        if (event.data?.type === 'NEW_MESSAGE') {
          setMessages((prev) => [event.data.message, ...prev]);
        }
      };
    }

    return () => {
      unsubscribe();
      bc?.close();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !messageText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    const newMsg: GuestbookMessage = {
      id: `msg-${Date.now()}`,
      author: author.trim(),
      role: role.trim() || 'Visitor / Recruiter',
      message: messageText.trim(),
      timestamp: Date.now(),
      avatarColor: chosenColor,
      rating,
    };

    // Optimistic UI update
    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('shekhar_guestbook', JSON.stringify(updated));

    // Post to Firestore
    try {
      const res = await postGuestbookMessage({
        author: newMsg.author,
        role: newMsg.role,
        message: newMsg.message,
        avatarColor: newMsg.avatarColor,
        rating: newMsg.rating,
      });

      if (res.success) {
        setSubmitNotice('✓ Message published to live board!');
        logAnalyticsEvent('guestbook_endorsement_posted', {
          rating: newMsg.rating,
          has_role: Boolean(newMsg.role),
        });
      } else {
        setSubmitNotice('✓ Saved locally & broadcast to active explorers.');
      }
    } catch {
      setSubmitNotice('✓ Saved locally & broadcast.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitNotice(null), 4000);
    }

    // Broadcast in real-time across tabs
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('portfolio_guestbook_realtime');
      bc.postMessage({ type: 'NEW_MESSAGE', message: newMsg });
      bc.close();
    }

    setAuthor('');
    setRole('');
    setMessageText('');
    sound.playCoin();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0f172a] border border-[#334155] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e293b] border border-[#475569] flex items-center justify-center text-[#f1f5f9]">
              <MessageSquare className="w-5 h-5 text-[#f1f5f9]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#f1f5f9] font-display">Real-Time Guestbook & Reviews</h2>
              <p className="text-xs text-[#94a3b8]">Share your thoughts, feedback & endorsements</p>
            </div>
          </div>

          <button
            id="close-guestbook-btn"
            onClick={() => {
              onClose();
              sound.playClick();
            }}
            className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guestbook Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="bg-[#090d16]/80 border border-[#334155] p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">Leave an Endorsement</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="cursor-pointer text-amber-400 hover:scale-125 transition-transform"
                  >
                    <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                placeholder="Your Name *"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#475569]"
              />
              <input
                type="text"
                placeholder="Your Role or Company (Optional)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#475569]"
              />
            </div>

            <textarea
              required
              rows={2}
              placeholder="Share your thoughts on the 3D toy car experience or projects..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#475569] resize-none"
            />

            <div className="flex items-center justify-between">
              {submitNotice ? (
                <span className="text-xs font-mono text-slate-300 animate-pulse">{submitNotice}</span>
              ) : (
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Cloud Sync Active
                </span>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                id="submit-guestbook-btn"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#f1f5f9] hover:bg-white disabled:opacity-50 text-[#0f172a] shadow-sm transition-all cursor-pointer active:scale-95 font-mono"
              >
                <Send className="w-3.5 h-3.5 text-[#0f172a]" />
                <span>{isSubmitting ? 'Syncing...' : 'Post to Board'}</span>
              </button>
            </div>
          </form>

          {/* List of Messages */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400">
              Community Endorsements ({messages.length})
            </div>
            {messages.map((item) => (
              <div
                key={item.id}
                className="bg-[#090d16]/60 border border-[#334155]/80 p-4 rounded-2xl flex items-start gap-3"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md"
                  style={{ backgroundColor: item.avatarColor }}
                >
                  {item.author.substring(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.author}</span>
                      {item.role && (
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                          {item.role}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                    {new Date(item.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#334155] bg-[#090d16]/90 flex justify-end">
          <button
            onClick={() => {
              onClose();
              sound.playClick();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1e293b] hover:bg-[#334155] text-[#f1f5f9] transition-colors cursor-pointer"
          >
            Close Board
          </button>
        </div>
      </div>
    </div>
  );
};
