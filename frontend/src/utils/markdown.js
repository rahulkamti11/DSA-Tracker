export const parseMd = (text) => {
  if (!text) return '';

  const escaped = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return escaped
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-lg overflow-x-auto my-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 leading-relaxed">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-200 dark:border-slate-700/50">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^## (.*)$/gm, '<h2 class="text-base font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2">$1</h2>')
    .replace(/^- (.*)$/gm, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300">$1</li>')
    .replace(/\n/g, '<br/>');
};
