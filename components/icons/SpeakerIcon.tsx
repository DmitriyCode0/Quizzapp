import React from 'react';

interface SpeakerIconProps {
    isPlaying?: boolean;
}

const SpeakerIcon: React.FC<SpeakerIconProps> = ({ isPlaying = false }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            {isPlaying && (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.657 6.343a9 9 0 010 12.728" />
            )}
        </svg>
    );
};
export default SpeakerIcon;
