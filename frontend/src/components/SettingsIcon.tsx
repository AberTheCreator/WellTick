import React, { useState } from 'react';

interface Settings {
  colorInversion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  voiceSpeed: number;
  screenReader: boolean;
}

const SettingsIcon: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    colorInversion: false,
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    voiceSpeed: 1,
    screenReader: false
  });

  const updateSetting = async <K extends keyof Settings>(
    key: K, 
    value: Settings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      
      applySettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const applySettings = (settings: Settings) => {
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
    }[settings.fontSize];
    
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
        <img 
          src="/assets/icons/settings.svg" 
          alt="Settings" 
          width={28}
          style={{ filter: 'invert(0.3)' }}
        />
      </button>

      {showSettings && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            minWidth: '320px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}
        >
          <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Accessibility Settings</h3>
          </div>
          
          <div style={{ padding: '16px' }}>
            {/* Color Inversion */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.colorInversion}
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
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', e.target.value as Settings['fontSize'])}
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
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>High Contrast Mode</span>
              </label>
            </div>

            {/* Reduced Motion */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>Reduce Motion</span>
              </label>
            </div>

            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>
                Voice Speed: {settings.voiceSpeed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.voiceSpeed}
                onChange={(e) => updateSetting('voiceSpeed', parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.screenReader}
                  onChange={(e) => updateSetting('screenReader', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span>Screen Reader Optimized</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsIcon;
