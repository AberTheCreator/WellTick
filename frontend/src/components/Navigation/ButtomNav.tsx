import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const icons = {
  home: '/assets/icons/home.svg',
  community: '/assets/icons/community.svg',
  places: '/assets/icons/places.svg',
  emergency: '/assets/icons/emergency.svg',
  assistant: '/assets/icons/assistant.svg',
};

const BottomNav = () => {
  const navigate = useNavigate();
  const loc = useLocation();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      background: "#fff",
      borderTop: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "8px 0",
      zIndex: 10
    }}>
      <img src={icons.places} alt="Places" width={32} style={{ cursor: "pointer" }} onClick={() => navigate("/places")} />
      <img src={icons.community} alt="Community" width={32} style={{ cursor: "pointer" }} onClick={() => navigate("/community")} />
      <img src={icons.home} alt="Home" width={40} style={{ cursor: "pointer", margin: "0 12px" }} onClick={() => navigate("/")} />
      <img src={icons.emergency} alt="Emergency" width={32} style={{ cursor: "pointer" }} onClick={() => navigate("/emergency")} />
      <img src={icons.assistant} alt="Assistant" width={32} style={{ cursor: "pointer" }} onClick={() => navigate("/assistant")} />
    </nav>
  );
};

export default BottomNav;