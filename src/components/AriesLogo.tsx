
import React from "react";

interface AriesLogoProps {
  size?: number;
  className?: string;
}

const AriesLogo: React.FC<AriesLogoProps> = ({ size = 30, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-float ${className}`}
    >
      {/* Gradient definition */}
      <defs>
        <linearGradient id="ariesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Circular background */}
      <circle cx="50" cy="50" r="46" fill="url(#ariesGradient)" fillOpacity="0.1" />
      
      {/* Aries symbol */}
      <path
        d="M50 15C45 15 40 18 40 25C40 32 45 38 50 50C55 38 60 32 60 25C60 18 55 15 50 15Z"
        stroke="url(#ariesGradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
      />
      <path
        d="M35 40C25 53 20 65 20 75"
        stroke="url(#ariesGradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M65 40C75 53 80 65 80 75"
        stroke="url(#ariesGradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Stars */}
      <circle cx="30" cy="25" r="2" fill="#8B5CF6" className="animate-pulse" />
      <circle cx="70" cy="25" r="1.5" fill="#4F46E5" className="animate-pulse" />
      <circle cx="85" cy="50" r="2" fill="#8B5CF6" className="animate-pulse" />
      <circle cx="15" cy="50" r="1.5" fill="#4F46E5" className="animate-pulse" />
    </svg>
  );
};

export default AriesLogo;
