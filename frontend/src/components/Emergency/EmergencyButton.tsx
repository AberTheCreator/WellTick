import React from 'react';

const EmergencyButton = () => (
  <button
    style={{
      display: "block",
      margin: "24px auto",
      padding: "16px 32px",
      background: "#e53935",
      color: "#fff",
      fontWeight: "bold",
      border: "none",
      borderRadius: "8px",
      fontSize: "1.1rem",
      cursor: "pointer"
    }}
    onClick={() => window.open("tel:911")}
  >
    🚨 Emergency Call 911
  </button>
);

export default EmergencyButton;