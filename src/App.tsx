import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Join from './pages/auth/Join';
import OfficialFeed from './pages/feed/OfficialFeed';
import ArtistFeed from './pages/feed/ArtistFeed';
import FanFeed from './pages/feed/FanFeed';
import Mypage from './pages/user/Mypage';
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
