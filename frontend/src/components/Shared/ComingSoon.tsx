import React from 'react';

interface ComingSoonProps {
  label: string;
  description?: string;
  expectedDate?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ label, description, expectedDate }) => {
  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      textAlign: 'center',
      color: 'white',
      margin: '16px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        animation: 'float 20s infinite linear',
        opacity: 0.3
      }} />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>
          {label}
        </h3>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          display: 'inline-block',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '12px'
        }}>
          COMING SOON
        </div>
        {description && (
          <p style={{ 
            margin: '8px 0 0 0', 
            opacity: 0.9,
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {description}
          </p>
        )}
        {expectedDate && (
          <div style={{ 
            marginTop: '12px',
            fontSize: '12px',
            opacity: 0.8
          }}>
            Expected: {expectedDate}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes float {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;



