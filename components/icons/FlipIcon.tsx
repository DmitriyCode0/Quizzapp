import React from 'react';

const FlipIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`h-5 w-5 ${className}`} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M5.5 9.5A7 7 0 0112 5a7 7 0 017 7 1 1 0 01-1 1h-2m-3 0a3 3 0 00-3 3v2" />
  </svg>
);

export default FlipIcon;