import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TanCoreMascotAvatar } from './TanCoreMascotAvatar';
import { Sparkles } from 'lucide-react';

// Use v3 storage key to ensure users get the new well-positioned coordinates
const STORAGE_KEY = 'tancore_floating_avatar_pos_v3';

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

  const clampPosition = (x: number, y: number) => {
    const isMobile = window.innerWidth < 640;
    const btnSize = isMobile ? 56 : 64;
    const padX = 16;
    const padTop = 72; // Below navbar
    const padBottom = isMobile ? 96 : 32; // Mobile bottom nav clearance
    const minX = padX;
    const maxX = Math.max(minX, window.innerWidth - btnSize - padX);
    const minY = padTop;
    const maxY = Math.max(minY, window.innerHeight - btnSize - padBottom);
    return {
      x: Math.min(Math.max(minX, x), maxX),
      y: Math.min(Math.max(minY, y), maxY),
    };
  };

  // Initialize position from localStorage or calculate responsive default
  useEffect(() => {
    const updateDefaultPosition = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
            setPosition(clampPosition(parsed.x, parsed.y));
            return;
          }
        } catch {
          // ignore
        }
      }

      const isMobile = window.innerWidth < 640;
      // Desktop: placed noticeably more inward towards the middle-right so it's fully visible and not clipped
      // Mobile: placed significantly higher up so it's easily reachable and away from bottom gestures/navigation
      const defX = isMobile
        ? window.innerWidth - 76
        : Math.min(window.innerWidth - 130, Math.max(window.innerWidth / 2 + 180, window.innerWidth - 160));
      const defY = isMobile
        ? Math.max(100, window.innerHeight - 190)
        : Math.max(100, window.innerHeight - 130);

      setPosition(clampPosition(defX, defY));
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
    // Only primary mouse button or touch
    if (e.button !== 0) return;

    isPointerDownRef.current = true;
    hasMovedRef.current = false;

    const currentX = position ? position.x : window.innerWidth - 130;
    const currentY = position ? position.y : window.innerHeight - 130;

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
        const nextX = dragStartRef.current.initialX + deltaX;
        const nextY = dragStartRef.current.initialY + deltaY;
        setPosition(clampPosition(nextX, nextY));
      }
    };

    const onPointerUp = () => {
      isPointerDownRef.current = false;
      setIsDragging(false);

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (hasMovedRef.current) {
        if (position) {
          savePosition(position);
        }
      } else {
        // Normal click/tap: open Tanco Chat!
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
      className={`z-40 flex items-center select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Dynamic Label Badge: anchors towards center of screen to prevent clipping */}
      {!isDragging && (
        <div
          className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-bold tracking-wide shadow-lg backdrop-blur-xs pointer-events-none whitespace-nowrap absolute top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
            isLeftHalf ? 'left-full ml-2.5' : 'right-full mr-2.5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ff7a00]" />
          <span>{language === 'tr' ? "Tanco'ya Sor" : 'Ask Tanco'}</span>
        </div>
      )}

      {/* Mascot Draggable Avatar with Ultra-Smooth Breathing Animation */}
      <div
        className={`relative p-1 rounded-full bg-white border-2 border-[#ff7a00] transition-all duration-300 ${
          isDragging
            ? 'scale-110 shadow-2xl ring-4 ring-[#ff7a00]/40'
            : 'animate-tanco-breathe hover:scale-110'
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

