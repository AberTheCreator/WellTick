import React from 'react';
import NotificationIcon from '../components/Header/NotificationIcon';
import SettingsIcon from '../components/Header/SettingsIcon';
import DailyTipsBar from '../components/Header/DailyTipsBar';
import EmergencyButton from '../components/Emergency/EmergencyButton';

interface HomeProps {
  onMenu: () => void;
}

const Home: React.FC<HomeProps> = ({ onMenu }) => (
  <div style={{ padding: "16px" }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
      <NotificationIcon />
      <SettingsIcon />
      <button aria-label="Open Menu" onClick={onMenu} style={{ background: "none", border: "none" }}>
        <img src="/assets/icons/hamburger.svg" alt="Menu" width={28} />
      </button>
    </div>
    <DailyTipsBar />
    <h1>Welcome to Welltick</h1>
    <p>Your all-in-one accessibility and wellness platform.</p>
    <EmergencyButton />
  </div>
);

export default Home;