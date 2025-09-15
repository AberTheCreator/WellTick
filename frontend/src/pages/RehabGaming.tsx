
import React, { useState, useEffect, useRef } from 'react';
import ComingSoon from '../components/Shared/ComingSoon';

interface GameScore {
  gameId: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  improvements: string[];
  timestamp: Date;
  blockchainHash?: string;
}

interface RehabGame {
  id: string;
  name: string;
  description: string;
  type: 'motor' | 'cognitive' | 'speech' | 'visual' | 'balance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  requiredEquipment: string[];
  targetConditions: string[];
  isAvailable: boolean;
  icon: string;
  color: string;
}

const RehabGaming: React.FC = () => {
  const [availableGames, setAvailableGames] = useState<RehabGame[]>([]);
  const [userScores, setUserScores] = useState<GameScore[]>([]);
  const [selectedGame, setSelectedGame] = useState<RehabGame | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initializeGames();
    fetchUserProgress();
  }, []);

  const initializeGames = () => {
    const games: RehabGame[] = [
      {
        id: 'hand-eye-coordination',
        name: 'Hand-Eye Coordination Trainer',
        description: 'Interactive exercises to improve hand-eye coordination using gesture recognition',
        type: 'motor',
        difficulty: 'beginner',
        estimatedTime: 15,
        requiredEquipment: ['Camera'],
        targetConditions: ['Stroke Recovery', 'Parkinson\'s', 'Motor Impairment'],
        isAvailable: true,
        icon: '✋',
        color: '#4CAF50'
      },
      {
        id: 'memory-match',
        name: 'Cognitive Memory Match',
        description: 'Memory and pattern recognition games with adaptive difficulty',
        type: 'cognitive',
        difficulty: 'intermediate',
        estimatedTime: 20,
        requiredEquipment: [],
        targetConditions: ['Dementia', 'TBI', 'Cognitive Decline'],
        isAvailable: true,
        icon: '🧠',
        color: '#2196F3'
      },
      {
        id: 'speech-therapy',
        name: 'Speech Articulation Practice',
        description: 'AI-powered speech therapy with real-time feedback',
        type: 'speech',
        difficulty: 'beginner',
        estimatedTime: 25,
        requiredEquipment: ['Microphone'],
        targetConditions: ['Aphasia', 'Dysarthria', 'Speech Delay'],
        isAvailable: false,
        icon: '🗣️',
        color: '#FF9800'
      },
      {
        id: 'visual-tracking',
        name: 'Visual Tracking Exercises',
        description: 'Eye movement and visual perception training',
        type: 'visual',
        difficulty: 'intermediate',
        estimatedTime: 18,
        requiredEquipment: ['Eye Tracking (Optional)'],
        targetConditions: ['Visual Impairment', 'Hemianopia', 'Visual Processing'],
        isAvailable: false,
        icon: '👁️',
        color: '#9C27B0'
      },
      {
        id: 'balance-trainer',
        name: 'Balance & Stability Training',
        description: 'Motion-controlled balance exercises with fall prevention',
        type: 'balance',
        difficulty: 'advanced',
        estimatedTime: 30,
        requiredEquipment: ['Motion Sensor', 'Stable Surface'],
        targetConditions: ['Vestibular Disorders', 'Fall Risk', 'Mobility Issues'],
        isAvailable: false,
        icon: '⚖️',
        color: '#607D8B'
      }
    ];

    setAvailableGames(games);
  };

  const fetchUserProgress = async () => {
    try {
      
      const mockScores: GameScore[] = [
        {
          gameId: 'hand-eye-coordination',
          score: 850,
          accuracy: 92,
          timeSpent: 14,
          improvements: ['Reaction time improved by 15%', 'Precision increased'],
          timestamp: new Date(Date.now() - 86400000),
          blockchainHash: '0xabc123...'
        }
      ];
      setUserScores(mockScores);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const startGame = async (game: RehabGame) => {
    if (!game.isAvailable) return;
    
    setSelectedGame(game);
    setIsGameActive(true);
    setGameStartTime(new Date());
    setCurrentScore(0);
    
   
    if (game.id === 'hand-eye-coordination') {
      initializeHandEyeGame();
    } else if (game.id === 'memory-match') {
      initializeMemoryGame();
    }
  };

  const initializeHandEyeGame = () => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    
    let targets: Array<{x: number, y: number, radius: number, hit: boolean}> = [];
    let score = 0;
    
    const createTarget = () => {
      targets.push({
        x: Math.random() * (canvas.width - 60) + 30,
        y: Math.random() * (canvas.height - 60) + 30,
        radius: 20,
        hit: false
      });
    };
    
    const drawTargets = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      targets.forEach(target => {
        if (!target.hit) {
          ctx.beginPath();
          ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#4CAF50';
          ctx.fill();
          ctx.strokeStyle = '#2E7D32';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    };
    
    const gameLoop = () => {
      if (!isGameActive) return;
      
      drawTargets();
      
      
      if (Math.random() < 0.02) {
        createTarget();
      }
      
      
      targets = targets.filter(target => !target.hit);
      
      requestAnimationFrame(gameLoop);
    };
    
    canvas.onclick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
      
      targets.forEach(target => {
        const distance = Math.sqrt((clickX - target.x) ** 2 + (clickY - target.y) ** 2);
        if (distance <= target.radius && !target.hit) {
          target.hit = true;
          score += 10;
          setCurrentScore(score);
        }
      });
    };
    
    gameLoop();
  };

  const initializeMemoryGame = () => {
    
    console.log('Memory game initialized');
  };

  const endGame = async () => {
    if (!selectedGame || !gameStartTime) return;
    
    const timeSpent = Math.round((Date.now() - gameStartTime.getTime()) / 1000);
    const accuracy = currentScore > 0 ? Math.min(100, currentScore / 10) : 0;
    
    const gameScore: GameScore = {
      gameId: selectedGame.id,
      score: currentScore,
      accuracy,
      timeSpent,
      improvements: generateImprovements(currentScore, accuracy),
      timestamp: new Date()
    };
    
    
    try {
      const response = await fetch('/api/rehab/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameScore)
      });
      
      if (response.ok) {
        const result = await response.json();
        gameScore.blockchainHash = result.transactionHash;
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
    
    setUserScores(prev => [...prev, gameScore]);
    setIsGameActive(false);
    setSelectedGame(null);
  };

  const generateImprovements = (score: number, accuracy: number): string[] => {
    const improvements = [];
    if (accuracy > 80) improvements.push('Excellent accuracy achieved!');
    if (score > 100) improvements.push('Great improvement in reaction time');
    if (accuracy < 60) improvements.push('Focus on precision over speed');
    return improvements;
  };

  const getProgressPercentage = (gameId: string) => {
    const scores = userScores.filter(s => s.gameId === gameId);
    if (scores.length === 0) return 0;
    
    const latestScore = scores[scores.length - 1];
    return Math.min(100, latestScore.accuracy);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8f9fa',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'white',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#333' }}>
          🎮 Rehabilitation Gaming
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          AI-powered therapeutic games for personalized rehabilitation
        </p>
      </div>

      
      {isGameActive && selectedGame ? (
        <div style={{
          padding: '16px',
          minHeight: 'calc(100vh - 160px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            width: '100%',
            maxWidth: '600px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>
                {selectedGame.icon} {selectedGame.name}
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  padding: '8px 16px',
                  background: '#4CAF50',
                  color: 'white',
                  borderRadius: '20px',
                  fontWeight: 'bold'
                }}>
                  Score: {currentScore}
                </div>
                <button
                  onClick={endGame}
                  style={{
                    padding: '8px 16px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  End Game
                </button>
              </div>
            </div>

            {selectedGame.id === 'hand-eye-coordination' && (
              <div>
                <p style={{ marginBottom: '16px', color: '#666' }}>
                  Click on the green targets as they appear. Improve your hand-eye coordination!
                </p>
                <canvas
                  ref={gameCanvasRef}
                  width={560}
                  height={400}
                  style={{
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'crosshair',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          <div style={{ padding: '16px' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Your Progress</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                    {userScores.length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Sessions</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
                    {Math.round(userScores.reduce((acc, s) => acc + s.accuracy, 0) / Math.max(1, userScores.length))}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Avg Accuracy</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
                    {Math.round(userScores.reduce((acc, s) => acc + s.timeSpent, 0) / 60)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Minutes Played</div>
                </div>
              </div>
            </div>

            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {availableGames.map((game) => (
                <div
                  key={game.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    opacity: game.isAvailable ? 1 : 0.6,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {!game.isAvailable && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      COMING SOON
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: game.color,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {game.icon}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{game.name}</h3>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {game.type} • {game.estimatedTime}min • {game.difficulty}
                      </div>
                    </div>
                  </div>

                  <p style={{ 
                    fontSize: '14px', 
                    color: '#666', 
                    lineHeight: '1.4',
                    marginBottom: '12px'
                  }}>
                    {game.description}
                  </p>

                  {game.targetConditions.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                        Target Conditions:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {game.targetConditions.map((condition, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '2px 6px',
                              background: '#e3f2fd',
                              color: '#1976d2',
                              borderRadius: '8px',
                              fontSize: '10px'
                            }}
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {game.requiredEquipment.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                        Equipment: {game.requiredEquipment.join(', ')}
                      </div>
                    </div>
                  )}

                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Progress</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        {getProgressPercentage(game.id)}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: '#f0f0f0',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div
                        style={{
                          width: `${getProgressPercentage(game.id)}%`,
                          height: '100%',
                          background: game.color,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => game.isAvailable ? startGame(game) : null}
                    disabled={!game.isAvailable}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: game.isAvailable 
                        ? `linear-gradient(135deg, ${game.color}, ${game.color}dd)` 
                        : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: game.isAvailable ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {game.isAvailable ? '🎮 Start Game' : '⏳ Coming Soon'}
                  </button>
                </div>
              ))}
            </div>

            
            <div style={{ marginTop: '32px' }}>
              <ComingSoon
                label="Advanced Rehabilitation Features"
                description="VR Integration • Multi-player Therapy Sessions • AI Progress Analysis • Telehealth Integration • Custom Exercise Creator • Biometric Monitoring"
                expectedDate="Q2 2026"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RehabGaming;

