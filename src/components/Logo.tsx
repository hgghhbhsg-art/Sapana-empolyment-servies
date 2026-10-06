import React from 'react';
import sapanaLogoImg from '../assets/images/sapana_official_logo_1791255353503.jpg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Circular Logo */}
      <div className={`relative ${sizeClasses[size]} rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-md shadow-amber-500/20 shrink-0 overflow-hidden ring-1 ring-amber-400/50`}>
        <img
          src={sapanaLogoImg}
          alt="Sapana Employment Service Pvt. Ltd. Official Logo"
          className="w-full h-full object-cover rounded-full bg-white"
          referrerPolicy="no-referrer"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base sm:text-lg tracking-tight text-white font-brand">
              SAPANA
            </span>
            <span className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
              Employment
            </span>
          </div>
          <span className="text-[10px] text-slate-300 -mt-0.5 font-medium truncate">
            Pvt. Ltd. · Nepalgunj & Bardiya
          </span>
        </div>
      )}
    </div>
  );
};
