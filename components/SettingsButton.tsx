import React, { Dispatch, SetStateAction } from 'react';

type ButtonVariant = 'indigo' | 'emerald' | 'blue' | 'violet' | 'cyan' | 'rose' | 'amber';

interface SettingsButtonProps<T extends string> {
  option: T;
  selected: T;
  onClick: Dispatch<SetStateAction<T>>;
  children: React.ReactNode;
  variant?: ButtonVariant;
}

function SettingsButton<T extends string>({ 
    option, 
    selected, 
    onClick, 
    children,
    variant = 'indigo' 
}: SettingsButtonProps<T>) {
  
  const variants: Record<ButtonVariant, string> = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/50',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700/50',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50',
    violet: 'bg-violet-50 text-violet-700 border-violet-200 ring-1 ring-violet-500 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700/50',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200 ring-1 ring-cyan-500 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700/50',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700/50',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50',
  };

  const isSelected = selected === option;
  const selectedStyle = variants[variant];
  const unselectedStyle = 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200';

  return (
    <button
        type="button"
        onClick={() => onClick(option)}
        className={`px-4 py-2 rounded-lg font-medium text-sm flex-grow text-center transition-all duration-200 touch-manipulation border active:scale-95 ${
            isSelected ? selectedStyle : unselectedStyle
        } ${isSelected ? 'shadow-sm' : ''}`}
    >
        {children}
    </button>
  );
}

export default SettingsButton;