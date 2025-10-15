
import React from 'react';

// FIX: Extended CardProps with React.HTMLAttributes<HTMLDivElement> to allow passing standard HTML attributes like onClick, resolving an error in Settings.tsx.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
