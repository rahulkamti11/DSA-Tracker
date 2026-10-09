import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, User, Mail, ShieldAlert } from 'lucide-react';

export default function AuthDialog({
  open,
  onClose,
  handleAuth,
  authMode,
  setAuthMode,
  setAuthError,
  authError,
  syncProgress,
  setSyncProgress,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });

  // Reset form when dialog opens/closes or authMode changes
  useEffect(() => {
    if (open) {
      setFormData({ name: '', username: '', password: '' });
      setShowPassword(false);
    }
  }, [open, authMode]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (authMode === 'register') {
      if (!formData.name.trim()) {
        setAuthError('Display Name is required.');
        return;
      }
      if (formData.name.trim().length > 20) {
        setAuthError('Display Name cannot exceed 20 characters.');
        return;
      }
    }

    if (!formData.username.trim()) {
      setAuthError('Username is required.');
      return;
    }
    if (formData.username.trim().length > 20) {
      setAuthError('Username cannot exceed 20 characters.');
      return;
    }

    if (!formData.password) {
      setAuthError('Password is required.');
      return;
    }
    if (formData.password.length > 10) {
      setAuthError('Password cannot exceed 10 characters.');
      return;
    }
    if (formData.password.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }

    handleAuth(e);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 rounded-2xl w-full max-w-sm shadow-2xl space-y-5"
      >
        <div className="text-center">
          <h1 className="text-2xl font-black text-sky-500 dark:text-sky-400 font-mono tracking-tight mb-1">
            &lt;DSA/&gt;
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 tracking-wider uppercase font-semibold">
            Spaced Repetition Tracker
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 p-1 gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setAuthError('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-sky-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setAuthError('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-sky-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Error notification */}
        {authError && (
          <div className="bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 p-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-2">
            <ShieldAlert size={15} className="shrink-0" />
            <span className="font-medium">{authError}</span>
          </div>
        )}

        <div className="space-y-3.5">
          {/* Display Name (Register only) */}
          {authMode === 'register' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase font-semibold">
                  Display Name
                </label>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {formData.name.length}/20
                </span>
              </div>
              <input
                name="name"
                type="text"
                required
                maxLength={20}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Kamti"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-900 dark:text-slate-100 focus:border-sky-500 outline-none text-sm transition-all"
              />
            </div>
          )}

          {/* Username */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase font-semibold">
                Username
              </label>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {formData.username.length}/20
              </span>
            </div>
            <input
              name="username"
              type="text"
              required
              maxLength={20}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="e.g. rahul11"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-900 dark:text-slate-100 focus:border-sky-500 outline-none text-sm transition-all"
            />
          </div>

          {/* Password with Eye toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase font-semibold">
                Password
              </label>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {formData.password.length}/10
              </span>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                maxLength={10}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Max 10 characters..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 pr-10 rounded-xl text-slate-900 dark:text-slate-100 focus:border-sky-500 outline-none text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sync Guest Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="sync-check"
            checked={syncProgress}
            onChange={(e) => setSyncProgress(e.target.checked)}
            className="rounded border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-sky-500 focus:ring-sky-500 cursor-pointer"
          />
          <label htmlFor="sync-check" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            Sync current guest progress to my account
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] cursor-pointer text-xs"
          >
            {authMode === 'login' ? 'Login' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}
