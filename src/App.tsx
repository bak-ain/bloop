import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import OfficialFeed from './pages/OfficialFeed';
import ArtistFeed from './pages/ArtistFeed';
import FanFeed from './pages/FanFeed';
import Mypage from './pages/Mypage';
// import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/officialfeed" element={<OfficialFeed />} />
      <Route path="/artistfeed" element={<ArtistFeed />} />
      <Route path="/fanfeed" element={<FanFeed />} />
      <Route path="/mypage" element={<Mypage />} />
    </Routes>
  );
}

export default App;
