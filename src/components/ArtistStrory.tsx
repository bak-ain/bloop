import { useEffect, useState } from "react";
import styles from "./PostCard.module.css";
import type { ArtistStoryPost } from "../types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


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
            setIsSwiper(window.innerWidth <= 900);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={styles.storyContainer}>
            <div className={styles.aBannerContainer}>
                <div className={styles.banner}></div>
                <div className={styles.banner_mini}></div>
            </div>
            <div className={`${styles.storyContent} inner`}>
                {isSwiper ? (
                    <div className={styles.swiperNavWrap}>
                        {/* 왼쪽 버튼 */}
                        <button className="artist-swiper-prev" aria-label="이전 스토리"></button>
                        {/* 가운데 Swiper */}
                        <div className={styles.swiperArea}>
                            <Swiper
                                modules={[Navigation]}
                                navigation={{
                                    nextEl: ".artist-swiper-next",
                                    prevEl: ".artist-swiper-prev",
                                }}
                                spaceBetween={20}
                                breakpoints={{
                                    0: { slidesPerView: 2 },
                                    768: { slidesPerView: 3 },
                                }}
                                className={`${styles.storySwiper}`}
                                loop={true}
                                 
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
                        </div>
                        {/* 오른쪽 버튼 */}
                        <button className="artist-swiper-next" aria-label="다음 스토리"></button>
                    </div>
                ) : (
                    storyList.map(story => (
                        <div
                            className={styles.storyCard}
                            key={story.id}
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
                    ))
                )}
            </div>
        </div>
    );
};

export default ArtistStory;