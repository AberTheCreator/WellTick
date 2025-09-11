import React from 'react';
import { useNavigate } from 'react-router-dom';
import ComingSoon from '../Shared/ComingSoon';

interface Props {
  open: boolean;
  onClose: () => void;
}
const HamburgerMenu: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 20,
        display: 'flex'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "250px",
          height: "100%",
          background: "#fff",
          padding: "32px 16px",
          boxShadow: "2px 0 12px rgba(0,0,0,0.08)"
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3>Menu</h3>
        <hr />
        <MenuItem icon="/assets/icons/earn.svg" text="Earn (Move to Earn)" onClick={() => {}} />
        <MenuItem icon="/assets/icons/hamburger.svg" text="Rehab Gaming" onClick={() => {}} />
        <ComingSoon label="Rehab Gaming" />
      </div>
    </div>
  );
};

function MenuItem({ icon, text, onClick }: { icon: string, text: string, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", margin: "14px 0" }}
    >
      <img src={icon} alt={text} width={28} />
      <span>{text}</span>
    </div>
  );
}

export default HamburgerMenu;