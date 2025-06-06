import { useEffect, useState } from "react";
import { FanPost } from "../types";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getBadgeImage } from "../utils/badge";
import styles from "./PostCard.module.css"
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
                slidesPerView={3}
                navigation
                loop
            >
                {popularPosts.map(post => (
                    <SwiperSlide key={post.id}>
                        <div
                            style={{
                                background: "#f5f6fa",
                                borderRadius: 12,
                                padding: 16,
                                minHeight: 120
                            }}
                            onClick={() => onPostClick(post)}
                        >
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                                <img src={post.user.profileImage} alt={post.user.name} style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }} />
                                <span style={{ fontWeight: 600 }}>{post.user.name}</span>
                                <img
                                    src={getBadgeImage(post.user.badgeType, post.user.badgeLevel)}
                                    alt="badge"
                                    style={{ marginLeft: 8, width: 20, height: 20, verticalAlign: "middle" }}
                                />
                            </div>
                            <div style={{ fontSize: 14, color: "#222" }}>{post.date}</div>
                            <div style={{ marginTop: 8 }}>{post.description}</div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default PopularPost;