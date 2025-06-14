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

    // 팝업 타입: 'detail' | 'edit' | 'upload' | null
    const [popupType, setPopupType] = useState<'detail' | 'edit' | 'upload' | null>(null);
    const [selectedPost, setSelectedPost] = useState<FanPost | null>(null);

    // 디테일 열기
    const openDetail = (post: FanPost) => {
        setSelectedPost(post);
        setPopupType('detail');
    };

    // 수정하기 클릭 시
    const handleEdit = (post: FanPost) => {
        setSelectedPost(post);
        setPopupType('edit');
    };

    // 업로드 팝업 열기
    const openUpload = () => {
        setPopupType('upload');
        setSelectedPost(null);
    };

    // 팝업 닫기
    const handleClosePopup = () => {
        setPopupType(null);
        setSelectedPost(null);
    };

    return (
        <Container>
            <div className={styles.fanFeedContainer}>
                <button
                    className={styles.writeButton}
                    onClick={openUpload}
                >
                    <img src="/images/editBtn.png" alt="글쓰기" />
                </button>
                <PopularPost
                    posts={fanPosts}
                    onPostClick={openDetail}
                />
                <FeedLayout
                    className={styles.fanFeedLayout}
                    posts={fanPosts}
                    likedIds={fanLikedIds}
                    scrappedIds={fanScrappedIds}
                    onLike={(id, defaultLikes, post) => toggleLike("fan", id, defaultLikes, post)}
                    onScrap={(id, post) => toggleScrap("fan", id, post)}
                    onPostClick={openDetail}
                />
                {/* 디테일 팝업 */}
                {popupType === 'detail' && selectedPost && (
                    <Popup
                        type="fanFeed"
                        data={selectedPost}
                        onClose={handleClosePopup}
                        onEdit={handleEdit}
                        postList={fanPosts}
                        setPostList={setFanPosts}
                    />
                )}
                {/* 업로드 팝업 */}
                {popupType === 'upload' && (
                    <Popup
                        type="upload"
                        onClose={handleClosePopup}
                        onSubmit={(data: FanPost) => {
                            setFanPosts([data, ...fanPosts]);
                            handleClosePopup();
                        }}
                    />
                )}
                {/* 수정 팝업 */}
                {popupType === 'edit' && selectedPost && (
                    <Popup
                        type="edit"
                        data={selectedPost}
                        onClose={handleClosePopup}
                        onUpdate={(updatedPost: FanPost) => {
                            setFanPosts((prev) =>
                                prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
                            );
                            setSelectedPost(updatedPost);
                            setPopupType('detail');
                        }}
                    />
                )}
            </div>
        </Container>
    );
};

export default FanFeed;