import { useState } from "react";
import PostCard from "../components/PostCard";
import Container from "../components/Container";
import Popup from "../components/Popup";
import { FanPost } from "../types";
import { usePostList } from "../context/PostListContext";
import { useLikedScrapped } from "../context/LikedScrappedContext";

const FanFeed = () => {
    const { fanPosts, setFanPosts } = usePostList();
    const { fanLikedIds, fanScrappedIds, toggleLike, toggleScrap } = useLikedScrapped();
    const [selectedPost, setSelectedPost] = useState<FanPost | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleClosePopup = () => {
        setSelectedPost(null);
        setIsPopupOpen(false);
    };

    return (
        <Container>
            {fanPosts.map((post) => (
                <PostCard<FanPost>
                    key={post.id}
                    data={post}
                    likedPostIds={fanLikedIds}
                    scrappedPostIds={fanScrappedIds}
                    onLike={() => toggleLike("fan", post.id)}
                    onScrap={() => toggleScrap("fan", post.id)}
                    onClick={() => {
                        setSelectedPost(post);
                        setIsPopupOpen(true);
                    }}
                />
            ))}

            {isPopupOpen && selectedPost && (
                <Popup
                    type="fanFeed"
                    data={selectedPost}
                    onClose={handleClosePopup}
                />
            )}
        </Container>
    );
};

export default FanFeed;