import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TanCoreMascotAvatar } from './TanCoreMascotAvatar';
import { getLatestTancoMessageInfo } from '../lib/supabase';

const LAST_READ_KEY = 'tancore_last_read_tanco_chat_v1';

export const FloatingTancoButton: React.FC = () => {
  const {
    language,
    isTancoChatOpen,
    setIsTancoChatOpen,
    userProfile,
    isTancoActive,
    tancoPosition,
    setTancoPosition,
  } = useAppStore();

  const [isDragging, setIsDragging] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isJustAwakened, setIsJustAwakened] = useState(false);

  const prevActiveRef = useRef(Boolean(isTancoActive));
  const isPointerDownRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });
  const hasMovedRef = useRef(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Play celebratory wake-up animation when Tanco transitions from inactive to active
  useEffect(() => {
    if (isTancoActive && !prevActiveRef.current) {
      setIsJustAwakened(true);
      const timer = setTimeout(() => setIsJustAwakened(false), 900);
      return () => clearTimeout(timer);
    }
    prevActiveRef.current = Boolean(isTancoActive);
  }, [isTancoActive]);

  const clampPosition = useCallback((x: number, y: number) => {
    const isMobile = window.innerWidth < 640;
    const btnSize = isMobile ? 56 : 60;
    const padX = 12;
    const padTop = 64; // Below navbar
    const padBottom = isMobile ? 96 : 36; // Bottom nav clearance
    const minX = padX;
    const maxX = Math.max(minX, window.innerWidth - btnSize - padX);
    const minY = padTop;
    const maxY = Math.max(minY, window.innerHeight - btnSize - padBottom);
    return {
      x: Math.min(Math.max(minX, x), maxX),
      y: Math.min(Math.max(minY, y), maxY),
    };
  }, []);

  // Handle window resize so Tanco doesn't drift outside screen
  useEffect(() => {
    if (!isTancoActive || !tancoPosition) return;
    const handleResize = () => {
      const clamped = clampPosition(tancoPosition.x, tancoPosition.y);
      if (clamped.x !== tancoPosition.x || clamped.y !== tancoPosition.y) {
        setTancoPosition(clamped);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isTancoActive, tancoPosition, clampPosition, setTancoPosition]);

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

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary mouse button or touch
    if (e.button !== 0) return;

    isPointerDownRef.current = true;
    hasMovedRef.current = false;

    const currentX = tancoPosition ? tancoPosition.x : window.innerWidth - 80;
    const currentY = tancoPosition ? tancoPosition.y : window.innerHeight - 150;

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
        setTancoPosition(clampPosition(nextX, nextY));
      }
    };

    const onPointerUp = () => {
      isPointerDownRef.current = false;
      setIsDragging(false);

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (!hasMovedRef.current) {
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

  // Crucial: Tanco will NOT appear until the user activates it by touching the photo on the home card!
  if (!isTancoActive || isTancoChatOpen || !tancoPosition) return null;

  const isLeftHalf = tancoPosition.x < window.innerWidth / 2;

  return (
    <div
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        left: `${tancoPosition.x}px`,
        top: `${tancoPosition.y}px`,
        touchAction: 'none',
        userSelect: 'none',
      }}
      className={`z-50 flex items-center select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Dynamic Label or Unread Notification Alert Bubble */}
      {hasUnread ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsTancoChatOpen(true);
          }}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white text-[11px] font-black tracking-wide shadow-xl shadow-red-500/30 border border-white/40 pointer-events-auto cursor-pointer whitespace-nowrap absolute top-1/2 -translate-y-1/2 animate-bounce transition-all duration-300 ${
            isLeftHalf ? 'left-full ml-3' : 'right-full mr-3'
          }`}
        >
          <span>{language === 'tr' ? "Tanco'dan Yeni Mesaj!" : 'New Message from Tanco!'}</span>
        </div>
      ) : (
        !isDragging && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsTancoChatOpen(true);
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/95 text-white text-[11px] font-bold tracking-wide shadow-lg border border-slate-700/60 backdrop-blur-xs pointer-events-auto cursor-pointer whitespace-nowrap absolute top-1/2 -translate-y-1/2 transition-all duration-300 hover:bg-slate-800 ${
              isLeftHalf ? 'left-full ml-2.5' : 'right-full mr-2.5'
            }`}
          >
            <span>{language === 'tr' ? "Tanco'ya Sor" : 'Ask Tanco'}</span>
          </div>
        )
      )}

      {/* Mascot Draggable Avatar with Awakening, Breathing, and Glowing Halo Effects */}
      <div
        className={`relative rounded-full p-0.5 bg-white transition-all duration-300 ${
          hasUnread
            ? 'ring-4 ring-red-400/40 shadow-xl shadow-red-500/30'
            : isDragging
            ? 'scale-110 shadow-2xl ring-4 ring-[#ff7a00]/50'
            : isJustAwakened
            ? 'ring-4 ring-[#ff7a00]/70 shadow-[0_0_28px_rgba(255,122,0,0.7)] animate-tanco-wakeup'
            : 'ring-4 ring-[#ff7a00]/50 shadow-[0_0_22px_rgba(255,122,0,0.6)] animate-tanco-breathe hover:scale-105'
        }`}
        title={
          language === 'tr'
            ? 'Tanco ile Sohbet Et (Sürükleyip istediğin yere bırakabilirsin)'
            : 'Chat with Tanco (Drag & drop anywhere)'
        }
      >
        <div className="relative pointer-events-none">
          <TanCoreMascotAvatar
            size="lg"
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
