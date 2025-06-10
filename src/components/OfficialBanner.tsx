import { useNavigate } from "react-router-dom";
import { OfficialContent } from "../types";
import styles from "./OfficialPost.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface OfficialBannerProps {
  highlights: OfficialContent[];
}

const OfficialBanner = ({ highlights }: OfficialBannerProps) => {
  const navigate = useNavigate();

  if (!highlights || highlights.length === 0) return null;

  return (
    <div className={styles.bannerWrapper}>
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation // Swiper가 기본 좌우 버튼을 자동 생성
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        className={styles.bannerSwiper}
      >
        {highlights.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className={styles.bannerImage}
              onClick={() => navigate(`/official/${banner.id}`)}
              style={{ cursor: "pointer" }}
            >
              {banner.media && banner.media[0]?.url ? (
                <img
                  src={banner.media[0].url}
                  alt={banner.title}
                  className={styles.bannerImg}
                />
              ) : (
                <div className={styles.bannerImgPlaceholder} />
              )}
              <div className={styles.bannerOverlay}>
                <div
                  className={styles.bannerTitle}
                  dangerouslySetInnerHTML={{ __html: banner.title ?? "" }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default OfficialBanner;