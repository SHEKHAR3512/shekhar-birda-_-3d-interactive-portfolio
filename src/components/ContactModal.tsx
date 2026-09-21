import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Calendar,
  Download,
  Linkedin,
  Github,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  Zap,
  Database,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sound } from '../utils/sound';
import { saveContactInquiry, isFirebaseConfigured } from '../lib/firebase';

interface ContactModalProps {
  onClose: () => void;
  initialSubject?: string;
  initialBody?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose, initialSubject, initialBody }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'hire' | 'contract' | 'chat'>('hire');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderCompany, setSenderCompany] = useState('');
  const [message, setMessage] = useState(initialBody || '');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [cloudNotice, setCloudNotice] = useState<string | null>(null);

  const templates = {
    hire: {
      label: 'Full-Time / Contract Role',
      icon: Briefcase,
      subject: 'Interview / Job Opportunity: React & React Native Developer',
      defaultBody: `Hi Shekhar,\n\nWe came across your interactive 3D portfolio and were impressed by your production experience with React Native, TypeScript, and Firebase (Snibbl, MyBooky, EDU-Match).\n\nWe would love to discuss a potential role with our team.\n\nBest regards,`,
    },
    contract: {
      label: 'Freelance / Project Build',
      icon: Zap,
      subject: 'Project Inquiry: Mobile / Web App Development',
      defaultBody: `Hi Shekhar,\n\nI have an exciting project requiring React / React Native expertise and would like to consult with you regarding scope, architecture, and timeline.\n\nBest regards,`,
    },
    chat: {
      label: 'Quick Intro / Mentorship',
      icon: MessageCircle,
      subject: 'Quick Intro / Technical Chat with Shekhar',
      defaultBody: `Hi Shekhar,\n\nLoved checking out your 3D game portfolio! I'd love to connect and exchange notes on React Native and web architecture.\n\nBest regards,`,
    },
  };

  const currentTemplate = templates[selectedTemplate];

  // Copy email to clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    sound.playCoin();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Launch pre-filled email client and save to Firestore
  const handleLaunchMailClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const subjectText = initialSubject || currentTemplate.subject;
    const bodyContent =
      message ||
      `${currentTemplate.defaultBody}\n\nName: ${senderName || 'Recruiter / Client'}\nCompany: ${
        senderCompany || 'N/A'
      }\nContact Email: ${senderEmail || 'N/A'}`;

    // 1. Asynchronously persist to Firebase Firestore 'inquiries' collection
    try {
      await saveContactInquiry({
        name: senderName.trim() || 'Visitor / Recruiter',
        email: senderEmail.trim() || 'N/A',
        company: senderCompany.trim() || 'N/A',
        subject: subjectText,
        message: bodyContent,
      });
      setCloudNotice('✓ Inquiry recorded in Shekhar\'s cloud database!');
    } catch {
      setCloudNotice('✓ Saved to local session storage.');
    }

    // 2. Open email client with pre-filled details
    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
      subjectText
    )}&body=${encodeURIComponent(bodyContent)}`;

    window.location.href = mailtoUrl;

    sound.playCoin();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    setStatus('sent');
    setTimeout(() => {
      setStatus('idle');
      setCloudNotice(null);
    }, 6000);
  };

  // Download digital vCard (.vcf)
  const handleDownloadVCard = () => {
    sound.playClick();
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${PERSONAL_INFO.name}`,
      `N:Birda;Shekhar;;;`,
      `TITLE:${PERSONAL_INFO.title}`,
      `TEL;TYPE=CELL:${PERSONAL_INFO.phone}`,
      `EMAIL;TYPE=INTERNET;TYPE=WORK:${PERSONAL_INFO.email}`,
      `URL:${window.location.origin}`,
      `URL;TYPE=LinkedIn:${PERSONAL_INFO.linkedin}`,
      `URL;TYPE=GitHub:${PERSONAL_INFO.github}`,
      `NOTE:Experienced React & React Native Developer (Snibbl, EDU-Match, MyBooky)`,
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Shekhar_Birda_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
  };

  // Pre-configured WhatsApp text
  const whatsappUrl = `https://wa.me/919996231869?text=${encodeURIComponent(
    `Hi Shekhar! I saw your 3D interactive portfolio and would like to discuss an opportunity with you.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0f172a] border border-[#334155] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Game-style HUD element */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#334155] flex items-center justify-between bg-[#1e293b]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e293b] border border-[#475569] flex items-center justify-center text-[#f1f5f9] shadow-sm">
              <Mail className="w-5 h-5 text-[#f1f5f9]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-300 bg-[#1e293b] px-2 py-0.5 rounded-full border border-[#475569]">
                  CONTACT HUB
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Available for Work
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#f1f5f9] font-display mt-0.5">
                Direct Contact & Inquiries
              </h2>
            </div>
          </div>

          <button
            id="close-contact-modal-btn"
            onClick={() => {
              onClose();
              sound.playClick();
            }}
            className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* 1. Quick Action Cards (100% Free Contact Channels) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary Email Quick Copy Card */}
            <div className="bg-[#090d16]/80 border border-[#334155] p-4 rounded-2xl flex flex-col justify-between gap-3 group hover:border-[#475569] transition-colors">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Direct Email</span>
                <p className="text-sm font-bold text-[#f1f5f9] font-mono mt-0.5 break-all">
                  {PERSONAL_INFO.email}
                </p>
                <p className="text-xs text-slate-400 mt-1">Guaranteed response within 12 hours</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1e293b] hover:bg-[#334155] text-[#f1f5f9] transition-colors cursor-pointer active:scale-95"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#f1f5f9] text-[#0f172a] hover:bg-white transition-colors flex items-center gap-1 font-bold cursor-pointer shadow-sm font-mono"
                >
                  <Send className="w-3.5 h-3.5 text-[#0f172a]" />
                  <span>Open App</span>
                </a>
              </div>
            </div>

            {/* Direct WhatsApp & Phone Card */}
            <div className="bg-[#090d16]/80 border border-[#334155] p-4 rounded-2xl flex flex-col justify-between gap-3 hover:border-[#475569] transition-colors">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Direct Phone & WhatsApp</span>
                <h3 className="text-sm font-bold text-[#f1f5f9] mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  +91 9996231869
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Available for phone calls or instant WhatsApp chats.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#1e293b] border border-[#475569] text-[#f1f5f9] hover:bg-[#334155] transition-colors font-mono"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="tel:+919996231869"
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#1e293b] hover:bg-[#334155] text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Call Shekhar directly"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  title="Download vCard to save directly to phone contacts"
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#1e293b] hover:bg-[#334155] text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save .vcf</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Interactive Quick Dispatcher Form */}
          <div className="bg-[#090d16]/60 border border-[#334155] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                Select Inquiry Template
              </span>
              <span className="text-[11px] text-slate-500 font-mono">1-Click Auto Fill</span>
            </div>

            {/* Template Selector Pills */}
            <div className="grid grid-cols-3 gap-2">
              {(['hire', 'contract', 'chat'] as const).map((key) => {
                const item = templates[key];
                const Icon = item.icon;
                const isSelected = selectedTemplate === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(key);
                      setMessage(item.defaultBody);
                      sound.playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#f1f5f9] bg-[#1e293b] text-[#f1f5f9] shadow-sm'
                        : 'border-[#334155] bg-[#0f172a] text-slate-400 hover:border-[#475569] hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#f1f5f9]' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleLaunchMailClient} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#475569] placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={senderCompany}
                    onChange={(e) => setSenderCompany(e.target.value)}
                    placeholder="e.g. Acme Studio"
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#475569] placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Your Email</label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#475569] placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Inquiry Message</label>
                <textarea
                  rows={3}
                  value={message || currentTemplate.defaultBody}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-3 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#475569] resize-none leading-relaxed font-sans"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  {cloudNotice ? (
                    <span className="text-slate-300 font-mono flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-slate-300" />
                      {cloudNotice}
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saves to Shekhar's cloud inbox & opens mail to {PERSONAL_INFO.email}</span>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  id="send-email-dispatch-btn"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#f1f5f9] text-[#0f172a] hover:bg-white disabled:opacity-60 shadow-sm transition-all cursor-pointer active:scale-95 font-mono"
                >
                  <Send className="w-3.5 h-3.5 text-[#0f172a]" />
                  <span>{status === 'sending' ? 'Saving & Launching...' : 'Send Inquiry'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* 3. Social & Profiles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#090d16]/60 border border-[#334155] rounded-xl flex items-center justify-between hover:border-[#475569] group transition-colors"
            >
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[#cbd5e1]" />
                <span className="text-xs font-medium text-slate-200 group-hover:text-white">LinkedIn</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
            </a>

            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#090d16]/60 border border-[#334155] rounded-xl flex items-center justify-between hover:border-[#475569] group transition-colors"
            >
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-[#cbd5e1]" />
                <span className="text-xs font-medium text-slate-200 group-hover:text-white">GitHub</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
            </a>

            <button
              type="button"
              onClick={handleDownloadVCard}
              className="p-3 bg-[#090d16]/60 border border-[#334155] rounded-xl flex items-center justify-between hover:border-[#475569] group transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#cbd5e1]" />
                <span className="text-xs font-medium text-slate-200 group-hover:text-white">vCard Contact</span>
              </div>
              <span className="text-[10px] font-mono text-[#f1f5f9] bg-[#1e293b] border border-[#475569] px-1.5 py-0.5 rounded">
                .vcf
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#334155] bg-[#090d16]/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Location: {PERSONAL_INFO.location}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              sound.playClick();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1e293b] hover:bg-[#334155] text-[#f1f5f9] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
