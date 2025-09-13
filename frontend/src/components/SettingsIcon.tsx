import React, { useState } from 'react';

interface Settings {
  colorInversion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  voiceSpeed: number;
  screenReader: boolean;
}

interface SettingsIconProps {
  settings: any;
  onUpdateSettings: (settings: any) => void;
}

const SettingsIcon: React.FC<SettingsIconProps> = ({ settings, onUpdateSettings }) => {
  const [showSettings, setShowSettings] = useState(false);

  const updateSetting = async <K extends keyof Settings>(
    key: K, 
    value: Settings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    onUpdateSettings(newSettings);
    
    
    applySettings(newSettings);
  };

  const applySettings = (settings: any) => {
    const root = document.documentElement;
    
    if (settings.colorInversion) {
      root.style.filter = 'invert(1) hue-rotate(180deg)';
    } else {
      root.style.filter = 'none';
    }
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    root.style.fontSize = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '22px'
    }[settings.fontSize] || '16px';
    
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowSettings(!showSettings)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px'
        }}
        aria-label="Accessibility Settings"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {showSettings && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          minWidth: '320px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Accessibility Settings</h3>
          </div>
          
          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.colorInversion || false}
                  onChange={(e) => updateSetting('colorInversion', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>Color Inversion</span>
              </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>
                Font Size
              </label>
              <select
                value={settings.fontSize || 'medium'}
                onChange={(e) => updateSetting('fontSize', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.highContrast || false}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>High Contrast Mode</span>
              </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion || false}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>Reduce Motion</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsIcon;
