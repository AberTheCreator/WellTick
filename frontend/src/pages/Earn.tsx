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
      // Initialize step tracking
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
        tokens