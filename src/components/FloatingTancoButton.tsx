import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TanCoreMascotAvatar } from './TanCoreMascotAvatar';
import { Sparkles } from 'lucide-react';

const STORAGE_KEY = 'tancore_floating_avatar_pos';

export const FloatingTancoButton: React.FC = () => {
  const { language, isTancoChatOpen, setIsTancoChatOpen } = useAppStore();

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isPointerDownRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });
  const hasMovedRef = useRef(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Initialize position from localStorage or default to bottom-right
  useEffect(() => {
    const updateDefaultPosition = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const btnWidth = 56;
          const btnHeight = 56;
          const clampedX = Math.min(Math.max(12, parsed.x), window.innerWidth - btnWidth - 12);
          const clampedY = Math.min(Math.max(68, parsed.y), window.innerHeight - btnHeight - 16);
          setPosition({ x: clampedX, y: clampedY });
          return;
        } catch {
          // ignore
        }
      }

      // Default: bottom-right
      const defX = window.innerWidth - 72;
      const defY = window.innerHeight - 84;
      setPosition({ x: Math.max(12, defX), y: Math.max(68, defY) });
    };

    updateDefaultPosition();
    window.addEventListener('resize', updateDefaultPosition);
    return () => window.removeEventListener('resize', updateDefaultPosition);
  }, []);

  // Save position when changed by drag
  const savePosition = (pos: { x: number; y: number }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    } catch {
      // ignore
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary button
    if (e.button !== 0) return;

    isPointerDownRef.current = true;
    hasMovedRef.current = false;

    const currentX = position ? position.x : window.innerWidth - 72;
    const currentY = position ? position.y : window.innerHeight - 84;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentX,
      initialY: currentY,
    };

    // Capture pointer
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    const onPointerMove = (moveEv: PointerEvent) => {
      if (!isPointerDownRef.current) return;

      const deltaX = moveEv.clientX - dragStartRef.current.startX;
      const deltaY = moveEv.clientY - dragStartRef.current.startY;

      if (!hasMovedRef.current && Math.hypot(deltaX, deltaY) > 5) {
        hasMovedRef.current = true;
        setIsDragging(true);
      }

      if (hasMovedRef.current) {
        const btnWidth = 56;
        const btnHeight = 56;
        const nextX = dragStartRef.current.initialX + deltaX;
        const nextY = dragStartRef.current.initialY + deltaY;

        const clampedX = Math.min(Math.max(12, nextX), window.innerWidth - btnWidth - 12);
        const clampedY = Math.min(Math.max(68, nextY), window.innerHeight - btnHeight - 16);

        setPosition({ x: clampedX, y: clampedY });
      }
    };

    const onPointerUp = (upEv: PointerEvent) => {
      isPointerDownRef.current = false;
      setIsDragging(false);

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (hasMovedRef.current) {
        // Was a drag: save final position
        if (position) {
          savePosition(position);
        }
      } else {
        // Was a click: open chat!
        setIsTancoChatOpen(true);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  if (isTancoChatOpen || !position) return null;

  const isLeftHalf = position.x < window.innerWidth / 2;

  return (
    <div
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
        userSelect: 'none',
      }}
      className={`z-40 flex items-center space-x-2 select-none transition-shadow ${
        isLeftHalf ? 'flex-row-reverse space-x-reverse' : 'flex-row'
      } ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'}`}
    >
      {/* Dynamic Label Badge (hidden when dragging, shows on hover or stationary) */}
      {!isDragging && (
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-black tracking-wide shadow-lg backdrop-blur-xs pointer-events-none opacity-90 transition-opacity">
          <Sparkles className="w-3 h-3 text-[#ff7a00]" />
          <span>{language === 'tr' ? "Tanco'ya Sor" : 'Ask Tanco'}</span>
        </div>
      )}

      {/* Mascot Photo Draggable Avatar */}
      <div
        className={`relative p-1 rounded-full bg-white border-2 border-[#ff7a00] shadow-xl hover:shadow-[#ff7a00]/40 transition-transform ${
          isDragging ? 'scale-110 shadow-2xl ring-4 ring-[#ff7a00]/30' : 'hover:scale-105'
        }`}
        title={
          language === 'tr'
            ? 'Tanco ile Sohbet Et (Sürükleyip istediğin yere bırakabilirsin)'
            : 'Chat with Tanco (Drag & drop anywhere)'
        }
      >
        <div className="relative pointer-events-none">
          <TanCoreMascotAvatar
            size="md"
            className="rounded-full shadow-inner pointer-events-none"
          />
          {/* Glowing Green Online Status Dot */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs animate-pulse" />
        </div>
      </div>
    </div>
  );
};
