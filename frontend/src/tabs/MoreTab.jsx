import { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  Bug,
  ShieldCheck,
  Scale,
  HelpCircle,
  Info,
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
  Star,
  Send,
  AlertCircle,
  LogIn,
  Monitor,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.js';
import { submitFeedback, submitBugReport, getClientDeviceInfo } from '../services/feedback.service.js';

export default function MoreTab({ active, user, initialSection = 'feedback', openAuthModal }) {
  const [activeSection, setActiveSection] = useState(initialSection);

  const isGuest = !user || user.isGuest || user.username === 'guest';

  // ----------------------------------------------------
  // Feedback Form State (Registered Only)
  // ----------------------------------------------------
  const [fbReason, setFbReason] = useState('Feature Suggestion');
  const [fbRating, setFbRating] = useState(5);
  const [fbHoverRating, setFbHoverRating] = useState(0);
  const [fbMessage, setFbMessage] = useState('');
  const [fbEmail, setFbEmail] = useState('');
  const [fbLoading, setFbLoading] = useState(false);
  const [fbSuccess, setFbSuccess] = useState(false);
  const [fbError, setFbError] = useState('');

  // ----------------------------------------------------
  // Bug Report Form State (Anyone, Compulsory Email)
  // ----------------------------------------------------
  const [repArea, setRepArea] = useState('Review Queue');
  const [repMessage, setRepMessage] = useState('');
  const [repEmail, setRepEmail] = useState('');
  const [repLoading, setRepLoading] = useState(false);
  const [repSuccess, setRepSuccess] = useState(false);
  const [repError, setRepError] = useState('');

  // Sync initialSection when passed as prop
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Pre-fill user emails when user loads
  useEffect(() => {
    if (user && !isGuest && user.email) {
      setFbEmail(user.email);
      setRepEmail(user.email);
    }
  }, [user, isGuest]);

  if (!active) return null;

  const sections = [
    { id: 'feedback', label: 'Feedback', icon: MessageSquarePlus },
    { id: 'report', label: 'Report', icon: Bug },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms of Service', icon: Scale },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
  ];

  // Handle Feedback Submit
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFbError('');

    if (!fbMessage.trim()) {
      setFbError('Please enter your feedback message.');
      return;
    }
    if (!fbEmail.trim()) {
      setFbError('Email address is required.');
      return;
    }

    try {
      setFbLoading(true);
      triggerHaptic(15);
      await submitFeedback({
        token: user?.token,
        reason: fbReason,
        rating: fbRating,
        message: fbMessage.trim(),
        email: fbEmail.trim(),
      });
      setFbSuccess(true);
      setFbMessage('');
    } catch (err) {
      setFbError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setFbLoading(false);
    }
  };

  // Handle Bug Report Submit
  const handleBugReportSubmit = async (e) => {
    e.preventDefault();
    setRepError('');

    if (!repMessage.trim()) {
      setRepError('Please describe the issue you encountered.');
      return;
    }
    if (!repEmail.trim()) {
      setRepError('Email address is compulsory so we can inform you when resolved.');
      return;
    }

    try {
      setRepLoading(true);
      triggerHaptic(15);
      const deviceInfo = getClientDeviceInfo();
      await submitBugReport({
        token: user?.token || null,
        area: repArea,
        message: repMessage.trim(),
        email: repEmail.trim(),
        deviceInfo,
      });
      setRepSuccess(true);
      setRepMessage('');
    } catch (err) {
      setRepError(err.message || 'Failed to submit bug report. Please try again.');
    } finally {
      setRepLoading(false);
    }
  };

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

      {/* SECTION 1: FEEDBACK (Registered Users Only) */}
      {activeSection === 'feedback' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {isGuest ? (
            /* Guest Warning & Login prompt */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-500 mx-auto flex items-center justify-center font-bold">
                <Lock size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                Registered Users Only
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Feedback submission is available exclusively to registered members so we can follow up with feature updates directly to your account.
              </p>
              {openAuthModal && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/20 cursor-pointer"
                  >
                    <LogIn size={15} />
                    <span>Login or Register Free Account</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Registered User Feedback Form */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                  <MessageSquarePlus size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    Send Feedback & Suggestions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Help us refine DSA Tracker for your daily interview preparation.
                  </p>
                </div>
              </div>

              {fbSuccess ? (
                <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 size={42} className="text-emerald-500 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    Thank You For Your Feedback!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Your suggestion has been logged directly in our database. We review every submission carefully.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFbSuccess(false)}
                    className="mt-2 px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-all cursor-pointer"
                  >
                    Submit Another Feedback
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  {fbError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{fbError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Reason for Feedback Dropdown */}
                    <div>
                      <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold mb-1.5">
                        Reason for Feedback
                      </label>
                      <select
                        value={fbReason}
                        onChange={(e) => setFbReason(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-900 dark:text-slate-100 text-xs sm:text-sm outline-none focus:border-sky-500 transition-all cursor-pointer"
                      >
                        <option value="Feature Suggestion">Feature Suggestion</option>
                        <option value="General Experience">General Experience</option>
                        <option value="UI / Design Improvement">UI / Design Improvement</option>
                        <option value="Content / Problem Sets">Content / Problem Sets</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Email Address (Auto-fetched + Editable) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold">
                          Contact Email
                        </label>
                        <span className="text-[10px] text-sky-500 font-mono">Auto-filled & Editable</span>
                      </div>
                      <input
                        type="email"
                        required
                        maxLength={60}
                        value={fbEmail}
                        onChange={(e) => setFbEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-900 dark:text-slate-100 text-xs sm:text-sm outline-none focus:border-sky-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold mb-1.5">
                      Your Experience Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = (fbHoverRating || fbRating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setFbHoverRating(star)}
                            onMouseLeave={() => setFbHoverRating(0)}
                            onClick={() => setFbRating(star)}
                            className="p-1 rounded-lg transition-transform hover:scale-110 cursor-pointer"
                          >
                            <Star
                              size={22}
                              className={
                                filled
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                                  : 'text-slate-300 dark:text-slate-700'
                              }
                            />
                          </button>
                        );
                      })}
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-mono">
                        {fbRating === 5
                          ? 'Exceptional ★★★★★'
                          : fbRating === 4
                          ? 'Very Good ★★★★☆'
                          : fbRating === 3
                          ? 'Good ★★★☆☆'
                          : fbRating === 2
                          ? 'Fair ★★☆☆☆'
                          : 'Needs Improvement ★☆☆☆☆'}
                      </span>
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold">
                        Your Thoughts / Ideas
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        {fbMessage.length}/1000
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      required
                      maxLength={1000}
                      value={fbMessage}
                      onChange={(e) => setFbMessage(e.target.value)}
                      placeholder="Tell us what you like or what new features would accelerate your DSA preparation..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-slate-900 dark:text-slate-100 text-xs sm:text-sm outline-none focus:border-sky-500 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Rate limited to 3 submissions/day to prevent spam.
                    </span>
                    <button
                      type="submit"
                      disabled={fbLoading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/20 cursor-pointer disabled:opacity-50"
                    >
                      {fbLoading ? (
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      <span>{fbLoading ? 'Submitting...' : 'Submit Feedback'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: REPORT (Anyone Can Report, Compulsory Email) */}
      {activeSection === 'report' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
              <Bug size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Report an Issue or Glitch
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Encountered unexpected behavior or a UI bug? Let us know so we can fix it quickly.
              </p>
            </div>
          </div>

          {repSuccess ? (
            <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 size={42} className="text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                Bug Report Submitted!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Thank you for helping us maintain DSA Tracker. We will inspect the issue and notify you via email when resolved.
              </p>
              <button
                type="button"
                onClick={() => setRepSuccess(false)}
                className="mt-2 px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleBugReportSubmit} className="space-y-4">
              {repError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{repError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Where is the Issue? (Area Dropdown) */}
                <div>
                  <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold mb-1.5">
                    Affected Screen / Feature
                  </label>
                  <select
                    value={repArea}
                    onChange={(e) => setRepArea(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-900 dark:text-slate-100 text-xs sm:text-sm outline-none focus:border-rose-500 transition-all cursor-pointer"
                  >
                    <option value="Dashboard / Heatmap">Dashboard / Heatmap</option>
                    <option value="Problems Log">Problems Log</option>
                    <option value="Review Queue">Review Queue</option>
                    <option value="Collections">Collections</option>
                    <option value="Account / Sync">Account / Sync</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Email Address (Compulsory) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold">
                      Your Email (Compulsory)
                    </label>
                    <span className="text-[10px] text-rose-500 font-mono">* Required for reply</span>
                  </div>
                  <input
                    type="email"
                    required
                    maxLength={60}
                    value={repEmail}
                    onChange={(e) => setRepEmail(e.target.value)}
                    placeholder="e.g. your.email@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-900 dark:text-slate-100 text-xs sm:text-sm outline-none focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold">
                    Describe the Problem
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {repMessage.length}/1500
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  maxLength={1500}
                  value={repMessage}
                  onChange={(e) => setRepMessage(e.target.value)}
                  placeholder="What happened? (e.g. Marked problem as solved but review counter did not increment...)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-slate-900 dark:text-slate-100 text-xs sm:text-sm outline-none focus:border-rose-500 transition-all resize-none"
                />
              </div>

              {/* Device Context Auto-Capture Note */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Monitor size={14} className="text-slate-400 shrink-0" />
                  <span>
                    Auto-attaching device info for faster debugging: <strong>{getClientDeviceInfo()}</strong>
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400">Zero permissions required</span>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Rate limited to 3 reports/hour.
                </span>
                <button
                  type="submit"
                  disabled={repLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-md shadow-rose-500/20 cursor-pointer disabled:opacity-50"
                >
                  {repLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>{repLoading ? 'Submitting...' : 'Submit Report'}</span>
                </button>
              </div>
            </form>
          )}
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
