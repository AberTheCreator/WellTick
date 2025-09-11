import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Assistant from './pages/Assistant';
import Places from './pages/Places';
import Community from './pages/Community';
import Earn from './pages/Earn';
import RehabGaming from './pages/RehabGaming';
import BottomNav from './components/Navigation/BottomNav';
import HamburgerMenu from './components/Navigation/HamburgerMenu';

function App() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <HamburgerMenu open={isMenuOpen} onClose={() => setMenuOpen(false)} />
      <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>
        <Routes>
          <Route path="/" element={<Home onMenu={() => setMenuOpen(true)} />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/places" element={<Places />} />
          <Route path="/community" element={<Community />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/rehab" element={<RehabGaming />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;