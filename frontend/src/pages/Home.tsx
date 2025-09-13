import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div style={{ 
      padding: "16px", 
      minHeight: '100vh',
      paddingBottom: '80px',
      background: '#f8f9fa'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
        borderRadius: '16px',
        padding: '32px 24px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Welcome to Welltick
        </h1>
        <p style={{ 
          margin: 0, 
          fontSize: '16px',
          opacity: 0.9,
          lineHeight: '1.5'
        }}>
          Your all-in-one accessibility and wellness platform powered by AI and Web3
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <Link 
          to="/assistant" 
          style={{
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>AI Assistant</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Get personalized help
            </p>
          </div>
        </Link>

        <Link 
          to="/places" 
          style={{
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Find Places</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Accessible locations
            </p>
          </div>
        </Link>

        <Link 
          to="/community" 
          style={{
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤝</div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Community</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Connect & share
            </p>
          </div>
        </Link>

        <Link 
          to="/earn" 
          style={{
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Earn Tokens</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Move to earn
            </p>
          </div>
        </Link>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
          Platform Features
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #007ACC'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#007ACC' }}>🔮 AI-Powered</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              Advanced AI for personalized accessibility assistance and wellness recommendations
            </p>
          </div>

          <div style={{
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #00BFA6'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#00BFA6' }}>🌐 Web3 Enabled</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              Blockchain-verified reviews and decentralized health data ownership
            </p>
          </div>

          <div style={{
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #FFC107'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#FFC107' }}>♿ Accessibility First</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              Built with comprehensive accessibility features and WCAG compliance
            </p>
          </div>

          <div style={{
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #9C27B0'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#9C27B0' }}>🏆 Gamified Health</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              Earn rewards for healthy activities and rehabilitation progress
            </p>
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
          Community Impact
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '16px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#007ACC',
              marginBottom: '4px'
            }}>
              2.5K+
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Active Users</div>
          </div>
          
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#00BFA6',
              marginBottom: '4px'
            }}>
              10.2K
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Places Reviewed</div>
          </div>
          
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#FFC107',
              marginBottom: '4px'
            }}>
              856
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Tips Shared</div>
          </div>
          
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#9C27B0',
              marginBottom: '4px'
            }}>
              1.2M
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Tokens Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
