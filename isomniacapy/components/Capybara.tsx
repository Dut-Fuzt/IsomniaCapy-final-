import React, { useState, useEffect, useRef } from 'react';

interface CapybaraProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  followMouse: boolean;
}

const actions = [
  { emoji: '👋', text: 'Hello!' },
  { emoji: '💤', text: 'Napping...' },
  { emoji: '🎉', text: 'You can do it!' },
  { emoji: '📚', text: 'Studying hard!' },
  { emoji: '🥛', text: 'Milk time!' },
  { emoji: '📺', text: 'TV break!' },
];

const CapybaraSvg: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <defs>
            <radialGradient id="grad-body" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#C69C6D'}} />
                <stop offset="100%" style={{stopColor: '#8D5B2A'}} />
            </radialGradient>
            <linearGradient id="grad-nose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{stopColor: '#6B4519'}}/>
                <stop offset="100%" style={{stopColor: '#4A2B0E'}}/>
            </linearGradient>
        </defs>
        {/* Body */}
        <ellipse cx="50" cy="65" rx="40" ry="30" fill="url(#grad-body)" />
        {/* Head */}
        <circle cx="50" cy="40" r="25" fill="url(#grad-body)" />
        {/* Ears */}
        <circle cx="30" cy="25" r="7" fill="#8D5B2A" />
        <circle cx="70" cy="25" r="7" fill="#8D5B2A" />
        {/* Eyes */}
        <circle cx="40" cy="40" r="3" fill="#2C1E12" />
        <circle cx="60" cy="40" r="3" fill="#2C1E12" />
        {/* Nose */}
        <ellipse cx="50" cy="50" rx="8" ry="5" fill="url(#grad-nose)" />
    </svg>
);


const Capybara: React.FC<CapybaraProps> = ({ position, followMouse }) => {
  const [action, setAction] = useState(actions[0]);
  const [rotation, setRotation] = useState(0);
  const capyRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * actions.length);
      setAction(actions[randomIndex]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!followMouse || !capyRef.current) {
        setRotation(0); // Reset rotation if disabled
        return;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (capyRef.current) {
        const capyRect = capyRef.current.getBoundingClientRect();
        const capyCenterX = capyRect.left + capyRect.width / 2;
        const capyCenterY = capyRect.top + capyRect.height / 2;
        const angle = Math.atan2(e.clientY - capyCenterY, e.clientX - capyCenterX) * (180 / Math.PI);
        setRotation(angle + 90); // Adjusting so the top of the capy points towards the mouse
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [followMouse]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
    }
  };

  return (
    <div
      ref={capyRef}
      className={`fixed ${getPositionClasses()} z-50 flex items-center justify-center transition-transform duration-100`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
        <div className="relative">
            <div style={{ transform: `rotate(${rotation}deg)` }}>
                <CapybaraSvg />
            </div>
             <div className={`absolute -top-2 -right-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1 text-sm shadow-md transition-all duration-300 ${isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                {action.emoji} {action.text}
            </div>
        </div>
    </div>
  );
};

export default Capybara;
