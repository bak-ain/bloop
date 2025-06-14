import { useEffect, useState } from "react";
import { FanPost } from "../types";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getBadgeImage } from "../utils/badge";
import styles from "./PostCard.module.css";
import "swiper/swiper-bundle.css";
import "swiper/css";
SwiperCore.use([Navigation]);

interface PopularPostProps {
  posts: FanPost[];
  onPostClick: (post: FanPost) => void;
}

const PopularPost = ({ posts, onPostClick }: PopularPostProps) => {
  const [popularPosts, setPopularPosts] = useState<FanPost[]>([]);

  useEffect(() => {
    fetch("/data/posts.json")
      .then(res => res.json())
      .then(json => {
        const fanPosts: FanPost[] = json.fan;
        const sorted = [...fanPosts].sort((a, b) => b.likes - a.likes);
        setPopularPosts(sorted.slice(0, 10));
      });
  }, []);

  return (
    <>
      <div className={`${styles.popularPostContainer} all_p_t`}>
        <div className={styles.popularBanner}>
        </div>
        <div className={`${styles.popularPostContent}`}>
          <div className={styles.popularTitle}>
            <h2 className="h3_tit">TOP LOOP</h2>
            <img src="/images/icon/sticker1.png" alt="눈스티커" />
          </div>
          <div className={styles.popularSwiperCon}>
            <button className={styles.prevBtn + " custom-swiper-prev"} aria-label="이전"></button>
            <button className={styles.nextBtn + " custom-swiper-next"} aria-label="다음"></button>
            <Swiper
              className={`${styles.popularSwiper} popularSwiper`}
              spaceBetween={10}
              slidesPerView={Math.min(3, popularPosts.length)}
              navigation={{
                nextEl: ".custom-swiper-next",
                prevEl: ".custom-swiper-prev"
              }}
              loop={popularPosts.length > 3}
            >
              {popularPosts.map(post => (
                <SwiperSlide key={post.id}>
                  <div className={styles.popularCardAll}>
                    <div
                      className={styles.popularCard}
                      onClick={() => onPostClick(post)}
                    >
                      <div className={styles.popularCardHeader}>
                        <img src={post.user.profileImage} alt={post.user.name} className={styles.popularCardAvatar} />
                        <div className="styles.popularCardInfo">
                          <span className={styles.popularCardName}>{post.user.name}</span>
                          <img
                            src={getBadgeImage(post.user.badgeType, post.user.badgeLevel)}
                            alt="badge"
                            className={styles.popularCardBadge}
                          />
                          <div className={styles.popularCardDate}>{post.date}</div>
                        </div>
                      </div>
                      <div className={styles.popularCardDesc}>{post.description}</div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopularPost;