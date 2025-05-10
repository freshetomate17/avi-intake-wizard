
import React from "react";

interface AviLogoProps {
  className?: string;
}

const AviLogo: React.FC<AviLogoProps> = ({ className = "h-16" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 'a' character */}
      <path
        d="M16 30C12.5 30 10 27.5 10 24C10 20.5 12.5 18 16 18C19.5 18 22 20.5 22 24C22 27.5 19.5 30 16 30ZM16 20C13.5 20 12 21.5 12 24C12 26.5 13.5 28 16 28C18.5 28 20 26.5 20 24C20 21.5 18.5 20 16 20ZM22 30V24C22 20.5 19.5 18 16 18C14.5 18 13 18.5 12 19.5V10H10V30H12V28.5C13 29.5 14.5 30 16 30H22Z"
        fill="black"
      />
      
      {/* 'v' character */}
      <path
        d="M34 30L30 18H32L35 28L38 18H40L36 30H34Z"
        fill="black"
      />
      
      {/* 'i' character */}
      <path
        d="M44 30V18H46V30H44Z"
        fill="black"
      />
      
      {/* Dot above the 'i' in vivid purple */}
      <circle
        cx="45"
        cy="14"
        r="3"
        fill="#6B3BFF"
      />
    </svg>
  );
};

export default AviLogo;
