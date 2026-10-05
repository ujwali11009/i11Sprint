import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Icon emblem matching the red dot accent */}
      <div className="relative flex items-center justify-center font-extrabold tracking-tight">
        <span className={`font-black text-slate-900 ${sizeClasses[size]}`}>
          <span className="text-red-600 inline-block font-extrabold">i</span>11
          <span className="text-slate-900 ml-0.5 font-bold">Sprint</span>
        </span>
      </div>
    </div>
  );
};
