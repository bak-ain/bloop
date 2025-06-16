import { useEffect, useState } from "react";
import styles from "./PostCard.module.css";
import type { ArtistStoryPost } from "../types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


interface ArtistStoryProps {
    onStoryClick: (story: ArtistStoryPost) => void;
}

const ArtistStory = ({ onStoryClick }: ArtistStoryProps) => {
    const [storyList, setStoryList] = useState<ArtistStoryPost[]>([]);
    const [isSwiper, setIsSwiper] = useState(false);

    useEffect(() => {
        fetch("/data/story.json")
            .then(res => res.json())
            .then(data => setStoryList(data));
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsSwiper(window.innerWidth <= 1024); // 1024px 이하에서만 Swiper
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const isMobile = isSwiper;

    return (
        <div className={styles.storyContainer}>
            <div className={styles.aBannerContainer}>
                <div className={styles.banner}></div>
                <div className={styles.banner_mini}></div>
            </div>
            <div className={`${styles.storyContent} inner`}>
                {isMobile ? (
                    <div className={styles.swiperNavWrap}>
                        <div className={styles.swiperArea}>
                            <Swiper
                                modules={[Pagination, /* Autoplay */]}
                                pagination={{
                                    el: ".artist-swiper-pagination",
                                    clickable: true
                                }}
                                slidesPerView={3}
                                spaceBetween={16}

                                breakpoints={{
                                    0: { slidesPerView: 2 },

                                    600: { slidesPerView: 3 },

                                }}
                                loop={storyList.length > 2}
                               /*  autoplay={{
                                    delay: 2000,
                                    disableOnInteraction: false
                                }} */
                            >
                                {storyList.map(story => (
                                    <SwiperSlide key={story.id}>
                                        <div
                                            className={styles.storyCard}
                                            onClick={() => onStoryClick(story)}
                                        >
                                            <div className={styles.stroyTop}>
                                                <div className={`${styles.storyProfile} ${story.user.name ? styles[story.user.name.toLowerCase()] : ""}`}>
                                                    <img
                                                        className={styles.profileImage}
                                                        src={story.user.profileImage}
                                                        alt={story.user.name}
                                                    />
                                                </div>
                                                <img
                                                    className={styles.storyImage}
                                                    src={story.thumbnail}
                                                    alt={story.user.name}
                                                />
                                            </div>
                                            <div className={`${styles.storyName} artist_top`}>
                                                {story.user.name}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {/* 페이지네이션 dot */}
                            <div className="artist-swiper-pagination"></div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.storyGrid}>
                        {storyList.slice(0, 4).map(story => (
                            <div
                                key={story.id}
                                className={styles.storyCard}
                                onClick={() => onStoryClick(story)}
                            >
                                <div className={styles.stroyTop}>
                                    <div className={`${styles.storyProfile} ${story.user.name ? styles[story.user.name.toLowerCase()] : ""}`}>
                                        <img
                                            className={styles.a_profileImage}
                                            src={story.user.profileImage}
                                            alt={story.user.name}
                                        />
                                    </div>
                                    <img
                                        className={styles.storyImage}
                                        src={story.thumbnail}
                                        alt={story.user.name}
                                    />
                                </div>
                                <div className={`${styles.storyName} artist_top`}>
                                    {story.user.name}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/*   <button className="artist-swiper-next" aria-label="다음 스토리"></button> */}
            </div>
        </div>
    );
};

export default ArtistStory;