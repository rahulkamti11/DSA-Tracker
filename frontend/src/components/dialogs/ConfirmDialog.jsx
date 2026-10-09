export default function ConfirmDialog({ confirmModal, setConfirmModal }) {
  if (!confirmModal.open) return null;

  const isDestructive = confirmModal.isDestructive || confirmModal.confirmColor === 'danger';
  const confirmText = confirmModal.confirmText || 'Confirm';

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{confirmModal.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{confirmModal.message}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setConfirmModal({ open: false, title: '', message: '', onConfirm: null })}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirmModal.onConfirm) confirmModal.onConfirm();
              setConfirmModal({ open: false, title: '', message: '', onConfirm: null });
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDestructive
                ? 'text-white bg-rose-500 hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'text-slate-950 bg-sky-500 hover:bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
