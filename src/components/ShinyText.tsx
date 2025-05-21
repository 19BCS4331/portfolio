import React from 'react';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
    const animationDuration = `${speed}s`;

    return (
        <div className={`relative px-4 py-1 ${className}`}>
            <span 
                className={`font-medium text-gray-400 bg-clip-text relative z-10 ${disabled ? '' : 'animate-shine'}`}
                style={{
                    backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255,0.9) 50%, rgba(255, 255, 255, 0) 60%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    animationDuration: disabled ? undefined : animationDuration,
                }}
            >
                {text}
            </span>
            <span className="h-2 w-2 bg-accent rounded-full animate-pulse absolute left-1 top-1/2 transform -translate-y-1/2"></span>
        </div>
    );
};

export default ShinyText;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         shine: {
//           '0%': { 'background-position': '100%' },
//           '100%': { 'background-position': '-100%' },
//         },
//       },
//       animation: {
//         shine: 'shine 5s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// };