import React from 'react';

interface LogoProps {
    className?: string;
    isSpinning?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-20 w-20 text-indigo-400", isSpinning = false }) => {
  const animationClass = isSpinning ? 'animate-spin' : '';

  return (
    <div className="flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} ${animationClass}`}
        aria-label="VocabCrafter AI Logo"
        style={isSpinning ? { animationDuration: '3s' } : {}}
      >
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
        <path d="m15.5 15.5 2.5 2.5" />
        <path d="m12 8-2 4h4l-2 4" />
      </svg>
    </div>
  );
};

export default Logo;