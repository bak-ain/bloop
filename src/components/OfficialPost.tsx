import { OfficialContent } from "../types";
import styles from "./OfficialPost.module.css";
import { useLikedScrapped } from "../context/LikedScrappedContext";
import { useNavigate } from "react-router-dom";

interface OfficialPostProps {
  data: OfficialContent;
}

const OfficialPost = ({ data }: OfficialPostProps) => {
  const {
    officialLikedIds,
    officialScrappedIds,
    toggleLike,
    toggleScrap,
    postLikeCounts,
  } = useLikedScrapped();
  const navigate = useNavigate();

  // 좋아요/스크랩 상태
  const isLiked = officialLikedIds.includes(data.id);
  const isScrapped = officialScrappedIds.includes(data.id);
  const likeCount = postLikeCounts[data.id] ?? data.likes ?? 0;

  // 카드 클릭 시 상세 페이지 이동
  const handleClick = () => {
    navigate(`/official/${data.id}`);
  };

  // 스크랩 버튼 클릭
  const handleScrap = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleScrap("official", data.id);
  };

  // 좋아요 버튼 클릭 (필요시)
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike("official", data.id, data.likes ?? 0);
  };

  switch (data.type) {
    case "new":
      // 트렌드 미디어 카드
      return (
        <div className={styles.mediaCard} onClick={handleClick}>
          <div className={styles.mediaThumb}>
            {/* 썸네일 이미지가 있다면 */}
            {data.media && data.media[0]?.url ? (
              <img src={data.media[0].url} alt={data.title} />
            ) : (
              <div className={styles.mediaThumbPlaceholder} />
            )}
            <button
              className={`${styles.scrapBtn} ${isScrapped ? styles.active : ""}`}
              onClick={handleScrap}
              aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
            >
              {/* 스크랩 아이콘 */}
              <span>★</span>
            </button>
          </div>
          <div className={styles.mediaInfo}>
            <div className={styles.mediaDate}>{data.date}</div>
            <div className={styles.mediaTitle}>{data.title}</div>
            {/* 필요시 해시태그, 좋아요 등 추가 */}
          </div>
        </div>
      );
    case "imageOnly":
      // 오피셜 포토 그리드 아이템
      return (
        <div className={styles.photoCard} onClick={handleClick}>
          {data.media && data.media[0]?.url ? (
            <img src={data.media[0].url} alt={data.title} />
          ) : (
            <div className={styles.photoPlaceholder} />
          )}
          <button
            className={`${styles.scrapBtn} ${isScrapped ? styles.active : ""}`}
            onClick={handleScrap}
            aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
          >
            <span>★</span>
          </button>
        </div>
      );
    case "feature":
      // 비하인드 카드 (좌우 레이아웃)
      return (
        <div className={styles.behindCard} onClick={handleClick}>
          <div className={styles.behindThumb}>
            {data.media && data.media[0]?.url ? (
              <img src={data.media[0].url} alt={data.title} />
            ) : (
              <div className={styles.behindThumbPlaceholder} />
            )}
            <button
              className={`${styles.scrapBtn} ${isScrapped ? styles.active : ""}`}
              onClick={handleScrap}
              aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
            >
              <span>★</span>
            </button>
          </div>
          <div className={styles.behindInfo}>
            <div className={styles.behindTitle}>{data.title}</div>
            <div className={styles.behindDesc}>{data.description}</div>
            <button
              className={styles.behindDetailBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              보러가기 <span style={{ fontSize: 14 }}>→</span>
            </button>
          </div>
        </div>
      );
    default:
      // default(메인배너)는 별도 컴포넌트에서 처리(슬라이더 등)
      return null;
  }
};

export default OfficialPost;