import React, { useState, useEffect } from 'react';

interface Activity {
  id: number;
  type: 'walk' | 'accessibility_review' | 'community_tip' | 'daily_check' | 'goal_complete';
  description: string;
  tokensEarned: number;
  timestamp: Date;
  verified: boolean;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  tokensReward: number;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}

const Earn: React.FC = () => {
  const [totalTokens, setTotalTokens] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyGoal, setDailyGoal] = useState({ current: 0, target: 5000 });
  const [isTracking, setIsTracking] = useState(false);
  const [todaysSteps, setTodaysSteps] = useState(0);

  useEffect(() => {
    fetchEarnData();
    if ('DeviceMotionEvent' in window) {
      
      initializeStepTracking();
    }
  }, []);


  const fetchEarnData = async () => {
    const mockActivities: Activity[] = [
      {
        id: 1,
        type: 'walk',
        description: 'Walked 2,500 steps',
        tokensEarned: 25,
        timestamp: new Date(Date.now() - 3600000),
        verified: true
      },
      {
        id: 2,
        type: 'accessibility_review',
        description: 'Reviewed Accessible Cafe downtown',
        tokensEarned: 50,
        timestamp: new Date(Date.now() - 7200000),
        verified: true
      },
      {
        id: 3,
        type: 'community_tip',
        description: 'Shared helpful accessibility tip',
        tokensEarned: 30,
        timestamp: new Date(Date.now() - 86400000),
        verified: true
      }
    ];

    const mockAchievements: Achievement[] = [
      {
        id: 1,
        name: 'First Steps',
        description: 'Complete your first walking session',
        icon: '🚶',
        tokensReward: 100,
        isUnlocked: true,
        progress: 1,
        maxProgress: 1
      },
      {
        id: 2,
        name: 'Community Helper',
        description: 'Help 5 community members',
        icon: '🤝',
        tokensReward: 250,
        isUnlocked: false,
        progress: 2,
        maxProgress: 5
      },
      {
        id: 3,
        name: 'Accessibility Expert',
        description: 'Review 10 locations',
        icon: '⭐',
        tokensReward: 500,
        isUnlocked: false,
        progress: 1,
        maxProgress: 10
      }
    ];

    setActivities(mockActivities);
    setAchievements(mockAchievements);
    setTotalTokens(mockActivities.reduce((sum, activity) => sum + activity.tokensEarned, 0));
  };

  const initializeStepTracking = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(response => {
        if (response === 'granted') {
          startStepTracking();
        }
      });
    } else {
      startStepTracking();
    }
  };

  const startStepTracking = () => {
    setIsTracking(true);
    let stepCount = 0;
    
    window.addEventListener('devicemotion', (event) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        const acceleration = Math.sqrt(x*x + y*y + z*z);
        
        if (acceleration > 12) {
          stepCount++;
          setTodaysSteps(stepCount);
          
          
          if (stepCount >= dailyGoal.target && stepCount - 1 < dailyGoal.target) {
            // Goal achieved!
            earnTokens('daily_check', 'Completed daily step goal', 100);
          }
        }
      }
    });
  };

  const earnTokens = async (type: Activity['type'], description: string, tokens: number) => {
    const newActivity: Activity = {
      id: Date.now(),
      type,
      description,
      tokensEarned: tokens,
      timestamp: new Date(),
      verified: true
    };

    setActivities(prev => [newActivity, ...prev]);
    setTotalTokens(prev => prev + tokens);

    
    alert(`🎉 You earned ${tokens} WELL tokens for: ${description}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'white',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#333' }}>
          💰 Earn WELL Tokens
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Move to earn and contribute to the accessibility community
        </p>
      </div>

      
      <div style={{ padding: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
          borderRadius: '16px',
          padding: '20px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            {totalTokens.toLocaleString()} WELL
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Total Tokens Earned
          </div>
        </div>

        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Daily Step Goal</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>{todaysSteps.toLocaleString()} steps</span>
            <span>{dailyGoal.target.toLocaleString()} target</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#f0f0f0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(100, (todaysSteps / dailyGoal.target) * 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <button
            onClick={() => setIsTracking(!isTracking)}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              background: isTracking ? '#f44336' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {isTracking ? '⏸️ Stop Tracking' : '▶️ Start Tracking'}
          </button>
        </div>

        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Recent Activities</h3>
          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              Start moving to earn your first tokens!
            </div>
          ) : (
            activities.slice(0, 5).map(activity => (
              <div key={activity.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {activity.description}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {activity.timestamp.toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  background: activity.verified ? '#4CAF50' : '#FFC107',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  +{activity.tokensEarned} WELL
                </div>
              </div>
            ))
          )}
        </div>

        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Achievements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {achievements.map(achievement => (
              <div key={achievement.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: achievement.isUnlocked ? '#f8f9fa' : '#fff',
                borderRadius: '8px',
                border: achievement.isUnlocked ? '2px solid #4CAF50' : '1px solid #e0e0e0',
                opacity: achievement.isUnlocked ? 1 : 0.7
              }}>
                <div style={{
                  fontSize: '24px',
                  filter: achievement.isUnlocked ? 'none' : 'grayscale(100%)'
                }}>
                  {achievement.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {achievement.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    {achievement.description}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: '#f0f0f0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                      height: '100%',
                      background: '#4CAF50'
                    }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                    {achievement.progress}/{achievement.maxProgress}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  background: achievement.isUnlocked ? '#4CAF50' : '#ccc',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {achievement.tokensReward} WELL
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earn;