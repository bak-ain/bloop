import { usePostList } from "../context/PostListContext";
import { useLikedScrapped } from "../context/LikedScrappedContext";
import FeedLayout from "../components/FeedLayout";
import Container from "../components/Container";
import Popup from "../components/Popup";
import ArtistStory from "../components/ArtistStrory";
import { ArtistPost } from "../types";
import { useState } from "react";
import styles from "../components/FeedLayout.module.css";

const ArtistFeed = () => {
  const { artistPosts } = usePostList();
  const { artistLikedIds, artistScrappedIds, toggleLike, toggleScrap } = useLikedScrapped();
  const [selectedPost, setSelectedPost] = useState<ArtistPost | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClosePopup = () => {
    setSelectedPost(null);
    setIsPopupOpen(false);
  };

  return (
    <Container>
      <ArtistStory onStoryClick={(story) => {
        setSelectedPost(story);
        setIsPopupOpen(true);
      }} />
      <FeedLayout
        className={styles.artistFeedLayout}
        posts={artistPosts}
        likedIds={artistLikedIds}
        scrappedIds={artistScrappedIds}
        onLike={(id, defaultLikes) => toggleLike("artist", id, defaultLikes)}
        onScrap={id => toggleScrap("artist", id)}
        onPostClick={post => {
          setSelectedPost(post);
          setIsPopupOpen(true);
        }}
      />
      {isPopupOpen && selectedPost && (
        <Popup
          type="artistFeed"
          data={selectedPost}
          onClose={handleClosePopup}
        />
      )}
    </Container>
  );
};

export default ArtistFeed;