
import React from 'react';
import SpeakerIcon from './icons/SpeakerIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import { useAudio } from '../hooks/useAudio';

interface AudioButtonProps {
  textToSpeak: string | undefined | null;
  lang: 'en-US' | 'uk-UA';
}

const AudioButton: React.FC<AudioButtonProps> = ({ textToSpeak, lang }) => {
  const { speak, currentText, isPlaying, isLoading } = useAudio();

  // Determine if THIS specific button is the one active
  const isActive = (isPlaying || isLoading) && currentText === textToSpeak;
  const showSpinner = isLoading && currentText === textToSpeak;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (textToSpeak) {
        speak(textToSpeak, lang);
    }
  };

  if (!textToSpeak) return null;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading && !isActive} // Disable other buttons while one is loading
      className={`p-2 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center w-9 h-9 ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-md scale-110' 
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm'
      } ${isLoading && !isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={`Listen to: ${textToSpeak}`}
    >
      {showSpinner ? <SpinnerIcon className="w-4 h-4 text-white animate-spin" /> : <SpeakerIcon isPlaying={isActive && !showSpinner} />}
    </button>
  );
};

export default AudioButton;
