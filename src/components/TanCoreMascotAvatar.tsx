import React, { useState } from 'react';
import { Zap } from 'lucide-react';

interface TanCoreMascotAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  alt?: string;
}

export const TanCoreMascotAvatar: React.FC<TanCoreMascotAvatarProps> = ({
  className = '',
  size = 'md',
  alt = 'Tanco Yapay Zeka Öğretim Asistanı Maskotu',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  if (!imgError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-orange-50 border-2 border-[#ff7a00] shadow-sm shrink-0 ${sizeClasses} ${className}`}
      >
        <img
          src="/tancore-mascot.png"
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Vector SVG Fallback representing the exact avatar character
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-slate-100 border-2 border-slate-900 shadow-sm shrink-0 ${sizeClasses} ${className}`}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="https://www.w3.org/2000/svg">
        {/* Background */}
        <rect width="200" height="200" fill="#F5F5F4" />
        
        {/* Hair Back */}
        <path d="M40 90 C35 60, 60 20, 100 20 C140 20, 165 60, 160 90 Z" fill="#334155" stroke="#0F172A" strokeWidth="6" />

        {/* Body / Shirt */}
        <path d="M35 180 C35 140, 70 130, 100 130 C130 130, 165 140, 165 180 Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="6" />
        
        {/* Collar */}
        <path d="M75 130 L100 160 L125 130 L145 135 L100 175 L55 135 Z" fill="#475569" stroke="#0F172A" strokeWidth="5" />
        
        {/* Buttons */}
        <circle cx="100" cy="180" r="4" fill="#0F172A" />

        {/* Neck */}
        <rect x="85" y="110" width="30" height="25" fill="#FED7AA" stroke="#0F172A" strokeWidth="4" />

        {/* Orange Circle Face (Logo Face) */}
        <circle cx="100" cy="85" r="42" fill="#FF7A00" stroke="#0F172A" strokeWidth="6" />
        <circle cx="100" cy="85" r="34" stroke="#FFFFFF" strokeWidth="5" fill="none" />
        
        {/* Lightning Bolt */}
        <path d="M102 63 L86 87 H98 L94 107 L114 83 H102 L106 63 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />

        {/* Hair Front Bangs */}
        <path d="M50 70 C60 40, 90 35, 100 45 C110 35, 140 40, 150 70 C140 50, 115 50, 100 60 C85 50, 60 50, 50 70 Z" fill="#334155" stroke="#0F172A" strokeWidth="5" />
      </svg>
    </div>
  );
};
