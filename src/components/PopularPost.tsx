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
        <div className="inner">
            <h2>인기 게시물</h2>
            <Swiper
                spaceBetween={16}
                slidesPerView={Math.min(3, popularPosts.length)}
                navigation
                loop={popularPosts.length > 3}
            >
                {popularPosts.map(post => (
                    <SwiperSlide key={post.id}>
                        <div
                            className={styles.popularCard}
                            onClick={() => onPostClick(post)}
                        >
                            <div className={styles.popularCardHeader}>
                                <img src={post.user.profileImage} alt={post.user.name} className={styles.popularCardAvatar} />
                                <span className={styles.popularCardName}>{post.user.name}</span>
                                <img
                                    src={getBadgeImage(post.user.badgeType, post.user.badgeLevel)}
                                    alt="badge"
                                    className={styles.popularCardBadge}
                                />
                            </div>
                            <div className={styles.popularCardDate}>{post.date}</div>
                            <div className={styles.popularCardDesc}>{post.description}</div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default PopularPost;