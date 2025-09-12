import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/fonts.css';
import { getTheme, ThemeMode } from './theme/theme';
import BottomNav from './components/Navigation/BottomNav';
import HamburgerMenu from './components/Navigation/HamburgerMenu';
import NotificationIcon from './components/Header/NotificationIcon';
import SettingsIcon from './components/Header/SettingsIcon';
import DailyTipsBar from './components/Header/DailyTipsBar';
import EmergencyButton from './components/Emergency/EmergencyButton';
import Home from './pages/Home';
import Assistant from './pages/Assistant';
import Places from './pages/Places';
import Community from './pages/Community';
import Earn from './pages/Earn';
import RehabGaming from './pages/RehabGaming';

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
            <button
              className="hamburger-button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
            
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
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hamburger-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: transform var(--transition-duration);
        }

        .hamburger-button:hover {
          transform: scale(1.05);
        }

        .hamburger-line {
          width: 24px;
          height: 3px;
          background: var(--color-text-primary);
          transition: all var(--transition-duration);
          border-radius: 2px;
        }

        .header-icons {
          display: flex;
          gap: 1rem;
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
            padding: 0.75rem;
          }
          
          .main-content {
            padding-bottom: 70px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hamburger-button,
          .hamburger-line {
            transition: none;
          }
        }

        @media (prefers-color-scheme: dark) {
          .app {
            color-scheme: dark;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;