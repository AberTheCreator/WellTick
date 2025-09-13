import React, { useState } from 'react';

interface EmergencyButtonProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ isOpen, onToggle }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleEmergencyPress = () => {
    setIsPressed(true);
    setShowModal(true);
    setTimeout(() => setIsPressed(false), 200);
  };

  const handleCall911 = () => {
    window.open("tel:911", "_self");
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    if (onToggle) onToggle();
  };

  return (
    <>
      {/* Floating Emergency Button */}
      <button
        onClick={onToggle || handleEmergencyPress}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: isPressed ? '#c62828' : '#e53935',
          border: '3px solid white',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(229, 57, 53, 0.4)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          transform: isPressed ? 'scale(0.95)' : 'scale(1)'
        }}
        aria-label="Emergency button - Call 911"
        title="Emergency Call 911"
      >
        🚨
      </button>

      {/* Emergency Modal */}
      {(showModal || isOpen) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '16px'
          }}
          onClick={handleCancel}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px',
              color: '#e53935'
            }}>
              🚨
            </div>
            
            <h2 style={{ 
              margin: '0 0 16px 0', 
              fontSize: '24px', 
              color: '#333' 
            }}>
              Emergency Services
            </h2>
            
            <p style={{ 
              margin: '0 0 24px 0', 
              color: '#666',
              lineHeight: '1.5'
            }}>
              Do you need immediate emergency assistance?
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleCall911}
                style={{
                  flex: 2,
                  padding: '16px',
                  background: '#e53935',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                📞 Call 911
              </button>
            </div>

            <div style={{
              marginTop: '16px',
              fontSize: '12px',
              color: '#999',
              lineHeight: '1.4'
            }}>
              Only use for genuine emergencies. For non-emergencies, 
              contact your local authorities or healthcare provider.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyButton;
