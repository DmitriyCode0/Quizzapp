import React from 'react';

interface LogoProps {
    className?: string;
    isSpinning?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-20 w-20", isSpinning = false }) => {
  const animationClass = isSpinning ? 'animate-spin' : '';

  return (
    <div className="flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        className={`${className} ${animationClass}`}
        aria-label="VocabCrafter AI Logo"
        style={isSpinning ? { animationDuration: '3s' } : {}}
      >
        {/* Left Block (3D effect) */}
        <path d="M25 20 L45 20 L50 65 L30 65 Z" className="fill-indigo-600" />
        <path d="M25 20 L15 30 L20 75 L30 65" className="fill-indigo-800" />
        <path d="M15 30 L35 30 L45 20" className="fill-indigo-400" opacity="0.5" />

        {/* Right Block (3D effect) */}
        <path d="M75 20 L55 20 L50 65 L70 65 Z" className="fill-indigo-400" />
        <path d="M75 20 L85 30 L80 75 L70 65" className="fill-indigo-600" />
        <path d="M85 30 L65 30 L55 20" className="fill-indigo-300" opacity="0.5" />

        {/* Connection Link */}
        <circle cx="40" cy="45" r="4" className="fill-white stroke-cyan-400 stroke-2" />
        <circle cx="60" cy="45" r="4" className="fill-white stroke-cyan-400 stroke-2" />
        <path d="M44 45 L56 45" className="stroke-cyan-400" strokeWidth="3" strokeLinecap="round" />
        
        {/* Bottom V-Tip (Abstract) */}
        <path d="M35 70 L65 70 L50 90 Z" className="fill-indigo-500" opacity="0.2" />
      </svg>
    </div>
  );
};

export default Logo;