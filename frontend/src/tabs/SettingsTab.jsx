import { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme.js';
import {
  Pencil,
  Check,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Shield,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { AVATAR_OPTIONS, AVATAR_CATEGORIES, UserAvatarBadge, getAvatarMeta } from '../utils/avatars.jsx';

export default function SettingsTab({ active, user, onUpdateProfile, onDeleteAccount, openAuthModal }) {
  const { themeMode, setTheme } = useTheme();

  const isGuest = !user || user.isGuest || user.username === 'guest';

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const [formData, setFormData] = useState({
    name: user?.name || (isGuest ? 'Guest User' : ''),
    username: user?.username || (isGuest ? 'guest' : ''),
    email: user?.email || '',
    password: '',
    gender: user?.gender || 'prefer_not_to_say',
    avatar: user?.avatar || 'ninja',
  });

  const [tooltipsEnabled, setTooltipsEnabled] = useState(true);
  const [avatarFilter, setAvatarFilter] = useState('all');

  // Sync formData when user prop changes
  useEffect(() => {
    setFormData({
      name: user?.name || (isGuest ? 'Guest User' : ''),
      username: user?.username || (isGuest ? 'guest' : ''),
      email: user?.email || '',
      password: '',
      gender: user?.gender || 'prefer_not_to_say',
      avatar: user?.avatar || 'ninja',
    });
    setIsEditing(false);
  }, [user, isGuest]);

  // Auto-dismiss status message after 4s
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  if (!active) return null;

  const handleStartEdit = () => {
    if (isGuest) return;
    setIsEditing(true);
    setStatusMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPassword(false);
    setFormData({
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      gender: user?.gender || 'prefer_not_to_say',
      avatar: user?.avatar || 'ninja',
    });
    setStatusMessage(null);
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isGuest) {
      setStatusMessage({ type: 'error', text: 'Guest profile cannot be modified. Please log in or register an account.' });
      return;
    }

    if (!formData.name.trim()) {
      setStatusMessage({ type: 'error', text: 'Display Name cannot be empty.' });
      return;
    }
    if (formData.name.trim().length > 20) {
      setStatusMessage({ type: 'error', text: 'Display Name cannot exceed 20 characters.' });
      return;
    }

    if (!formData.username.trim()) {
      setStatusMessage({ type: 'error', text: 'Username cannot be empty.' });
      return;
    }
    if (formData.username.trim().length > 20) {
      setStatusMessage({ type: 'error', text: 'Username cannot exceed 20 characters.' });
      return;
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
        return;
      }
      if (formData.email.trim().length > 50) {
        setStatusMessage({ type: 'error', text: 'Email cannot exceed 50 characters.' });
        return;
      }
    }

    if (formData.password.trim()) {
      if (formData.password.trim().length < 4 || formData.password.trim().length > 10) {
        setStatusMessage({ type: 'error', text: 'New Password must be between 4 and 10 characters.' });
        return;
      }
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      if (onUpdateProfile) {
        const res = await onUpdateProfile({
          name: formData.name.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password.trim() || undefined,
          gender: formData.gender,
          avatar: formData.avatar,
        });

        setStatusMessage({
          type: 'success',
          text: res?.message || 'Profile saved successfully!',
        });
        setIsEditing(false);
        setShowPassword(false);
        setFormData((prev) => ({ ...prev, password: '' }));
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedAvatarMeta = getAvatarMeta(formData.avatar);

  return (
    <div className="animate-in fade-in space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-sky-400">Settings & Profile</h2>
            {isGuest && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">
                Guest Session
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile details, developer avatar, dashboard visual themes, and interaction settings.
          </p>
        </div>

        {isGuest && openAuthModal && (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)] shrink-0 cursor-pointer"
          >
            <LogIn size={15} />
            <span>Create Account / Login</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Details Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm space-y-5 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <UserAvatarBadge avatarId={formData.avatar} size="md" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Profile Details</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isGuest
                    ? 'Guest account details (Read-only)'
                    : isEditing
                    ? 'Modify details and click Save Changes below'
                    : 'Current account credentials'}
                </p>
              </div>
            </div>

            {/* Top controls */}
            {!isGuest && !isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-500/40 transition-all cursor-pointer shadow-xs"
              >
                <Pencil size={13} />
                <span>Edit Profile</span>
              </button>
            )}

            {isGuest && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <Lock size={12} />
                <span>Read-Only</span>
              </span>
            )}

            {!isGuest && isEditing && (
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                <span>Editing</span>
              </span>
            )}
          </div>

          {/* Feedback alerts */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0" />
              ) : (
                <AlertCircle size={16} className="shrink-0" />
              )}
              <span className="font-medium">{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Developer Avatar Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold">
                  Developer Avatar
                </label>
                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1">
                  <Sparkles size={11} /> {selectedAvatarMeta.name}
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  {/* Category Filter Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                    {AVATAR_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setAvatarFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                          avatarFilter === cat.id
                            ? 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Avatars Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 max-h-56 overflow-y-auto custom-scrollbar p-1">
                    {AVATAR_OPTIONS.filter((a) => avatarFilter === 'all' || a.category === avatarFilter).map((av) => {
                      const isSelected = formData.avatar === av.id;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatar: av.id })}
                          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all border text-center cursor-pointer group ${
                            isSelected
                              ? 'bg-sky-500/10 border-sky-500 text-sky-400 shadow-sm scale-105 ring-2 ring-sky-500/30'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:scale-102'
                          }`}
                          title={`${av.name} (${av.category})`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900 mb-1 shrink-0">
                            <img src={av.url} alt={av.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <span className="text-[10px] font-bold line-clamp-1 w-full truncate">{av.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                  <UserAvatarBadge avatarId={formData.avatar} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedAvatarMeta.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{selectedAvatarMeta.category}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Display Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold">
                  Display Name
                </label>
                {isEditing && (
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-semibold">
                    {formData.name.length}/20
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditing}
                  maxLength={20}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Kamti"
                  className={`w-full p-2.5 rounded-xl text-sm transition-all outline-none ${
                    isEditing
                      ? 'bg-slate-50 dark:bg-slate-950 border-2 border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'bg-slate-100/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                Your visible name shown on your dashboard greeting and cards.
              </p>
            </div>

            {/* Username / Account ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold">
                  Username / Account ID
                </label>
                {isEditing ? (
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-semibold">
                    {formData.username.length}/20
                  </span>
                ) : isGuest ? (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Guest Default</span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditing}
                  maxLength={20}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. alex_dev"
                  className={`w-full p-2.5 rounded-xl text-sm transition-all outline-none ${
                    isEditing
                      ? 'bg-slate-50 dark:bg-slate-950 border-2 border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'bg-slate-100/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                  }`}
                />
                {!isEditing && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={14} />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                {isGuest
                  ? 'Shared guest account username is fixed. Register a personal account to customize your handle.'
                  : 'Used for logging in to your account.'}
              </p>
            </div>

            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold">
                  Email Address
                </label>
                {isEditing ? (
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-semibold">
                    {formData.email.length}/50
                  </span>
                ) : isGuest ? (
                  <span className="text-[10px] text-slate-400 font-mono">None (Guest)</span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Shield size={10} /> Private
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="email"
                  disabled={!isEditing}
                  maxLength={50}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={isGuest ? 'No email linked in guest mode' : 'e.g. alex@example.com'}
                  className={`w-full p-2.5 rounded-xl text-sm transition-all outline-none ${
                    isEditing
                      ? 'bg-slate-50 dark:bg-slate-950 border-2 border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'bg-slate-100/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                Used for account recovery and logging in. Never shared or sold.
              </p>
            </div>

            {/* Gender Field (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold">
                  Gender (Optional)
                </label>
                <span className="text-[10px] font-mono text-slate-400">Not shared publicly</span>
              </div>
              {isEditing ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: 'prefer_not_to_say', label: '🔒 Prefer not to say' },
                    { value: 'male', label: '👨 Male' },
                    { value: 'female', label: '👩 Female' },
                    { value: 'other', label: '🌈 Other' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: opt.value })}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        formData.gender === opt.value
                          ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 shadow-xs ring-1 ring-sky-500/40'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-2.5 rounded-xl text-sm bg-slate-100/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  {formData.gender === 'male' && '👨 Male'}
                  {formData.gender === 'female' && '👩 Female'}
                  {formData.gender === 'other' && '🌈 Other'}
                  {(!formData.gender || formData.gender === 'prefer_not_to_say') && '🔒 Prefer not to say'}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase block font-semibold">
                  {isEditing ? 'New Password' : 'Account Password'}
                </label>
                {isEditing ? (
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-semibold">
                    {formData.password.length}/10
                  </span>
                ) : isGuest ? (
                  <span className="text-[10px] text-slate-400">N/A (Guest)</span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Shield size={10} /> Secured
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  disabled={!isEditing}
                  maxLength={10}
                  value={isEditing ? formData.password : isGuest ? '' : '••••••••••••'}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={
                    isGuest
                      ? 'Create an account to protect with a password'
                      : isEditing
                      ? 'Type new password (max 10 chars, leave blank to keep current)'
                      : '••••••••••••'
                  }
                  className={`w-full p-2.5 pr-10 rounded-xl text-sm transition-all outline-none ${
                    isEditing
                      ? 'bg-slate-50 dark:bg-slate-950 border-2 border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'bg-slate-100/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                  }`}
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                )}
                {!isEditing && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={14} />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                {isGuest
                  ? 'Guest sessions do not use a password.'
                  : isEditing
                  ? 'Only enter a new password if you want to change it. Minimum 4, maximum 10 characters.'
                  : 'Encrypted and salted with bcrypt.'}
              </p>
            </div>

            {/* Cancel and Save Changes buttons show ONLY at the bottom of the form when editing */}
            {isEditing && (
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-sky-500 hover:bg-sky-400 rounded-xl transition-all shadow-md shadow-sky-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Preferences & System Settings Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm space-y-5 animate-in slide-in-from-bottom-2 duration-300 delay-75">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Appearance & Theme
            </h3>

            {/* Theme Mode Picker */}
            <div>
              <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-2 block font-semibold">
                Theme Mode
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 gap-1">
                {[
                  { id: 'dark', label: 'Dark' },
                  { id: 'light', label: 'Light' },
                  { id: 'system', label: 'System' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer ${
                      themeMode === t.id
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700/80 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-2">
                Choose between high-contrast Dark theme, clean Light theme, or sync with your operating system.
              </p>
            </div>

            {/* Hover Assistance */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-2 block font-semibold">
                Interaction Assistance
              </label>
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
                <div>
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-medium block">
                    Custom Tooltip Hovers
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-500">
                    Displays helpful context pills over icons and table cells
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTooltipsEnabled(!tooltipsEnabled)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-200 shrink-0 cursor-pointer ${
                    tooltipsEnabled ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-800'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      tooltipsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Tier & GDPR Controls */}
          {isGuest && (
            <div className="bg-sky-500/5 border border-sky-500/20 p-5 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
                <Shield size={14} />
                <span>Guest Mode Notice</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You are currently exploring in <strong>Guest Mode</strong>. Profile customization and avatar selection are preserved locally, but registering an account enables cloud sync.
              </p>
              {openAuthModal && (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="w-full py-2 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Register Free Account to Enable Cloud Sync
                </button>
              )}
            </div>
          )}

          {!isGuest && (
            <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Shield size={14} />
                <span>Data Privacy & Account Erasure</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Under the DPDP Act and GDPR ("Right to be Forgotten"), you can permanently erase your account, email address, problem sets, and revision records from our edge database.
              </p>
              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  if (window.confirm('Are you ABSOLUTELY sure? This will permanently delete your account, collections, problem sets, and activity heatmap. This cannot be undone.')) {
                    try {
                      setDeleting(true);
                      await onDeleteAccount();
                    } catch (err) {
                      alert(err.message || 'Failed to delete account');
                      setDeleting(false);
                    }
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-all text-center cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting Data...' : 'Permanently Delete Account & Data'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
