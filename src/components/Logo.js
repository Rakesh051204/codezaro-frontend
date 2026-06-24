import Logo from "../components/Logo";
import React from "react";

const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="12" fill="#0d1117" stroke="#58a6ff" strokeWidth="1.5" />
      <path
        d="M18 20 L42 20 L42 24 L22 24 L22 40 L42 40 L42 44 L18 44 L18 20 Z"
        fill="#58a6ff"
      />
      <path
        d="M30 28 L36 32 L30 36"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="38" y="30" width="2" height="12" fill="#3fb950" className="animate-pulse" />
    </svg>
  );
};

export default Logo;