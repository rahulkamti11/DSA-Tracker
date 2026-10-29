/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import { User } from 'lucide-react';

export const AVATAR_CATEGORIES = [
  { id: 'all', label: 'All Styles' },
  { id: 'bottts', label: 'Bottts (Robots)' },
  { id: 'notionists', label: 'Notionists (Notion Devs)' },
  { id: 'pixel-art', label: 'Pixel Art (8-Bit)' },
  { id: 'open-peeps', label: 'Open Peeps (Doodles)' },
  { id: 'shapes', label: 'Shapes (Geometric)' },
  { id: 'fun-emoji', label: 'Fun Emoji' },
];

export const AVATAR_OPTIONS = [
  // bottts (by Pablo Stanley)
  {
    id: 'ninja',
    name: 'Code Ninja',
    category: 'bottts',
    color: 'from-indigo-500 to-indigo-700',
    url: 'https://api.dicebear.com/9.x/bottts/svg?seed=CodeNinja&backgroundColor=6366f1',
  },
  {
    id: 'wizard',
    name: 'Terminal Wizard',
    category: 'bottts',
    color: 'from-amber-500 to-amber-700',
    url: 'https://api.dicebear.com/9.x/bottts/svg?seed=TerminalWizard&backgroundColor=f59e0b',
  },
  {
    id: 'hacker',
    name: 'Cyber Hacker',
    category: 'bottts',
    color: 'from-emerald-500 to-emerald-700',
    url: 'https://api.dicebear.com/9.x/bottts/svg?seed=CyberHacker&backgroundColor=10b981',
  },
  {
    id: 'ace',
    name: 'Algorithm Ace',
    category: 'bottts',
    color: 'from-sky-500 to-sky-700',
    url: 'https://api.dicebear.com/9.x/bottts/svg?seed=AlgorithmAce&backgroundColor=0ea5e9',
  },
  {
    id: 'hunter',
    name: 'Bug Hunter',
    category: 'bottts',
    color: 'from-rose-500 to-rose-700',
    url: 'https://api.dicebear.com/9.x/bottts/svg?seed=BugHunter&backgroundColor=f43f5e',
  },
  {
    id: 'pixel',
    name: 'Pixel Hero',
    category: 'bottts',
    color: 'from-fuchsia-500 to-fuchsia-700',
    url: 'https://api.dicebear.com/9.x/bottts/svg?seed=PixelHero&backgroundColor=d946ef',
  },

  // notionists (by Zoish - CC0 1.0)
  {
    id: 'notion-coder',
    name: 'Notion Coder',
    category: 'notionists',
    color: 'from-slate-600 to-slate-800',
    url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Coder&backgroundColor=e2e8f0',
  },
  {
    id: 'notion-alex',
    name: 'Notion Alex',
    category: 'notionists',
    color: 'from-orange-500 to-amber-600',
    url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Alex&backgroundColor=fed7aa',
  },
  {
    id: 'notion-sam',
    name: 'Notion Sam',
    category: 'notionists',
    color: 'from-emerald-500 to-teal-600',
    url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Sam&backgroundColor=bbf7d0',
  },
  {
    id: 'notion-jordan',
    name: 'Notion Jordan',
    category: 'notionists',
    color: 'from-blue-500 to-indigo-600',
    url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Jordan&backgroundColor=bfdbfe',
  },
  {
    id: 'notion-morgan',
    name: 'Notion Morgan',
    category: 'notionists',
    color: 'from-pink-500 to-rose-600',
    url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Morgan&backgroundColor=fbcfe8',
  },
  {
    id: 'notion-taylor',
    name: 'Notion Taylor',
    category: 'notionists',
    color: 'from-yellow-400 to-amber-500',
    url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Taylor&backgroundColor=fef08a',
  },

  // pixel-art (by DiceBear - CC0 1.0)
  {
    id: 'pixel-knight',
    name: 'Pixel Knight',
    category: 'pixel-art',
    color: 'from-slate-700 to-slate-900',
    url: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Knight&backgroundColor=1e293b',
  },
  {
    id: 'pixel-mage',
    name: 'Pixel Mage',
    category: 'pixel-art',
    color: 'from-indigo-600 to-indigo-900',
    url: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Mage&backgroundColor=312e81',
  },
  {
    id: 'pixel-rogue',
    name: 'Pixel Rogue',
    category: 'pixel-art',
    color: 'from-emerald-700 to-emerald-950',
    url: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Rogue&backgroundColor=064e3b',
  },
  {
    id: 'pixel-cyborg',
    name: 'Pixel Cyborg',
    category: 'pixel-art',
    color: 'from-fuchsia-700 to-purple-950',
    url: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Cyborg&backgroundColor=701a75',
  },
  {
    id: 'pixel-glitch',
    name: 'Pixel Glitch',
    category: 'pixel-art',
    color: 'from-sky-700 to-cyan-950',
    url: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Glitch&backgroundColor=0c4a6e',
  },
  {
    id: 'pixel-hero',
    name: 'Pixel Champion',
    category: 'pixel-art',
    color: 'from-rose-700 to-pink-950',
    url: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Hero&backgroundColor=831843',
  },

  // open-peeps (by Pablo Stanley - CC0 1.0)
  {
    id: 'peeps-dev',
    name: 'Peeps Dev',
    category: 'open-peeps',
    color: 'from-blue-400 to-blue-600',
    url: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Dev&backgroundColor=dbeafe',
  },
  {
    id: 'peeps-geek',
    name: 'Peeps Geek',
    category: 'open-peeps',
    color: 'from-amber-400 to-amber-600',
    url: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Geek&backgroundColor=fef3c7',
  },
  {
    id: 'peeps-pro',
    name: 'Peeps Pro',
    category: 'open-peeps',
    color: 'from-emerald-400 to-emerald-600',
    url: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Pro&backgroundColor=dcfce7',
  },
  {
    id: 'peeps-lead',
    name: 'Peeps Lead',
    category: 'open-peeps',
    color: 'from-purple-400 to-purple-600',
    url: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Lead&backgroundColor=fae8ff',
  },

  // shapes (by DiceBear - CC0 1.0)
  {
    id: 'shapes-matrix',
    name: 'Shapes Matrix',
    category: 'shapes',
    color: 'from-slate-700 to-slate-900',
    url: 'https://api.dicebear.com/9.x/shapes/svg?seed=Matrix&backgroundColor=0f172a',
  },
  {
    id: 'shapes-prism',
    name: 'Shapes Prism',
    category: 'shapes',
    color: 'from-zinc-700 to-zinc-900',
    url: 'https://api.dicebear.com/9.x/shapes/svg?seed=Prism&backgroundColor=18181b',
  },
  {
    id: 'shapes-flux',
    name: 'Shapes Flux',
    category: 'shapes',
    color: 'from-neutral-800 to-black',
    url: 'https://api.dicebear.com/9.x/shapes/svg?seed=Flux&backgroundColor=030712',
  },
  {
    id: 'shapes-vector',
    name: 'Shapes Vector',
    category: 'shapes',
    color: 'from-indigo-800 to-slate-950',
    url: 'https://api.dicebear.com/9.x/shapes/svg?seed=Vector&backgroundColor=1e1b4b',
  },

  // fun-emoji (by DiceBear - CC0 1.0)
  {
    id: 'emoji-cool',
    name: 'Emoji Cool',
    category: 'fun-emoji',
    color: 'from-yellow-400 to-amber-500',
    url: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Cool&backgroundColor=fef08a',
  },
  {
    id: 'emoji-mind',
    name: 'Emoji Mind',
    category: 'fun-emoji',
    color: 'from-yellow-500 to-orange-500',
    url: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Mind&backgroundColor=fde047',
  },
  {
    id: 'emoji-spark',
    name: 'Emoji Spark',
    category: 'fun-emoji',
    color: 'from-amber-400 to-orange-400',
    url: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Spark&backgroundColor=fed7aa',
  },
  {
    id: 'emoji-rock',
    name: 'Emoji Rock',
    category: 'fun-emoji',
    color: 'from-green-400 to-emerald-500',
    url: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Rock&backgroundColor=bbf7d0',
  },
];

export const getAvatarMeta = (avatarId) => {
  return AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];
};

export function UserAvatarBadge({ avatarId, size = 'md', className = '' }) {
  const [hasError, setHasError] = useState(false);
  const meta = getAvatarMeta(avatarId);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  return (
    <div
      className={`rounded-xl flex items-center justify-center overflow-hidden font-bold shadow-xs shrink-0 border border-slate-700/60 bg-slate-900 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={`${meta.name} (${meta.category})`}
    >
      {!hasError ? (
        <img
          src={meta.url}
          alt={meta.name}
          className="w-full h-full object-cover select-none pointer-events-none"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${meta.color} text-white`}>
          <User size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18} />
        </div>
      )}
    </div>
  );
}
