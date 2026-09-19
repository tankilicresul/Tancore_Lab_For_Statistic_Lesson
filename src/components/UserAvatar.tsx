import React, { useState, useEffect } from 'react';
import { getDefaultAvatarForUser } from '../utils/avatarHelper';

interface UserAvatarProps {
  avatarUrl?: string | null;
  avatarEmoji?: string | null;
  fullName?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  imgClassName?: string;
  emojiClassName?: string;
  disableDefaultFallback?: boolean;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-2xl',
  xl: 'w-20 h-20 text-3xl',
  '2xl': 'w-24 h-24 text-4xl',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  avatarEmoji = '👨‍🎓',
  fullName = '',
  size = 'md',
  className = '',
  imgClassName = '',
  emojiClassName = '',
  disableDefaultFallback = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // Determine effective image URL
  const defaultAvatar = disableDefaultFallback
    ? null
    : getDefaultAvatarForUser(fullName || avatarEmoji || 'student');
  const effectiveUrl = avatarUrl || defaultAvatar;

  // Reset error when URL changes
  useEffect(() => {
    setImgError(false);
  }, [avatarUrl, effectiveUrl]);

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const initial = fullName ? fullName.trim().charAt(0).toUpperCase() : '';
  const emoji = avatarEmoji || '👨‍🎓';

  const showImage = Boolean(effectiveUrl && !imgError);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none ${sizeClass} ${className}`}
    >
      {showImage ? (
        <img
          src={effectiveUrl!}
          alt={fullName || 'User Avatar'}
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover rounded-full ${imgClassName}`}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xs font-black ${emojiClassName}`}
        >
          {emoji ? (
            <span className="leading-none select-none">{emoji}</span>
          ) : initial ? (
            <span className="text-slate-800 leading-none">{initial}</span>
          ) : (
            <span className="leading-none">👨‍🎓</span>
          )}
        </div>
      )}
    </div>
  );
};
