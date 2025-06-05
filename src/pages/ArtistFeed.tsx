import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import Container from "../components/Container";
import Popup from "../components/Popup";
import { ArtistPost, FanPost } from "../types";

const ArtistFeed = () => {
  const [postList, setPostList] = useState<(ArtistPost | FanPost)[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [scrappedPostIds, setScrappedPostIds] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<ArtistPost | FanPost | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClosePopup = () => {
    setSelectedPost(null);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const storedPostList = JSON.parse(localStorage.getItem("artistPostList") || "null");
    const likedList = JSON.parse(localStorage.getItem("artistLikedPosts") || "[]");
    const scrappedList = JSON.parse(localStorage.getItem("artistScrappedPosts") || "[]");

    setLikedPostIds(likedList);
    setScrappedPostIds(scrappedList);

    if (storedPostList) {
      setPostList(storedPostList);
    } else {
      fetch("/data/posts.json")
        .then((res) => res.json())
        .then((data) => {
          setPostList(data.artist);
          localStorage.setItem("artistPostList", JSON.stringify(data.artist));
        });
    }
  }, []);

  return (
    <Container>
      {postList.map((post) => (
        <PostCard
          key={post.id}
          data={post}
          likedPostIds={likedPostIds}
          scrappedPostIds={scrappedPostIds}
          setLikedPostIds={setLikedPostIds}
          setScrappedPostIds={setScrappedPostIds}
          postList={postList}
          setPostList={setPostList}
          onClick={(post) => {
            setSelectedPost(post); // 팝업 열기용 상태
            setIsPopupOpen(true);
          }}
        />
      ))}
      {isPopupOpen && selectedPost && (
        <Popup
          type="artistFeed"
          data={selectedPost as ArtistPost}
          postList={postList as ArtistPost[]} // 명시적으로 캐스팅
          setPostList={setPostList as React.Dispatch<React.SetStateAction<ArtistPost[]>>}
          onClose={handleClosePopup}
        />
      )}
    </Container>
  );
};

export default ArtistFeed;
