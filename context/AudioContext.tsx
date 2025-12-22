
import React, { createContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { generateSpeech } from '../services/geminiService';

export type AudioSource = 'gemini' | 'browser';

interface AudioContextType {
    isPlaying: boolean;
    isLoading: boolean;
    currentText: string | null;
    audioSource: AudioSource;
    toggleAudioSource: () => void;
    speak: (text: string, lang: 'en-US' | 'uk-UA') => void;
    cancel: () => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(undefined);

// --- PCM Decoding Helpers ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentText, setCurrentText] = useState<string | null>(null);
    const [audioSource, setAudioSourceState] = useState<AudioSource>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('audioSource');
            if (saved === 'gemini' || saved === 'browser') return saved;
        }
        return 'gemini';
    });
    
    const audioCtxRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const audioCacheRef = useRef<Map<string, AudioBuffer>>(new Map());

    const toggleAudioSource = useCallback(() => {
        setAudioSourceState(prev => {
            const next = prev === 'gemini' ? 'browser' : 'gemini';
            localStorage.setItem('audioSource', next);
            return next;
        });
    }, []);

    // Initialize AudioContext lazily (on user interaction)
    const getAudioContext = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: 24000, // Matches Gemini TTS output
            });
        }
        return audioCtxRef.current;
    }, []);

    const cancel = useCallback(() => {
        if (sourceRef.current) {
            try {
                sourceRef.current.stop();
            } catch (e) {
                // Ignore errors if already stopped
            }
            sourceRef.current = null;
        }
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentText(null);
        
        // Also cancel browser speech synthesis if it was running (fallback/cleanup)
        if (typeof window.speechSynthesis !== 'undefined') {
            window.speechSynthesis.cancel();
        }
    }, []);

    const speak = useCallback(async (text: string, lang: 'en-US' | 'uk-UA') => {
        if (!text) return;

        // If we are already playing/loading this exact text, toggle stop
        if ((isPlaying || isLoading) && currentText === text) {
            cancel();
            return;
        }

        // Stop any current audio
        cancel();
        setCurrentText(text);

        // Fallback to browser TTS for Ukrainian (Gemini 'Kore' voice is English optimized)
        // OR if audioSource preference is set to 'browser'
        if (lang === 'uk-UA' || audioSource === 'browser') {
             const utterance = new SpeechSynthesisUtterance(text);
             utterance.lang = lang;
             utterance.onstart = () => { setIsPlaying(true); };
             utterance.onend = () => { setIsPlaying(false); setCurrentText(null); };
             utterance.onerror = () => { setIsPlaying(false); setCurrentText(null); };
             window.speechSynthesis.speak(utterance);
             return;
        }

        setIsLoading(true);

        try {
            const ctx = getAudioContext();
            
            // Resume context if suspended (browser autoplay policy)
            if (ctx.state === 'suspended') {
                await ctx.resume();
            }

            let audioBuffer = audioCacheRef.current.get(text);

            if (!audioBuffer) {
                const base64Audio = await generateSpeech(text);
                const pcmBytes = decode(base64Audio);
                audioBuffer = await decodeAudioData(pcmBytes, ctx);
                audioCacheRef.current.set(text, audioBuffer);
            }

            // Create source
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            
            source.onended = () => {
                setIsPlaying(false);
                setCurrentText(null);
                sourceRef.current = null;
            };

            sourceRef.current = source;
            setIsLoading(false);
            setIsPlaying(true);
            source.start();

        } catch (error) {
            console.error("Audio playback error:", error);
            setIsLoading(false);
            setIsPlaying(false);
            setCurrentText(null);
            
            // Fallback to browser TTS on error
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            window.speechSynthesis.speak(utterance);
        }
    }, [currentText, cancel, getAudioContext, isPlaying, isLoading, audioSource]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancel();
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, [cancel]);

    return (
        <AudioContext.Provider value={{ isPlaying, isLoading, currentText, audioSource, toggleAudioSource, speak, cancel }}>
            {children}
        </AudioContext.Provider>
    );
};
