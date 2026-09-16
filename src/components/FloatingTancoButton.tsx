import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { TanCoreMascotAvatar } from './TanCoreMascotAvatar';
import { MessageSquare, Sparkles } from 'lucide-react';

export const FloatingTancoButton: React.FC = () => {
  const { language, isTancoChatOpen, setIsTancoChatOpen } = useAppStore();

  if (isTancoChatOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center space-x-2 animate-fade-in group">
      {/* Label Tooltip Badge on hover / idle */}
      <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-black tracking-wide shadow-lg backdrop-blur-xs pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
        <Sparkles className="w-3 h-3 text-[#ff7a00]" />
        <span>{language === 'tr' ? "Tanco'ya Sor" : 'Ask Tanco'}</span>
      </div>

      {/* Mascot Photo Button */}
      <button
        onClick={() => setIsTancoChatOpen(true)}
        className="relative p-1 rounded-full bg-white border-2 border-[#ff7a00] shadow-xl hover:shadow-[#ff7a00]/30 hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-none"
        title={language === 'tr' ? "Tanco ile Sohbet Et" : "Chat with Tanco"}
        aria-label="Tanco Chat"
      >
        <div className="relative">
          <TanCoreMascotAvatar
            size="md"
            className="rounded-full shadow-inner"
          />
          {/* Glowing Green Online Status Dot */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs animate-pulse" />
        </div>
      </button>
    </div>
  );
};
