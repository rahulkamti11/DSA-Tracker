import { useState } from 'react';
import {
  MessageSquarePlus,
  Mail,
  ShieldCheck,
  Scale,
  Info,
  Send,
  Star,
  CheckCircle2,
  ExternalLink,
  Lock,
  Database,
  Cpu,
  Heart,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.js';

function GithubIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function MoreTab({ active, user }) {
  const [activeSection, setActiveSection] = useState('feedback');

  // Feedback form state
  const [feedbackType, setFeedbackType] = useState('feature');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(user?.username && !user.isGuest ? `${user.username}@user.com` : '');
  const [submitted, setSubmitted] = useState(false);

  if (!active) return null;

  const sections = [
    { id: 'feedback', label: 'Feedback', icon: MessageSquarePlus },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
    { id: 'legal', label: 'Legal', icon: Scale },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    triggerHaptic(15);
    const feedbackEntry = {
      id: Date.now(),
      type: feedbackType,
      rating,
      message: message.trim(),
      email: email.trim() || 'anonymous',
      date: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('dsa_feedback_history') || '[]');
      existing.unshift(feedbackEntry);
      localStorage.setItem('dsa_feedback_history', JSON.stringify(existing.slice(0, 20)));
    } catch {
      // Ignore storage errors
    }

    setSubmitted(true);
    setTimeout(() => {
      setMessage('');
      setSubmitted(false);
    }, 4500);
  };

  return (
    <div className="animate-in fade-in space-y-4 sm:space-y-6 max-w-5xl pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-sky-400">
              More Information & Resources
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Privacy policy, legal notices, contact info, and submit your feedback to help improve DSA Tracker.
          </p>
        </div>
      </div>

      {/* Segmented Section Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200 dark:border-slate-800">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setActiveSection(section.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 select-none ${
                isActive
                  ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon size={16} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: FEEDBACK */}
      {activeSection === 'feedback' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                <MessageSquarePlus size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Send Feedback & Suggestions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">We continuously refine DSA Tracker based on your user experience.</p>
              </div>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3 animate-in zoom-in-95 duration-200">
                <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-emerald-400">Thank You For Your Feedback!</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Your suggestions help shape future releases. Your thoughts have been logged locally and sent to our team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Feedback Type */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Feedback Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'feature', label: 'Feature Request' },
                      { id: 'bug', label: 'Bug Report' },
                      { id: 'ui', label: 'UI / UX Polish' },
                      { id: 'general', label: 'General Praise' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFeedbackType(type.id)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                          feedbackType === type.id
                            ? 'bg-sky-500/15 border-sky-500/50 text-sky-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Rate Your Experience
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          triggerHaptic(10);
                          setRating(star);
                        }}
                        className="p-1 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={`${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 ml-2">
                      {rating === 5 ? 'Exceptional' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : 'Needs Work'}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Your Message / Suggestions
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you love or what we could improve..."
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>

                {/* Optional Email */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Email Address (Optional, if you would like a reply)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full sm:w-80 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 active:scale-95 transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] cursor-pointer"
                  >
                    <Send size={15} />
                    <span>Submit Feedback</span>
                  </button>

                  <a
                    href={`mailto:rahulkamti11@gmail.com?subject=DSA%20Tracker%20Feedback%20(${feedbackType})&body=${encodeURIComponent(message)}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/60"
                  >
                    <Mail size={15} />
                    <span>Send via Email Client</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: CONTACT */}
      {activeSection === 'contact' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Get in Touch</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Direct developer inquiries & collaboration</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-0.5">Primary Support</span>
                  <a
                    href="mailto:rahulkamti11@gmail.com"
                    className="text-sky-500 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1.5"
                  >
                    <span>rahulkamti11@gmail.com</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-0.5">Author & Maintainer</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">Rahul Kamti</span>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-0.5">Project Repository</span>
                  <a
                    href="https://github.com/rahulkamti11/DSA-Tracker"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-500 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1.5"
                  >
                    <GithubIcon size={14} />
                    <span>github.com/rahulkamti11/DSA-Tracker</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Community & Issues</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Open-source contributions and issue tracking</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Found a bug or want to request an algorithmic collection like Blind 75, NeetCode 150, or Striver SDE Sheet?
                Feel free to open an issue or pull request on GitHub!
              </p>

              <a
                href="https://github.com/rahulkamti11/DSA-Tracker/issues"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <GithubIcon size={14} />
                <span>Open GitHub Issue</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PRIVACY POLICY */}
      {activeSection === 'privacy' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Privacy Policy</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your data belongs to you. Zero tracking, zero telemetry selling.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <Database size={16} />
                <span>Local-First & Client Storage</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                DSA Tracker stores your problem lists, revision history, and custom notes in your browser’s local storage. In Guest Mode, no data ever leaves your device.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Lock size={16} />
                <span>No Third-Party Trackers</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We do not include third-party advertising SDKs, tracking pixels, or user behavior profiling. The application runs clean and focused purely on DSA mastery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <FileText size={16} />
                <span>Complete Data Portability</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You can export your complete problem log anytime in JSON or CSV format directly from the top bar with one click.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <ShieldCheck size={16} />
                <span>Account Control</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Registered users have full control over their credentials and can update their display profile, passwords, or purge their data whenever desired.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: LEGAL & TERMS */}
      {activeSection === 'legal' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Scale size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Legal Notices & Terms</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Open-source licensing and fair use disclosures</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-1">Open Source License (MIT)</h4>
              <p className="text-xs">
                Copyright (c) 2026 Rahul Kamti. Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files to deal in the Software without restriction, including without limitation
                the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-1">Third-Party Platform Disclaimers</h4>
              <p className="text-xs">
                DSA Tracker is an independent open-source productivity companion. Problem titles, platform names, and links to
                LeetCode, Codeforces, HackerRank, GeeksforGeeks, and NeetCode are trademarks of their respective owners. DSA Tracker
                is not affiliated with or endorsed by any of these platforms.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-1">Disclaimer of Warranties</h4>
              <p className="text-xs">
                The software is provided "as is", without warranty of any kind, express or implied. In no event shall the authors
                or copyright holders be liable for any claim, damages, or other liability arising from the use of this software.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ABOUT */}
      {activeSection === 'about' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              <Cpu size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">About DSA Tracker</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Version 1.2.0 · Built for algorithmic engineers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xl font-black text-sky-400 font-mono">SRS</span>
              <p className="text-xs font-semibold text-slate-300 mt-1">Spaced Repetition</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Automated interval reviews</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xl font-black text-emerald-400 font-mono">100%</span>
              <p className="text-xs font-semibold text-slate-300 mt-1">Local & Private</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Full offline capability</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xl font-black text-purple-400 font-mono">PWA</span>
              <p className="text-xs font-semibold text-slate-300 mt-1">Mobile Optimized</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Installable on Android & iOS</p>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <span>Crafted with</span>
            <Heart size={13} className="text-rose-500 fill-rose-500" />
            <span>by Rahul Kamti</span>
          </div>
        </div>
      )}
    </div>
  );
}
