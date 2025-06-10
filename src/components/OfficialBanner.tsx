import { useState } from "react";
import { OfficialContent } from "../types";
import styles from "./OfficialPost.module.css";
import { useNavigate } from "react-router-dom";

interface OfficialBannerProps {
  highlights: OfficialContent[]; // type: "default"만 전달
}

const OfficialBanner = ({ highlights }: OfficialBannerProps) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  if (!highlights || highlights.length === 0) return null;
  const banner = highlights[current];

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? highlights.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === highlights.length - 1 ? 0 : prev + 1));
  };

  const handleClick = () => {
    navigate(`/official/${banner.id}`);
  };

  return (
    <div className={styles.bannerWrapper} onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className={styles.bannerImage}>
        {/* 배경 이미지가 있다면 */}
        {banner.media && banner.media[0]?.url ? (
          <img src={banner.media[0].url} alt={banner.title} className={styles.bannerImg} />
        ) : (
          <div className={styles.bannerImgPlaceholder} />
        )}
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerTitle} dangerouslySetInnerHTML={{ __html: banner.title ?? "" }} />
          {banner.description && (
            <div className={styles.bannerDesc}>{banner.description}</div>
          )}
        </div>
        {/* 좌우 네비게이션 */}
        {highlights.length > 1 && (
          <div className={styles.bannerNav}>
            <button className={styles.bannerNavBtn} onClick={e => { e.stopPropagation(); handlePrev(); }} aria-label="이전">
              &lt;
            </button>
            <button className={styles.bannerNavBtn} onClick={e => { e.stopPropagation(); handleNext(); }} aria-label="다음">
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialBanner;