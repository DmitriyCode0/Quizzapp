import React, { useState } from 'react';
import HelpIcon from './icons/HelpIcon';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-flex items-center ml-2 group cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)} // Mobile support
    >
      <HelpIcon className="h-4 w-4 text-slate-500 hover:text-indigo-400 transition-colors" />
      
      <div 
        className={`absolute z-50 w-64 p-2 bg-slate-700 text-white text-xs rounded-lg shadow-xl border border-slate-600 pointer-events-none transition-opacity duration-200 ${positionClasses[position]} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {text}
        {/* Arrow */}
        <div className={`absolute w-2 h-2 bg-slate-700 transform rotate-45 border-slate-600 
            ${position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' : ''}
            ${position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' : ''}
        `}></div>
      </div>
    </div>
  );
};

export default Tooltip;