import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TanCoreMascotAvatar } from './TanCoreMascotAvatar';
import { getLatestTancoMessageInfo } from '../lib/supabase';

// Use v3 storage key to ensure users get the new well-positioned coordinates
const STORAGE_KEY = 'tancore_floating_avatar_pos_v3';
const LAST_READ_KEY = 'tancore_last_read_tanco_chat_v1';

export const FloatingTancoButton: React.FC = () => {
  const { language, isTancoChatOpen, setIsTancoChatOpen, userProfile } = useAppStore();

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

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

  // Check unread messages from Tanco
  const checkUnreadNotification = useCallback(async () => {
    if (isTancoChatOpen) {
      setHasUnread(false);
      return;
    }

    const userIdentifier = userProfile?.schoolEmail || userProfile?.id;
    if (!userIdentifier) return;

    try {
      const latestMsg = await getLatestTancoMessageInfo(userIdentifier);
      if (latestMsg && latestMsg.sender === 'tanco') {
        const lastReadStr = localStorage.getItem(LAST_READ_KEY);
        const lastReadTime = lastReadStr ? Number(lastReadStr) : 0;
        const msgTime = new Date(latestMsg.createdAt).getTime();

        if (msgTime > lastReadTime) {
          setHasUnread(true);
          return;
        }
      }
      setHasUnread(false);
    } catch {
      // ignore
    }
  }, [isTancoChatOpen, userProfile]);

  useEffect(() => {
    checkUnreadNotification();
    const interval = setInterval(checkUnreadNotification, 12000);
    return () => clearInterval(interval);
  }, [checkUnreadNotification]);

  // When chat modal opens, mark as read
  useEffect(() => {
    if (isTancoChatOpen) {
      setHasUnread(false);
      localStorage.setItem(LAST_READ_KEY, String(Date.now()));
    }
  }, [isTancoChatOpen]);

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
        // Normal click/tap: open Tanco Chat & clear notification badge
        setHasUnread(false);
        localStorage.setItem(LAST_READ_KEY, String(Date.now()));
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
      {/* Dynamic Label or Unread Notification Alert Bubble */}
      {hasUnread ? (
        <div
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white text-[11px] font-black tracking-wide shadow-xl shadow-red-500/30 border border-white/40 pointer-events-none whitespace-nowrap absolute top-1/2 -translate-y-1/2 animate-bounce transition-all duration-300 ${
            isLeftHalf ? 'left-full ml-3' : 'right-full mr-3'
          }`}
        >
          <span>{language === 'tr' ? "Tanco'dan Yeni Mesaj!" : 'New Message from Tanco!'}</span>
        </div>
      ) : (
        !isDragging && (
          <div
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-bold tracking-wide shadow-lg backdrop-blur-xs pointer-events-none whitespace-nowrap absolute top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
              isLeftHalf ? 'left-full ml-2.5' : 'right-full mr-2.5'
            }`}
          >
            <span>{language === 'tr' ? "Tanco'ya Sor" : 'Ask Tanco'}</span>
          </div>
        )
      )}

      {/* Mascot Draggable Avatar with Breathing and Glow Effects */}
      <div
        className={`relative p-1 rounded-full bg-white border-2 transition-all duration-300 ${
          hasUnread
            ? 'border-red-500 ring-4 ring-red-400/40 shadow-xl shadow-red-500/30'
            : isDragging
            ? 'border-[#ff7a00] scale-110 shadow-2xl ring-4 ring-[#ff7a00]/40'
            : 'border-[#ff7a00] animate-tanco-breathe hover:scale-110'
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

          {/* Attention-Grabbing Red/Orange Unread Notification Badge */}
          {hasUnread && (
            <div className="absolute -top-1.5 -right-1.5 z-20 flex items-center justify-center pointer-events-none">
              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black shadow-md border-2 border-white ring-1 ring-red-400/50">
                1
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
