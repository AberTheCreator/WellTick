
import React from 'react';

interface DynamicIconProps {
  name: 'home' | 'community' | 'places' | 'assistant' | 'emergency';
  isActive: boolean;
  size?: number;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, isActive, size = 24 }) => {
  const activeColor = '#007ACC';
  const inactiveColor = '#666';
  const currentColor = isActive ? activeColor : inactiveColor;

  const icons = {
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          stroke={currentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isActive ? `${activeColor}20` : 'none'}
        />
      </svg>
    ),
    community: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          stroke={currentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isActive ? `${activeColor}20` : 'none'}
        />
      </svg>
    ),
    places: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          stroke={currentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isActive ? `${activeColor}20` : 'none'}
        />
        <path
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          stroke={currentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isActive ? activeColor : 'none'}
        />
      </svg>
    ),
    assistant: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          stroke={currentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isActive ? `${activeColor}15` : 'none'}
        />
      </svg>
    ),
    emergency: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
          stroke={isActive ? '#e53935' : currentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isActive ? '#e5393520' : 'none'}
        />
      </svg>
    )
  };

  return (
    <div style={{
      transition: 'all 0.3s ease',
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
      filter: isActive ? 'drop-shadow(0 2px 4px rgba(0, 122, 204, 0.3))' : 'none'
    }}>
      {icons[name]}
    </div>
  );
};

export default DynamicIcon;