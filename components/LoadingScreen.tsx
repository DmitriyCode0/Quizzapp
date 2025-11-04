
import React from 'react';

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Generating Your Quiz..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 bg-slate-800 rounded-lg shadow-2xl">
      <div className="w-16 h-16 border-4 border-t-indigo-400 border-slate-600 rounded-full animate-spin"></div>
      <h2 className="text-2xl font-semibold text-slate-200">{message}</h2>
      <p className="text-slate-400">The AI is crafting your questions. Please wait a moment.</p>
    </div>
  );
};

export default LoadingScreen;
