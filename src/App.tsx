import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import OfficialFeed from './pages/OfficialFeed';
import ArtistFeed from './pages/ArtistFeed';
import FanFeed from './pages/FanFeed';
import Mypage from './pages/Mypage';
import Admin from './pages/Admin';
import MyEcho from './pages/MyEcho';
import MyPop from './pages/MyPop';
import MyMood from './pages/MyMood';
import LevelGuide from './pages/LevelGuide';
import OfficialPostDetail from './pages/OfficialPostDetail';
import ScrollToTop from "./components/ScrollToTop";
/* 은님추가 */
import GradeStatus from './components/GradeStatus';
/* -------- */
import { PostListProvider } from "./context/PostListContext";
import { LikedScrappedProvider } from "./context/LikedScrappedContext";
import { CommentProvider } from './context/CommentContext';
import { ScheduleProvider } from './context/ScheduleContext';
import { MyContentProvider } from './context/MyContentContext';
import { UserProvider } from './context/UserContext ';
import './App.css';

function App() {
  const location = useLocation();
  const [posts, setPosts] = useState<any>(null);



  useEffect(() => {
    const shouldHide = location.pathname.startsWith("/admin");

    if (!posts) return;

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
  }, [location.pathname, posts]);
  
  useEffect(() => {
    fetch("/data/posts.json")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);
  if (!posts) return null;

  return (
    <UserProvider>
      <ScrollToTop />
      <ScheduleProvider>
        <PostListProvider>
          <LikedScrappedProvider posts={posts}>
            <CommentProvider>
              <MyContentProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/join" element={<Join />} />
                  {/* 은님추가 */}
                  <Route path="/gradeStatus" element={<GradeStatus />} />
                  {/* -------- */}
                  <Route path="/official" element={<OfficialFeed />} />
                  <Route path="/official/:id" element={<OfficialPostDetail />} />
                  <Route path="/muse" element={<ArtistFeed />} />
                  <Route path="/loop" element={<FanFeed />} />
                  <Route path="/mybox" element={<Mypage />} />
                  <Route path="/mypop" element={<MyPop />} />
                  <Route path="/myecho" element={<MyEcho />} />
                  <Route path="/mymood" element={<MyMood />} />
                  <Route path="/levelguide" element={<LevelGuide />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </MyContentProvider>
            </CommentProvider>
          </LikedScrappedProvider>
        </PostListProvider>
      </ScheduleProvider>
    </UserProvider>
  );
}

export default App;
