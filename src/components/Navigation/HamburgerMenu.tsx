import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import EarnIcon from '../../assets/icons/earn.svg';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('hamburger-menu');
      if (menu && !menu.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside
        id="hamburger-menu"
        className="hamburger-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Side navigation menu"
      >
        <div className="menu-header">
          <h2 className="menu-title">Welltick Menu</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="menu-nav">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/earn"
                className="menu-link"
                onClick={onClose}
                aria-label="Navigate to earn rewards section"
              >
                <EarnIcon className="menu-icon" width={24} height={24} />
                <div className="menu-text">
                  <span className="menu-label">Earn Rewards</span>
                  <span className="menu-description">Move to earn tokens and rewards</span>
                </div>
              </Link>
            </li>
            
            <li className="menu-item">
              <Link
                to="/rehab-gaming"
                className="menu-link"
                onClick={onClose}
                aria-label="Navigate to rehabilitation gaming section"
              >
                <div className="game-icon">🎮</div>
                <div className="menu-text">
                  <span className="menu-label">Rehab Gaming</span>
                  <span className="menu-description">AI-guided rehabilitation games</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="menu-footer">
          <p className="version-info">Welltick v1.0.0</p>
          <p className="accessibility-info">Accessibility-first design</p>
        </div>
      </aside>

      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1999;
          animation: fadeIn 0.3s ease-out;
        }

        .hamburger-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 320px;
          height: 100vh;
          background: var(--color-surface);
          box-shadow: var(--shadow-xl);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease-out;
        }

        .menu-header {
          padding: 2rem 1.5rem 1rem;
          border-bottom: 1px solid var(--color-text-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .menu-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--color-text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--border-radius-md);
          transition: all var(--transition-duration);
        }

        .close-button:hover,
        .close-button:focus {
          color: var(--color-primary);
          background: var(--color-accessibility-selected);
          outline: 2px solid var(--color-accessibility-focus);
        }

        .menu-nav {
          flex: 1;
          padding: 1rem 0;
        }

        .menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .menu-item {
          margin-bottom: 0.5rem;
        }

        .menu-link {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          text-decoration: none;
          color: var(--color-text-primary);
          transition: all var(--transition-duration);
          border-left: 3px solid transparent;
        }

        .menu-link:hover,
        .menu-link:focus {
          background: var(--color-accessibility-selected);
          border-left-color: var(--color-primary);
          outline: 2px solid var(--color-accessibility-focus);
          outline-offset: -2px;
        }

        .menu-icon,
        .game-icon {
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .game-icon {
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .menu-text {
          display: flex;
          flex-direction: column;
        }

        .menu-label {
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.2;
        }

        .menu-description {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          line-height: 1.3;
          margin-top: 0.25rem;
        }

        .menu-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--color-text-light);
          text-align: center;
        }

        .version-info,
        .accessibility-info {
          margin: 0;
          font-size: 0.75rem;
          color: var(--color-text-light);
          line-height: 1.4;
        }

        .accessibility-info {
          margin-top: 0.25rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        @media (max-width: 480px) {
          .hamburger-menu {
            width: 280px;
          }
          
          .menu-header {
            padding: 1.5rem 1rem 0.75rem;
          }
          
          .menu-link {
            padding: 0.875rem 1rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .overlay,
          .hamburger-menu {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export default HamburgerMenu;