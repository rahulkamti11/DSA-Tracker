import { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  Bug,
  ShieldCheck,
  Scale,
  HelpCircle,
  Info,
  Clock,
  Lock,
  Database,
  Cpu,
  Heart,
  FileText,
  Sparkles,
  BookOpen,
  Layers,
  Activity,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.js';

export default function MoreTab({ active, user, initialSection = 'feedback' }) {
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  if (!active) return null;

  const sections = [
    { id: 'feedback', label: 'Feedback', icon: MessageSquarePlus },
    { id: 'report', label: 'Report', icon: Bug },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms of Service', icon: Scale },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="animate-in fade-in space-y-4 sm:space-y-6 max-w-5xl pb-12">
      {/* Segmented Section Navigation directly at the top */}
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
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 select-none cursor-pointer ${
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

      {/* SECTION 1: FEEDBACK (Coming Soon) */}
      {activeSection === 'feedback' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 mx-auto flex items-center justify-center font-bold">
            <MessageSquarePlus size={32} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Clock size={13} />
            <span>Coming Soon</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            User Feedback & Feature Requests
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            We are building an interactive voting board where you can propose new algorithmic collections, suggest SRS interval enhancements, and upvote community feature requests.
          </p>
        </div>
      )}

      {/* SECTION 2: REPORT (Coming Soon) */}
      {activeSection === 'report' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center font-bold">
            <Bug size={32} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <Clock size={13} />
            <span>Coming Soon</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            Direct Bug & Issue Reporter
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            An automated crash diagnostics and edge log submitter is currently in development. Direct in-app bug filing with screenshot capture will be available in an upcoming update.
          </p>
        </div>
      )}

      {/* SECTION 3: PRIVACY POLICY */}
      {activeSection === 'privacy' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Privacy Policy</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent data practices compliant with DPDP Act 2023 & GDPR standards.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Database size={16} className="text-sky-500" />
                1. Data We Collect
              </h4>
              <p>
                DSA Tracker is designed with strict data minimization principles. We only collect the bare minimum information necessary to maintain your spaced repetition schedule:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400">
                <li><strong>Account Credentials:</strong> Display name, unique username, and email address provided during registration.</li>
                <li><strong>Problem & Revision Progress:</strong> Problem titles, tags, revision intervals, notes, codes, and daily heatmap activity counters.</li>
                <li><strong>Cryptographic Hashes:</strong> Passwords are one-way hashed with bcrypt. We never store or transmit plaintext passwords.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock size={16} className="text-emerald-500" />
                2. Strict Email & Zero-Tracking Policy
              </h4>
              <p>
                Your email is used <strong>solely</strong> for account authentication, identity verification, and optional password recovery.
              </p>
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl flex items-center gap-2 text-sky-900 dark:text-sky-200 text-xs">
                <CheckCircle2 size={16} className="text-sky-500 shrink-0" />
                <span>
                  We <strong>never</strong> sell, monetize, or disclose personal data to advertising networks or third-party brokers. No spam, ever.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu size={16} className="text-purple-500" />
                3. Edge Storage & Security
              </h4>
              <p>
                All account records are hosted on Cloudflare's serverless edge infrastructure (Cloudflare D1 SQLite database). Data is encrypted both in transit (TLS 1.3 / HTTPS) and at rest.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText size={16} className="text-amber-500" />
                4. Your Rights & Permanent Account Deletion
              </h4>
              <p>
                Under the DPDP Act and GDPR ("Right to be Forgotten"), you retain absolute ownership of your data. You can export your problems as JSON/CSV or permanently wipe your account and all associated records directly from Settings at any time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: TERMS OF SERVICE */}
      {activeSection === 'terms' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Scale size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Terms of Service</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guidelines and acceptable use policies for DSA Tracker.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">1. Acceptance of Terms</h4>
              <p className="text-slate-500 dark:text-slate-400">
                By accessing or registering an account on DSA Tracker, you acknowledge and agree to comply with these terms. DSA Tracker is a web application and personal productivity tool created to assist developers and students in algorithmic interview preparation and spaced repetition practice.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">2. Fair Use & Prohibited Conduct</h4>
              <p className="text-slate-500 dark:text-slate-400">
                Users agree not to disrupt the serverless infrastructure, abuse rate limits, attempt unauthorized access to other accounts, reverse-engineer proprietary application logic, or use automated scripts to spam registration.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">3. Third-Party Trademarks</h4>
              <p className="text-slate-500 dark:text-slate-400">
                References to platforms like LeetCode, HackerRank, Codeforces, GeeksforGeeks, and NeetCode are trademarks of their respective owners. DSA Tracker is independent and not endorsed by or affiliated with these platforms.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">4. Disclaimer of Warranty</h4>
              <p className="text-slate-500 dark:text-slate-400">
                The software is provided "as is", without warranty of any kind. While high availability is maintained via Cloudflare Workers and D1, users are encouraged to maintain local JSON/CSV backups for critical notes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: HELP & FAQ */}
      {activeSection === 'help' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
              <HelpCircle size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Help & Quick Reference</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Frequently asked questions and Spaced Repetition workflow guide.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen size={16} className="text-sky-500" />
                How does Spaced Repetition (SRS) work in this app?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                When you solve a problem, DSA Tracker automatically schedules the first review for <strong>tomorrow (+1 day)</strong>. When you review it and mark it solved again, the interval progressively multiplies (1d $\rightarrow$ 3d $\rightarrow$ 7d $\rightarrow$ 14d $\rightarrow$ 30d). If you struggle, reset the interval to keep it fresh in memory.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Layers size={16} className="text-emerald-500" />
                What happens to my Guest Mode data when I register?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                When you register or log in, check the <strong>"Sync current guest progress to my account"</strong> checkbox in the Auth dialog. All your solved problems, customized notes, and activity heatmap will automatically transfer to your new cloud account.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity size={16} className="text-amber-500" />
                Can I use DSA Tracker offline?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes! DSA Tracker is built with an offline-first architecture. If your internet connection drops, you can continue reviewing and solving problems. Changes sync as soon as you are reconnected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: ABOUT (Descriptive & Professional) */}
      {activeSection === 'about' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              <Cpu size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">About DSA Tracker</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Next-Generation Spaced Repetition System for Coding Interviews & Algorithmic Mastery
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              <strong>DSA Tracker</strong> was engineered to solve the most prevalent problem software engineers face when preparing for technical interviews: <em>forgetting solved algorithmic concepts after 2–3 weeks</em>.
            </p>
            <p>
              By leveraging the scientific <strong>Hermann Ebbinghaus Forgetting Curve</strong>, DSA Tracker schedules problem reviews at the precise moment cognitive recall begins to fade, locking patterns (Dynamic Programming, Sliding Window, Monotonic Stacks, Union-Find, Graphs) into permanent long-term memory.
            </p>
          </div>

          {/* Key Architectural Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-sky-500 dark:text-sky-400 block mb-1">
                EDGE RUNTIME
              </span>
              <p className="text-slate-900 dark:text-slate-200 font-bold text-sm">Cloudflare Workers</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Sub-10ms global edge API response times powered by Hono.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-emerald-500 dark:text-emerald-400 block mb-1">
                EDGE DATABASE
              </span>
              <p className="text-slate-900 dark:text-slate-200 font-bold text-sm">Cloudflare D1</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Distributed serverless SQLite database with instant query execution.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-purple-500 dark:text-purple-400 block mb-1">
                FRONTEND
              </span>
              <p className="text-slate-900 dark:text-slate-200 font-bold text-sm">React 19 + Tailwind</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Optimistic updates, fluid animations, dynamic animated orbital favicon.
              </p>
            </div>
          </div>

          {/* Core Feature Matrix */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Core Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div>• <strong>Intelligent SRS Queue:</strong> Due-today revision queue with overdue detection.</div>
              <div>• <strong>Activity Heatmap:</strong> Year-round continuous practice visualization.</div>
              <div>• <strong>Curated Collections:</strong> Blind 75, NeetCode 150, Top Interview 150.</div>
              <div>• <strong>Zero Ads & Pure Privacy:</strong> DPDP & GDPR compliant data architecture.</div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>Architected & Crafted with</span>
              <Heart size={13} className="text-rose-500 fill-rose-500" />
              <span>by <strong>Rahul Kamti</strong></span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              DSA Tracker • All Rights Reserved
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
