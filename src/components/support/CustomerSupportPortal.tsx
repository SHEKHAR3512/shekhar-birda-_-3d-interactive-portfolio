import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  LifeBuoy,
  MessageSquare,
  Mail,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  X,
  Lock,
  Headphones,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { PORTFOLIO_KNOWLEDGE_DOCS, queryKnowledgeDocs } from '../../lib/knowledge/knowledgeBase';
import { KnowledgeDoc, SupportTicket } from '../../lib/support/types';
import { supportStore } from '../../lib/support/supportStore';
import { sound } from '../../utils/sound';
import { SupportWidget } from './SupportWidget';

interface CustomerSupportPortalProps {
  onReturnToPortfolio: () => void;
  onOpenAdmin: () => void;
}

export function CustomerSupportPortal({ onReturnToPortfolio, onOpenAdmin }: CustomerSupportPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDoc, setActiveDoc] = useState<KnowledgeDoc | null>(null);

  // Ticket Form State
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('technical');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('normal');
  const [ticketDescription, setTicketDescription] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);

  // Integration Health Telemetry
  const [integrationHealth, setIntegrationHealth] = useState({
    aiProvider: 'gemini',
    aiModel: 'gemini-2.5-flash',
    emailConfigured: false,
    whatsappConfigured: false,
  });

  useEffect(() => {
    fetch('/api/support/integrations')
      .then((res) => res.json())
      .then((data) => {
        setIntegrationHealth({
          aiProvider: data.aiProvider || 'gemini',
          aiModel: data.aiModel || 'gemini-2.5-flash',
          emailConfigured: data.email?.configured || false,
          whatsappConfigured: data.whatsapp?.configured || false,
        });
      })
      .catch(() => {
        // Safe offline defaults
      });
  }, []);

  const filteredDocs = searchQuery.trim()
    ? queryKnowledgeDocs(searchQuery, 12)
    : selectedCategory === 'all'
    ? PORTFOLIO_KNOWLEDGE_DOCS
    : PORTFOLIO_KNOWLEDGE_DOCS.filter((d) => d.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'profile', label: 'Profile & Bio' },
    { id: 'skills', label: 'Technical Stack' },
    { id: 'projects', label: 'Live Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'hiring', label: 'Hiring & Rates' },
    { id: 'faq', label: 'Engineering FAQs' },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketEmail || !ticketDescription) return;

    sound.playClick();
    const newTicket = supportStore.createTicket({
      subject: ticketSubject,
      description: ticketDescription,
      category: ticketCategory,
      priority: ticketPriority,
      customerName: ticketName || 'Anonymous',
      customerEmail: ticketEmail,
    });

    setSubmittedTicket(newTicket);
    setTicketSubject('');
    setTicketDescription('');
  };

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-[#030712] text-slate-100 flex flex-col font-sans select-text scroll-smooth">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="border-b border-sky-500/15 bg-[#07111f]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onReturnToPortfolio();
            }}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-sky-300 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </button>

          <span className="text-slate-600">/</span>

          <div className="flex items-center gap-2">
            <span className="font-display font-bold tracking-wider text-sm text-slate-100">
              SHEKHAR SUPPORT
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-sky-500/30 bg-sky-950/40 text-sky-400">
              Center v2.5
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setShowTicketModal(true);
            }}
            className="px-3.5 py-1.5 rounded-lg border border-sky-500/40 bg-sky-600/20 hover:bg-sky-600/30 text-sky-200 text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-sky-400" />
            <span>Create Ticket</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAdmin();
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Agent Console</span>
          </button>
        </div>
      </header>

      {/* ================= HERO SEARCH SECTION ================= */}
      <section className="relative px-6 py-14 sm:py-20 max-w-4xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-950/30 text-sky-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>AI-Powered Knowledge & Customer Support Hub</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          How can we assist your engineering needs today?
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
          Search Shekhar Birda’s verified portfolio knowledge base, explore flagship case studies, or connect with our AI and human support desk.
        </p>

        {/* Global Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (React Native, TurboModules), projects (Snibbl, EDU-Match), hiring, or rates..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#0b172a] border border-sky-500/30 focus:border-sky-400 rounded-2xl text-sm text-slate-100 placeholder:text-slate-500 shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      {/* ================= MAIN CONTENT & CATEGORY FILTER ================= */}
      <main className="max-w-6xl mx-auto w-full px-6 pb-20 flex-1">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-sky-500/15">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-sky-500/25 border border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Knowledge Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {filteredDocs.map((doc) => (
            <article
              key={doc.id}
              onClick={() => {
                sound.playClick();
                setActiveDoc(doc);
              }}
              className="group p-5 rounded-2xl bg-[#0b172a]/70 hover:bg-[#0f213d] border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-400">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{doc.lastUpdated}</span>
                </div>

                <h3 className="font-semibold text-sm text-slate-100 group-hover:text-sky-300 transition-colors mb-2 line-clamp-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {doc.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-mono text-sky-400 group-hover:translate-x-0.5 transition-transform">
                <span>Read Document</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </article>
          ))}
        </div>

        {/* ================= DIRECT ESCALATION CHANNELS ================= */}
        <section className="bg-gradient-to-r from-[#071324] to-[#0a182c] border border-sky-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Escalation Matrix</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Need immediate human consultation or custom scoping?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Shekhar Birda is actively responsive to engineering leads and recruiters. Connect directly through your preferred channel.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {integrationHealth.whatsappConfigured && (
                <a
                  href="https://wa.me/919996231869?text=Hi%20Shekhar,%20I%20am%20exploring%20your%20portfolio%20and%20support%20center"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold tracking-wider transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>WhatsApp Direct</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {integrationHealth.emailConfigured && (
                <a
                  href="mailto:shekharjaat751@gmail.com?subject=Support%20Inquiry%20via%20Portfolio"
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold tracking-wider transition-all flex items-center gap-2 shadow-lg"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Support</span>
                </a>
              )}

              <button
                onClick={() => setShowTicketModal(true)}
                className="px-4 py-2.5 rounded-xl border border-sky-500/40 bg-sky-600/20 hover:bg-sky-600/30 text-sky-200 font-mono text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Open Support Ticket</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================= PLATFORM INTEGRATIONS HEALTH TELEMETRY ================= */}
        <section className="border border-slate-800 rounded-2xl p-5 bg-[#050c18] text-xs font-mono text-slate-400">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-slate-200 font-bold uppercase tracking-wider">
              Support Infrastructure Status
            </span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Active Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-500 text-[10px]">AI PROVIDER</span>
              <p className="text-slate-200 font-bold capitalize mt-0.5">{integrationHealth.aiProvider}</p>
              <span className="text-[10px] text-sky-400">{integrationHealth.aiModel}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-500 text-[10px]">REALTIME ENGINE</span>
              <p className="text-slate-200 font-bold mt-0.5">Firebase / Firestore</p>
              <span className="text-[10px] text-emerald-400">Active Sync</span>
            </div>

            {integrationHealth.emailConfigured && (
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-500 text-[10px]">EMAIL SERVICE</span>
                <p className="text-slate-200 font-bold mt-0.5">SMTP Integration</p>
                <span className="text-[10px] text-emerald-400">Live SMTP</span>
              </div>
            )}

            {integrationHealth.whatsappConfigured && (
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-500 text-[10px]">WHATSAPP BUSINESS</span>
                <p className="text-slate-200 font-bold mt-0.5">Meta Cloud API</p>
                <span className="text-[10px] text-emerald-400">Connected</span>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ================= KNOWLEDGE ARTICLE VIEWER MODAL ================= */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] bg-[#071324] border border-sky-500/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-sky-500/20 bg-gradient-to-r from-[#0d1e38] to-[#0a182c] flex items-center justify-between text-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400">
                    {activeDoc.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Verified Portfolio Document</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{activeDoc.title}</h2>
              </div>

              <button
                onClick={() => setActiveDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
              <div className="whitespace-pre-wrap">{activeDoc.content}</div>

              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-500">Related Tags:</span>
                {activeDoc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#050c18] border-t border-sky-500/15 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                Last grounded update: {activeDoc.lastUpdated}
              </span>
              <button
                onClick={() => setActiveDoc(null)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs cursor-pointer transition-colors"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE TICKET MODAL ================= */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#071324] border border-sky-500/40 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-sky-500/20 bg-gradient-to-r from-[#0d1e38] to-[#0a182c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-sky-400" />
                <h2 className="text-lg font-bold text-white">Create a Support Ticket</h2>
              </div>
              <button
                onClick={() => {
                  setShowTicketModal(false);
                  setSubmittedTicket(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedTicket ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Support Ticket Submitted!</h3>
                <p className="text-xs text-slate-300 font-mono">
                  Ticket ID: <span className="text-sky-400 font-bold">{submittedTicket.id}</span>
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Your ticket has been logged into Shekhar Birda’s support store. Shekhar will review your inquiry and follow up at{' '}
                  <span className="text-slate-200">{submittedTicket.customerEmail}</span>.
                </p>
                <button
                  onClick={() => {
                    setShowTicketModal(false);
                    setSubmittedTicket(null);
                  }}
                  className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-mono mb-1">Subject / Inquiry Title *</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Inquiring about React Native build or Snibbl architecture"
                    className="w-full px-3.5 py-2.5 bg-[#0b172a] border border-sky-500/30 rounded-xl text-slate-100 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-mono mb-1">Your Name</label>
                    <input
                      type="text"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2.5 bg-[#0b172a] border border-sky-500/30 rounded-xl text-slate-100 focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-mono mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 bg-[#0b172a] border border-sky-500/30 rounded-xl text-slate-100 focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-mono mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e: any) => setTicketCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#0b172a] border border-sky-500/30 rounded-xl text-slate-100 focus:outline-none focus:border-sky-400"
                    >
                      <option value="technical">Technical Question</option>
                      <option value="project_inquiry">Project Case Study</option>
                      <option value="hiring">Hiring / Full-Time</option>
                      <option value="general">General Support</option>
                      <option value="bug_report">Bug Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-mono mb-1">Priority</label>
                    <select
                      value={ticketPriority}
                      onChange={(e: any) => setTicketPriority(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#0b172a] border border-sky-500/30 rounded-xl text-slate-100 focus:outline-none focus:border-sky-400"
                    >
                      <option value="low">Low (General)</option>
                      <option value="normal">Normal (Standard)</option>
                      <option value="high">High (Urgent Role)</option>
                      <option value="urgent">Urgent (Immediate Contract)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-mono mb-1">Description / Project Scope *</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Provide details about your project, timeline, questions, or hiring requirements..."
                    className="w-full px-3.5 py-2.5 bg-[#0b172a] border border-sky-500/30 rounded-xl text-slate-100 focus:outline-none focus:border-sky-400 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white cursor-pointer font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono font-semibold cursor-pointer shadow-lg"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Embedded Live Customer Support Widget (Commented out for now)
      <SupportWidget onNavigateToPortal={() => {}} />
      */}
    </div>
  );
}
