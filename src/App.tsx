import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import OfficialFeed from './pages/OfficialFeed';
import ArtistFeed from './pages/ArtistFeed';
import FanFeed from './pages/FanFeed';
import Mypage from './pages/Mypage';
import Admin from './pages/Admin';
import { PostListProvider } from "./context/PostListContext";
import { LikedScrappedProvider } from "./context/LikedScrappedContext";
import { CommentProvider } from './context/CommentContext';
// import './App.css';

function App() {
  return (
    <PostListProvider>
      <LikedScrappedProvider>
        <CommentProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/official" element={<OfficialFeed />} />
            <Route path="/muse" element={<ArtistFeed />} />
            <Route path="/loop" element={<FanFeed />} />
            <Route path="/mybox" element={<Mypage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </ CommentProvider>
      </LikedScrappedProvider>
    </PostListProvider>
  );
}

export default App;
