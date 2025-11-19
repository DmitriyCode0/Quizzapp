import React, { useState, useEffect, useCallback } from 'react';
import SpeakerIcon from './icons/SpeakerIcon';

interface AudioButtonProps {
  textToSpeak: string | undefined | null;
  lang: 'en-US' | 'uk-UA';
}

// Keep track of the currently playing utterance globally to manage state
let currentUtterance: SpeechSynthesisUtterance | null = null;
let onEndCallback: (() => void) | null = null;

const AudioButton: React.FC<AudioButtonProps> = ({ textToSpeak, lang }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlaybackEnd = useCallback(() => {
    setIsPlaying(false);
    if (currentUtterance && onEndCallback === handlePlaybackEnd) {
        currentUtterance = null;
        onEndCallback = null;
    }
  }, []);

  useEffect(() => {
    // This effect ensures that if a global utterance finishes, the button state resets.
    if (currentUtterance === null) {
        setIsPlaying(false);
    }
  }, []);


  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!textToSpeak || typeof window.speechSynthesis === 'undefined') {
      return;
    }

    // If any sound is playing, stop it.
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if(onEndCallback) onEndCallback();
    }
    
    // If the clicked sound was the one playing, this acts as a toggle-off.
    if (isPlaying) {
        return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    
    currentUtterance = utterance;
    onEndCallback = handlePlaybackEnd;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = handlePlaybackEnd;
    utterance.onerror = (event) => {
        console.error("SpeechSynthesis Error:", event.error);
        handlePlaybackEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  if (!textToSpeak) return null;

  return (
    <button
      onClick={playAudio}
      className={`p-2 rounded-full transition-colors duration-200 flex-shrink-0 ${isPlaying ? 'bg-indigo-500 text-white' : 'bg-slate-600 hover:bg-slate-500 text-slate-300'}`}
      aria-label={`Listen to: ${textToSpeak}`}
    >
      <SpeakerIcon isPlaying={isPlaying} />
    </button>
  );
};

export default AudioButton;
