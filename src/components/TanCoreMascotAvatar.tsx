import React, { useState } from 'react';

export const RoundPrescriptionGlasses: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 70"
    className={`w-full h-auto filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.4)] ${className}`}
    fill="none"
    xmlns="https://www.w3.org/2000/svg"
  >
    {/* Glasses Bridge (Arched Nose Bridge) */}
    <path
      d="M 64 24 Q 80 18 96 24"
      stroke="#0f172a"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M 66 25 Q 80 20 94 25"
      stroke="#334155"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Left Round Rim */}
    <circle
      cx="42"
      cy="35"
      r="24"
      fill="rgba(255, 255, 255, 0.22)"
      stroke="#0f172a"
      strokeWidth="4.5"
    />
    <circle
      cx="42"
      cy="35"
      r="22"
      stroke="#334155"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Left Lens Specular Glare Highlight */}
    <path
      d="M 26 24 C 36 18, 48 20, 54 26 C 36 34, 28 42, 22 36 Z"
      fill="#ffffff"
      fillOpacity="0.45"
    />
    <path
      d="M 46 18 L 52 20 L 38 48 L 32 47 Z"
      fill="#ffffff"
      fillOpacity="0.3"
    />

    {/* Right Round Rim */}
    <circle
      cx="118"
      cy="35"
      r="24"
      fill="rgba(255, 255, 255, 0.22)"
      stroke="#0f172a"
      strokeWidth="4.5"
    />
    <circle
      cx="118"
      cy="35"
      r="22"
      stroke="#334155"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Right Lens Specular Glare Highlight */}
    <path
      d="M 102 24 C 112 18, 124 20, 130 26 C 112 34, 104 42, 98 36 Z"
      fill="#ffffff"
      fillOpacity="0.45"
    />
    <path
      d="M 122 18 L 128 20 L 114 48 L 108 47 Z"
      fill="#ffffff"
      fillOpacity="0.3"
    />

    {/* Left & Right Frame Temples / Hinges */}
    <path d="M 18 30 L 4 28" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    <path d="M 142 30 L 156 28" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

    {/* Small Hinge Metal Accents */}
    <circle cx="18" cy="30" r="2.5" fill="#e2e8f0" />
    <circle cx="142" cy="30" r="2.5" fill="#e2e8f0" />
  </svg>
);

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
        {/* Round Prescription Glasses (Transparent Lenses) Overlay */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: '49.5%',
            top: '42.5%',
            width: '60%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <RoundPrescriptionGlasses />
        </div>
      </div>
    );
  }

  // Vector SVG Fallback representing the exact avatar character with round glasses
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
      {/* Round Prescription Glasses (Transparent Lenses) Overlay */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '49.5%',
          top: '42.5%',
          width: '60%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <RoundPrescriptionGlasses />
      </div>
    </div>
  );
};
