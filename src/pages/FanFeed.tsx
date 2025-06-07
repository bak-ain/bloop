import { useState } from "react";
import Container from "../components/Container";
import FeedLayout from "../components/FeedLayout";
import Popup from "../components/Popup";
import PopularPost from "../components/PopularPost";
import { FanPost } from "../types";
import { usePostList } from "../context/PostListContext";
import { useLikedScrapped } from "../context/LikedScrappedContext";
import styles from "../components/FeedLayout.module.css";

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
            <PopularPost
                posts={fanPosts}
                onPostClick={post => {
                    setSelectedPost(post);
                    setIsPopupOpen(true);
                }}/>
            <FeedLayout
                className={styles.fanFeedLayout}
                posts={fanPosts}
                likedIds={fanLikedIds}
                scrappedIds={fanScrappedIds}
                onLike={(id, defaultLikes) => toggleLike("fan", id, defaultLikes)}
                onScrap={id => toggleScrap("fan", id)}
                onPostClick={post => {
                    setSelectedPost(post);
                    setIsPopupOpen(true);
                }}
            />
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