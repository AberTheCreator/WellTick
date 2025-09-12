import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '../../assets/icons/home.svg';
import CommunityIcon from '../../assets/icons/community.svg';
import PlacesIcon from '../../assets/icons/places.svg';
import EmergencyIcon from '../../assets/icons/emergency.svg';
import AssistantIcon from '../../assets/icons/assistant.svg';
import DynamicIcon from '../Shared/DynamicIcon';
<DynamicIcon 
  name={item.iconName} 
  isActive={isActive}
  size={24}
/>

interface NavItem {
  path: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  label: string;
  ariaLabel: string;
}

const navItems: NavItem[] = [
  {
    path: '/places',
    icon: PlacesIcon,
    label: 'Places',
    ariaLabel: 'Navigate to accessible places'
  },
  {
    path: '/community',
    icon: CommunityIcon,
    label: 'Community',
    ariaLabel: 'Navigate to community forum'
  },
  {
    path: '/',
    icon: HomeIcon,
    label: 'Home',
    ariaLabel: 'Navigate to home page'
  },
  {
    path: '/assistant',
    icon: AssistantIcon,
    label: 'Assistant',
    ariaLabel: 'Navigate to AI assistant'
  },
  {
    path: '/emergency',
    icon: EmergencyIcon,
    label: 'Emergency',
    ariaLabel: 'Access emergency contacts and services'
  }
];

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav 
      className="bottom-nav"
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="nav-list">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="icon-container">
                  <IconComponent 
                    className="nav-icon"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--color-surface);
          border-top: 1px solid var(--color-text-light);
          padding: 0.5rem 0;
          z-index: 1000;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-list {
          display: flex;
          justify-content: space-around;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .nav-item {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: var(--color-text-secondary);
          transition: all var(--transition-duration);
          padding: 0.5rem;
          border-radius: var(--border-radius-md);
          min-height: 60px;
          justify-content: center;
          position: relative;
        }

        .nav-link:hover,
        .nav-link:focus {
          color: var(--color-primary);
          background: var(--color-accessibility-selected);
          outline: 2px solid var(--color-accessibility-focus);
          outline-offset: 2px;
        }

        .nav-link.active {
          color: var(--color-primary);
          font-weight: 600;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 3px;
          background: var(--color-primary);
          border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
        }

        .icon-container {
          margin-bottom: 0.25rem;
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          transition: all var(--transition-duration);
        }

        .nav-link:hover .nav-icon,
        .nav-link.active .nav-icon {
          transform: scale(1.1);
        }

        .nav-label {
          font-size: 0.75rem;
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
        }

        @media (max-width: 480px) {
          .nav-label {
            font-size: 0.65rem;
          }
          
          .nav-icon {
            width: 20px;
            height: 20px;
          }
          
          .nav-link {
            min-height: 50px;
            padding: 0.25rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-link,
          .nav-icon {
            transition: none;
          }
        }

        @media (max-width: 768px) {
          .bottom-nav {
            padding: 0.25rem 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;