import { useEffect, useState } from "react";
import { FanPost } from "../types";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import { getBadgeImage } from "../utils/badge";
import styles from "./PostCard.module.css";
import "swiper/css";
import "swiper/css/navigation";



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
    <div className={`${styles.popularPostContainer} all_p_t`}>
      <div className={`${styles.popularBannerContainer}`}>
        <div className={`${styles.popularBanner}`}></div>
        <div className={`${styles.popularBanner_mini}`}></div>
      </div>
      <div className={`${styles.popularPostContent}`}>
        <div className={styles.popularTitle}>
          <h2 className='artist_h1'>TOP LOOP</h2>
          <img src="/images/icon/sticker1.png" alt="눈스티커" />
        </div>
        <div className={styles.popularSwiperCon}>
          <div className={styles.swiperNavWrap}>
            <button className="popular-swiper-prev" aria-label="이전"></button>
            <div className={styles.swiperArea}>
              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                pagination={{
                  el: ".popular-swiper-pagination",
                  clickable: true
                }}
                navigation={{
                  nextEl: ".popular-swiper-next",
                  prevEl: ".popular-swiper-prev"
                }}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false
                }}
                spaceBetween={8}
                loop={popularPosts.length > 3}
                slidesPerGroup={2}
                breakpoints={{
                  0: { slidesPerView: 2, slidesPerGroup: 2 },
                  768: { slidesPerView: 3, slidesPerGroup: 2 }
                }}
              >
                {popularPosts.map(post => (
                  <SwiperSlide key={post.id}
                    /* style={{ width: "clamp(140px, 28vw, 320px)" }} */>
                    <div className={styles.popularCardAll}>
                      <div
                        className={styles.popularCard}
                        onClick={() => onPostClick(post)}
                      >
                        <div className={styles.popularCardHeader}>
                          <img src={post.user.profileImage} alt={post.user.name} className={styles.popularCardAvatar} />
                          <div className={styles.popularCardInfo}>
                            <div className={styles.popularCardPro}>
                              <span className={`${styles.popularCardName} fan_top_name`}>{post.user.name}</span>
                              <img
                                src={getBadgeImage(post.user.badgeType, post.user.badgeLevel)}
                                alt="badge"
                                className={styles.popularCardBadge}
                              />
                            </div>
                            <div className={`${styles.popularCardDate} fan_top_day`}>{post.date}</div>
                          </div>
                        </div>
                        <div className={`${styles.popularCardDesc} fan_top_p`}>{post.description}</div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="popular-swiper-pagination"></div>
            </div>
            <button className="popular-swiper-next" aria-label="다음"></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularPost;