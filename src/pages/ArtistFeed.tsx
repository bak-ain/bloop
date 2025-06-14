import { usePostList } from "../context/PostListContext";
import { useLikedScrapped } from "../context/LikedScrappedContext";
import FeedLayout from "../components/FeedLayout";
import Container from "../components/Container";
import Popup from "../components/Popup";
import ArtistStory from "../components/ArtistStrory";
import { ArtistPost, ArtistStoryPost } from "../types";
import { useState, useEffect } from "react";
import { getBadgeImage } from "../utils/badge";
import styles from "../components/FeedLayout.module.css";

// StoryPopup 추가
const StoryPopup = ({ story, onClose }: { story: ArtistStoryPost; onClose: () => void }) => {
  // 팝업이 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  // 공유 버튼 클릭 핸들러
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${story.user.name}의 스토리`,
        url: window.location.href,
      }).catch(() => { });
    } else {
      // fallback: 클립보드 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    }
  };

  return (
    <div className={styles.storyPopupOverlay}>
      <div
        className={styles.storyPopup}
        style={{
          backgroundImage: `url(${story.media[0].url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className={styles.storyPopupContent}>
          <div className={styles.storyHeader}>
            <div className={styles.storyHeaderLeft}>
              <div className={`${styles.storyPopUpProfile} ${story.user.name ? styles[story.user.name.toLowerCase()] : ""}`}>
                <img src={story.user.profileImage} alt={story.user.name} className={styles.profileImg} />
              </div>
              <div className={styles.storyHeaderTxt}>
                <span className={`{${styles.userName}} card_name`}>{story.user.name}
                  <img
                    src={getBadgeImage(story.user.badgeType)}
                    alt="badge"
                    className={styles.badgeImg}
                  />
                </span>
                <span className={`${styles.timeAgo} day_span`}>{story.date}</span>
              </div>
            </div>
            {/* 공유 버튼과 닫기 버튼을 같은 부모에 넣음 */}
            <div className={styles.storyHeaderRight}>
              <button className={styles.shareBtn} onClick={handleShare}>
                <img src="/images/icon/share_icon_w.png" alt="share" />
              </button>
              <button className={styles.closeBtn} onClick={onClose}>X</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArtistFeed = () => {
  const { artistPosts } = usePostList();
  const { artistLikedIds, artistScrappedIds, toggleLike, toggleScrap } = useLikedScrapped();
  const [selectedPost, setSelectedPost] = useState<ArtistPost | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<ArtistStoryPost | null>(null);

  const handleClosePopup = () => {
    setSelectedPost(null);
    setIsPopupOpen(false);
  };
  const handleCloseStoryPopup = () => {
    setSelectedStory(null);
  };

  return (
    <Container>
      <div className={styles.artistFeedContainer}>
        <ArtistStory
          onStoryClick={(story) => {
            setSelectedStory(story);
          }}
        />
        {selectedStory && (
          <StoryPopup story={selectedStory} onClose={handleCloseStoryPopup} />
        )}
        <FeedLayout
          className={styles.artistFeedLayout}
          posts={artistPosts}
          likedIds={artistLikedIds}
          scrappedIds={artistScrappedIds}
          onLike={(id, defaultLikes, post) => toggleLike("artist", id, defaultLikes, post)}
          onScrap={(id, post) => toggleScrap("artist", id, post)}
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
            postList={artistPosts}
            setPostList={() => { }}
          />
        )}
      </div>
    </Container>
  );
};

export default ArtistFeed;