import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Database, Trash2, CheckCircle2 } from 'lucide-react';

export default function LegalDialog({ open, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab when initialTab prop changes
  React.useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
              Legal & Data Privacy
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'terms'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-5 leading-relaxed">
          {activeTab === 'privacy' ? (
            <>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                  1. Information We Collect
                </h3>
                <p>
                  DSA Tracker collects minimal personal information necessary to deliver our spaced repetition service:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                  <li><strong>Account Data:</strong> Display name, username, and email address provided during registration.</li>
                  <li><strong>DSA Progress:</strong> Problems solved, revision schedules, custom tags, and daily activity counts.</li>
                  <li><strong>Security:</strong> Encrypted passwords (hashed using standard bcrypt algorithms). We never store plaintext passwords.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                  2. Purpose & Email Usage
                </h3>
                <p>
                  Your email is strictly utilized for account authentication, password recovery, and critical security notifications.
                </p>
                <div className="mt-2 p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl flex items-start gap-2.5 text-sky-900 dark:text-sky-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>
                    We will <strong>never</strong> sell, rent, monetize, or share your email address with third parties or advertisers. We do not send marketing spam.
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                  3. Data Storage & Security
                </h3>
                <p>
                  All data is stored securely in distributed, encrypted SQLite databases (Cloudflare D1) and processed via edge serverless runtimes. Data is encrypted both in transit (TLS/HTTPS) and at rest.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                  4. Your Rights (Right to be Forgotten)
                </h3>
                <p>
                  In compliance with modern data privacy frameworks (DPDP Act & GDPR), you have the right to access, rectify, or permanently delete your account and all associated problem data at any time from your profile settings.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By creating an account or using DSA Tracker, you agree to these Terms of Service. This is an open-source, non-commercial educational productivity tool designed to help developers track their algorithmic practice.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                  2. User Responsibilities
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Keep your credentials safe and do not share access with unauthorized individuals.</li>
                  <li>Do not use automated bots, scrapers, or abusive traffic to disrupt the edge infrastructure.</li>
                  <li>Provide a valid email address if you want to be able to authenticate or manage your account.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                  3. Service Availability
                </h3>
                <p>
                  DSA Tracker is provided "as is" and "as available". While we strive for 100% edge uptime using global CDN infrastructure, we are not liable for accidental data loss. We encourage periodically exporting problem sets if needed.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                  4. Termination
                </h3>
                <p>
                  You may stop using the platform and delete your account whenever you choose. We reserve the right to suspend accounts that engage in malicious traffic or security attacks.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Compliant with DPDP Act 2023 & GDPR principles
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
