import React, { useState, useEffect } from 'react';

interface DailyTip {
  id: number;
  tip: string;
  category: 'accessibility' | 'wellness' | 'safety' | 'community';
  icon: string;
}

const DailyTipsBar: React.FC = () => {
  const [currentTip, setCurrentTip] = useState<DailyTip | null>(null);

  const tips: DailyTip[] = [
    {
      id: 1,
      tip: "Stay hydrated and remember to check your accessibility settings for comfort!",
      category: 'wellness',
      icon: '🌱'
    },
    {
      id: 2,
      tip: "Use voice commands to navigate faster - try 'Hey Welltick, find accessible restrooms nearby'",
      category: 'accessibility',
      icon: '🎤'
    },
    {
      id: 3,
      tip: "Share accessibility tips with the community - your experience helps others!",
      category: 'community',
      icon: '🤝'
    },
    {
      id: 4,
      tip: "Update your emergency contacts regularly and test the emergency button monthly",
      category: 'safety',
      icon: '🚨'
    },
    {
      id: 5,
      tip: "Take regular breaks from screen time and practice eye exercises",
      category: 'wellness',
      icon: '👁️'
    }
  ];

  useEffect(() => {
    const today = new Date();
    const tipIndex = today.getDate() % tips.length;
    setCurrentTip(tips[tipIndex]);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'accessibility': return '#007ACC';
      case 'wellness': return '#00BFA6';
      case 'safety': return '#FFC107';
      case 'community': return '#9C27B0';
      default: return '#007ACC';
    }
  };

  if (!currentTip) return null;

  return (
    <div
      style={{
        margin: "12px 0",
        padding: "12px 16px",
        background: `linear-gradient(135deg, ${getCategoryColor(currentTip.category)}15, ${getCategoryColor(currentTip.category)}05)`,
        borderLeft: `4px solid ${getCategoryColor(currentTip.category)}`,
        borderRadius: "8px",
        fontWeight: "500",
        fontSize: "14px",
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideIn 0.5s ease-out'
      }}
    >
      <span style={{ fontSize: '20px' }}>{currentTip.icon}</span>
      <div>
        <div style={{ 
          fontSize: '12px', 
          color: getCategoryColor(currentTip.category),
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '2px'
        }}>
          Daily {currentTip.category} tip
        </div>
        <div style={{ color: '#333' }}>
          {currentTip.tip}
        </div>
      </div>
    </div>
  );
};

export default DailyTipsBar;