import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import OfficialFeed from './pages/OfficialFeed';
import ArtistFeed from './pages/ArtistFeed';
import FanFeed from './pages/FanFeed';
import Mypage from './pages/Mypage';
import Admin from './pages/Admin';
import OfficialPostDetail from './pages/OfficialPostDetail';
import { PostListProvider } from "./context/PostListContext";
import { LikedScrappedProvider } from "./context/LikedScrappedContext";
import { CommentProvider } from './context/CommentContext';
import { ScheduleProvider } from './context/ScheduleContext';
import './App.css';

function App() {
  const location = useLocation();
  useEffect(() => {
    const shouldHide = location.pathname.startsWith("/admin");

    const observer = new MutationObserver(() => {
      const chatbase = document.querySelector("#chatbase-bubble-button") as HTMLElement;
      if (chatbase) {
        chatbase.style.display = shouldHide ? 'none' : 'block';
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [location.pathname]);
  return (
    <ScheduleProvider>
      <PostListProvider>
        <LikedScrappedProvider>
          <CommentProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/join" element={<Join />} />
              <Route path="/official" element={<OfficialFeed />} />
              <Route path="/official/:id" element={<OfficialPostDetail />} />
              <Route path="/muse" element={<ArtistFeed />} />
              <Route path="/loop" element={<FanFeed />} />
              <Route path="/mybox" element={<Mypage />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </ CommentProvider>
        </LikedScrappedProvider>
      </PostListProvider>
    </ScheduleProvider>
  );
}

export default App;
