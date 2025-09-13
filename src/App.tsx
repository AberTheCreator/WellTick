import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/fonts.css';
import { getTheme, ThemeMode } from './theme/theme';
import { Web3Provider } from './contexts/Web3Context';
import BottomNav from './components/Navigation/BottomNav';
import HamburgerMenu from './components/Navigation/HamburgerMenu';
import NotificationIcon from './components/NotificationIcon';
import SettingsIcon from './components/SettingsIcon';
import DailyTipsBar from './components/DailyTipsBar';
import EmergencyButton from './components/Emergency/EmergencyButton';

import Home from './pages/Home';
import Assistant from './pages/Assistant';
import Places from './pages/Places';
import Community from './pages/Community';
import Earn from './pages/Earn';
import RehabGaming from './pages/RehabGaming';
import Emergency from './pages/Emergency';

const WelltickLogo: React.FC<{ variant?: 'full' | 'icon' | 'text'; size?: 'small' | 'medium' | 'large' }> = ({ 
  variant = 'full', 
  size = 'medium' 
}) => {
  const sizes = {
    small: { width: 120, height: 40 },
    medium: { width: 150, height: 50 },
    large: { width: 200, height: 67 }
  };

  const currentSize = sizes[size];

  if (variant === 'icon') {
    return (
      <div style={{
        width: currentSize.height,
        height: currentSize.height,
        background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size === 'large' ? '24px' : size === 'medium' ? '18px' : '14px'
      }}>
        W
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div style={{
        fontFamily: 'var(--font-primary)',
        fontSize: size === 'large' ? '28px' : size === 'medium' ? '22px' : '18px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Welltick
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <div style={{
        width: currentSize.height,
        height: currentSize.height,
        background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size === 'large' ? '20px' : size === 'medium' ? '16px' : '12px',
        boxShadow: '0 2px 8px rgba(0, 122, 204, 0.3)'
      }}>
        W
      </div>
      <div style={{
        fontFamily: 'var(--font-primary)',
        fontSize: size === 'large' ? '24px' : size === 'medium' ? '20px' : '16px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.5px'
      }}>
        Welltick
      </div>
    </div>
  );
};

interface AppSettings {
  themeMode: ThemeMode;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorInversion: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  voiceEnabled: boolean;
  gestureControls: boolean;
}

const defaultSettings: AppSettings = {
  themeMode: 'light',
  fontSize: 'medium',
  colorInversion: false,
  dyslexicFont: false,
  reducedMotion: false,
  highContrast: false,
  voiceEnabled: false,
  gestureControls: false,
};

function App() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const savedSettings = localStorage.getItem('welltick-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse saved settings');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('welltick-settings', JSON.stringify(settings));
    applyAccessibilitySettings();
  }, [settings]);

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    const theme = getTheme(settings.themeMode);
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value);
      } else {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--color-${key}-${subKey}`, subValue);
        });
      }
    });

    root.style.setProperty('--font-size-base', getFontSizeValue(settings.fontSize));
    
    if (settings.colorInversion) {
      root.style.filter = 'invert(1) hue-rotate(180deg)';
    } else {
      root.style.filter = 'none';
    }

    if (settings.dyslexicFont) {
      document.body.className = 'dyslexic-friendly';
    } else if (settings.highContrast) {
      document.body.className = 'accessibility-enhanced';
    } else {
      document.body.className = 'font-primary';
    }

    if (settings.reducedMotion) {
      root.style.setProperty('--transition-duration', '0ms');
    } else {
      root.style.setProperty('--transition-duration', '250ms');
    }
  };

  const getFontSizeValue = (size: string) => {
    switch (size) {
      case 'small': return '14px';
      case 'large': return '20px';
      case 'extra-large': return '24px';
      default: return '16px';
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <Web3Provider>
      <Router>
        <div className="app" style={{ 
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--font-size-base)',
          minHeight: '100vh',
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text-primary)'
        }}>
          <header className="app-header">
            <div className="header-container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  className="hamburger-button"
                  onClick={() => setIsMenuOpen(true)}
                  aria-label="Open menu"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                >
                  <span style={{
                    width: '24px',
                    height: '3px',
                    background: 'var(--color-text-primary)',
                    transition: 'all 0.3s',
                    borderRadius: '2px'
                  }}></span>
                  <span style={{
                    width: '24px',
                    height: '3px',
                    background: 'var(--color-text-primary)',
                    transition: 'all 0.3s',
                    borderRadius: '2px'
                  }}></span>
                  <span style={{
                    width: '24px',
                    height: '3px',
                    background: 'var(--color-text-primary)',
                    transition: 'all 0.3s',
                    borderRadius: '2px'
                  }}></span>
                </button>
                
                <WelltickLogo variant="full" size="medium" />
              </div>
              
              <div className="header-icons">
                <NotificationIcon 
                  notifications={notifications} 
                  onClearAll={() => setNotifications([])}
                />
                <SettingsIcon 
                  settings={settings}
                  onUpdateSettings={updateSettings}
                />
              </div>
            </div>
            
            <DailyTipsBar />
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/places" element={<Places />} />
              <Route path="/community" element={<Community />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/rehab-gaming" element={<RehabGaming />} />
              <Route path="/emergency" element={<Emergency />} />
            </Routes>
          </main>

          <EmergencyButton 
            isOpen={isEmergencyModalOpen}
            onToggle={() => setIsEmergencyModalOpen(!isEmergencyModalOpen)}
          />

          <BottomNav />

          <HamburgerMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>

        <style jsx>{`
          .app {
            transition: all var(--transition-duration) ease-in-out;
          }

          .app-header {
            position: sticky;
            top: 0;
            background: var(--color-surface);
            box-shadow: var(--shadow-md);
            z-index: 100;
          }

          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .hamburger-button:hover {
            background: var(--color-accessibility-selected);
          }

          .header-icons {
            display: flex;
            gap: 16px;
            align-items: center;
          }

          .main-content {
            flex: 1;
            padding-bottom: 80px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }

          @media (max-width: 768px) {
            .header-container {
              padding: 12px 16px;
            }
            
            .main-content {
              padding-bottom: 70px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .hamburger-button span,
            .app {
              transition: none;
            }
          }
        `}</style>
      </Router>
    </Web3Provider>
  );
}

export default App;
export { WelltickLogo };    }}>
      <div style={{
        width: currentSize.height,
        height: currentSize.height,
        background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size === 'large' ? '20px' : size === 'medium' ? '16px' : '12px',
        boxShadow: '0 2px 8px rgba(0, 122, 204, 0.3)'
      }}>
        W
      </div>
      <div style={{
        fontFamily: 'var(--font-primary)',
        fontSize: size === 'large' ? '24px' : size === 'medium' ? '20px' : '16px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.5px'
      }}>
        Welltick
      </div>
    </div>
  );
};

interface AppSettings {
  themeMode: ThemeMode;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorInversion: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  voiceEnabled: boolean;
  gestureControls: boolean;
}

const defaultSettings: AppSettings = {
  themeMode: 'light',
  fontSize: 'medium',
  colorInversion: false,
  dyslexicFont: false,
  reducedMotion: false,
  highContrast: false,
  voiceEnabled: false,
  gestureControls: false,
};

function App() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const savedSettings = localStorage.getItem('welltick-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse saved settings');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('welltick-settings', JSON.stringify(settings));
    applyAccessibilitySettings();
  }, [settings]);

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    const theme = getTheme(settings.themeMode);
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value);
      } else {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--color-${key}-${subKey}`, subValue);
        });
      }
    });

    root.style.setProperty('--font-size-base', getFontSizeValue(settings.fontSize));
    
    if (settings.colorInversion) {
      root.style.filter = 'invert(1) hue-rotate(180deg)';
    } else {
      root.style.filter = 'none';
    }

    if (settings.dyslexicFont) {
      document.body.className = 'dyslexic-friendly';
    } else if (settings.highContrast) {
      document.body.className = 'accessibility-enhanced';
    } else {
      document.body.className = 'font-primary';
    }

    if (settings.reducedMotion) {
      root.style.setProperty('--transition-duration', '0ms');
    } else {
      root.style.setProperty('--transition-duration', '250ms');
    }
  };

  const getFontSizeValue = (size: string) => {
    switch (size) {
      case 'small': return '14px';
      case 'large': return '20px';
      case 'extra-large': return '24px';
      default: return '16px';
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <Router>
      <div className="app" style={{ 
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--font-size-base)',
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text-primary)'
      }}>
        <header className="app-header">
          <div className="header-container">
            {/* Left side - Logo and Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                className="hamburger-button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  borderRadius: '8px',
                  transition: 'background 0.2s'
                }}
              >
                <span style={{
                  width: '24px',
                  height: '3px',
                  background: 'var(--color-text-primary)',
                  transition: 'all 0.3s',
                  borderRadius: '2px'
                }}></span>
                <span style={{
                  width: '24px',
                  height: '3px',
                  background: 'var(--color-text-primary)',
                  transition: 'all 0.3s',
                  borderRadius: '2px'
                }}></span>
                <span style={{
                  width: '24px',
                  height: '3px',
                  background: 'var(--color-text-primary)',
                  transition: 'all 0.3s',
                  borderRadius: '2px'
                }}></span>
              </button>
              
              
              <WelltickLogo variant="full" size="medium" />
            </div>
            
            
            <div className="header-icons">
              <NotificationIcon 
                notifications={notifications} 
                onClearAll={() => setNotifications([])}
              />
              <SettingsIcon 
                settings={settings}
                onUpdateSettings={updateSettings}
              />
            </div>
          </div>
          
          <DailyTipsBar />
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/places" element={<Places />} />
            <Route path="/community" element={<Community />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/rehab-gaming" element={<RehabGaming />} />
            <Route path="/emergency" element={<Emergency />} />
          </Routes>
        </main>

        <EmergencyButton 
          isOpen={isEmergencyModalOpen}
          onToggle={() => setIsEmergencyModalOpen(!isEmergencyModalOpen)}
        />

        <BottomNav />

        <HamburgerMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      </div>

      <style jsx>{`
        .app {
          transition: all var(--transition-duration) ease-in-out;
        }

        .app-header {
          position: sticky;
          top: 0;
          background: var(--color-surface);
          box-shadow: var(--shadow-md);
          z-index: 100;
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hamburger-button:hover {
          background: var(--color-accessibility-selected);
        }

        .header-icons {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .main-content {
          flex: 1;
          padding-bottom: 80px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 12px 16px;
          }
          
          .main-content {
            padding-bottom: 70px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hamburger-button span,
          .app {
            transition: none;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;
export { WelltickLogo };
