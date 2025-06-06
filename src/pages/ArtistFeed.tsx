import { usePostList } from "../context/PostListContext";
import { useLikedScrapped } from "../context/LikedScrappedContext";
import PostCard from "../components/PostCard";
import Container from "../components/Container";
import Popup from "../components/Popup";
import ArtistStory from "../components/ArtistStrory";
import { ArtistPost } from "../types";
import { useState } from "react";

const ArtistFeed = () => {
  const { artistPosts, setArtistPosts } = usePostList();
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
      {artistPosts.map((post) => (
        <PostCard
          key={post.id}
          data={post}
          likedPostIds={artistLikedIds}
          scrappedPostIds={artistScrappedIds}
          onLike={() => toggleLike("artist", post.id)}
          onScrap={() => toggleScrap("artist", post.id)}
          onClick={() => {
            setSelectedPost(post);
            setIsPopupOpen(true);
          }}
        />
      ))}
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