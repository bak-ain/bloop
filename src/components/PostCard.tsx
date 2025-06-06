import { useEffect, useState } from "react";
import { ArtistPost, FanPost } from "../types";
import { getBadgeImage } from "../utils/badge";
import styles from "./PostCard.module.css";
import { useLikedScrapped } from "../context/LikedScrappedContext";
import { usePostList } from "../context/PostListContext";

interface PostCardProps<T extends ArtistPost | FanPost> {
    data: T;
    likedPostIds: string[];
    scrappedPostIds: string[];
    onLike: () => void;
    onScrap: () => void;
    onClick?: () => void;
}

const PostCard = <T extends ArtistPost | FanPost>({
    data,
    likedPostIds,
    scrappedPostIds,
    onLike,
    onScrap,
    onClick
}: PostCardProps<T>) => {
    const goToDetail = () => {
        if (onClick) onClick();
    };

    const isArtist = (data as ArtistPost).badgeType === "artist";
    const [liked, setLiked] = useState(false);
    const [scrapped, setScrapped] = useState(false);
    const [likeCount, setLikeCount] = useState(data.likes);
    const [commentCount, setCommentCount] = useState(data.comment);

    // 최신 liked/scrapped 상태 동기화
    useEffect(() => {
        setLiked(likedPostIds.includes(data.id));
        setScrapped(scrappedPostIds.includes(data.id));
    }, [likedPostIds, scrappedPostIds, data.id]);

    // 최신 댓글 수 동기화
    const { artistPosts, fanPosts } = usePostList();
    useEffect(() => {
        if (isArtist) {
            const found = artistPosts.find((p) => p.id === data.id);
            if (found) setCommentCount(found.comment);
        } else {
            const found = fanPosts.find((p) => p.id === data.id);
            if (found) setCommentCount(found.comment);
        }
    }, [artistPosts, fanPosts, data.id, isArtist]);

    const handleLike = () => {
        onLike();
        setLiked((prev) => !prev);
        setLikeCount((prev) => liked ? Math.max(prev - 1, 0) : prev + 1);
    };

    const handleScrap = () => {
        onScrap();
        setScrapped((prev) => !prev);
    };

    return (
        <div className={`${styles.post_card} ${isArtist ? styles.artist : styles.fan}`}>
            {isArtist ? (
                <div className={styles.profile_bubble_layout}>
                    <img className={styles.profile_img} src={data.profileImage} alt={data.name} />
                    <div className={styles.bubble_box} onClick={goToDetail}>
                        <div className={styles.bubble_header}>
                            <strong>{data.name}
                                <img
                                    className={styles.badge_img}
                                    src={getBadgeImage('artist')}
                                    alt="artist badge"
                                />
                            </strong>
                            <p className={styles.date}>{data.date}</p>
                        </div>
                        <p className={styles.desc}>{data.description}</p>
                        {data.media && (
                            <div className={styles.media}>
                                {data.media.slice(0, 2).map((m, i) =>
                                    m.type === "video" ? (
                                        <video key={i} src={m.url} controls className={styles.media_item} />
                                    ) : (
                                        <div key={i} className={styles.media_item_wrapper}>
                                            <img src={m.url} alt={`media-${i}`} className={styles.media_item} />
                                            {/* 2번째(=마지막) 이미지이면서 전체가 3개 이상일 때 +N 표시 */}
                                            {i === 1 && (data.media?.length ?? 0) > 2 && (
                                                <div className={styles.media_overlay}>
                                                    +{(data.media?.length ?? 0) - 2}
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.profile_row}>
                        <img className={styles.profile_img} src={data.profileImage} alt={data.name} />
                        <div className={styles.info}>
                            <strong>{data.name}
                                <img
                                    className={styles.badge_img}
                                    src={getBadgeImage('fan', (data as FanPost).badgeLevel)}
                                    alt={`fan badge Lv.${(data as FanPost).badgeLevel}`}
                                />
                            </strong>
                            <p className={styles.date}>{data.date}</p>
                        </div>
                    </div>
                    <div className={styles.body_wrapper} onClick={goToDetail}>
                        <p className={styles.desc}>{data.description}</p>
                        {(data as FanPost).hashtag && (
                            <div className={styles.hashtags}>
                                {(data as FanPost).hashtag?.split(" ").map((tag, i) => (
                                    <span key={i} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        )}
                        {data.media && (
                            <div className={styles.media}>
                                {data.media.slice(0, 2).map((m, i) =>
                                    m.type === "video" ? (
                                        <video key={i} src={m.url} controls className={styles.media_item} />
                                    ) : (
                                        <div key={i} className={styles.media_item_wrapper}>
                                            <img src={m.url} alt={`media-${i}`} className={styles.media_item} />
                                            {/* 2번째(=마지막) 이미지이면서 전체가 3개 이상일 때 +N 표시 */}
                                            {i === 1 && (data.media?.length ?? 0) > 2 && (
                                                <div className={styles.media_overlay}>
                                                    +{(data.media?.length ?? 0) - 2}
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className={styles.meta_row}>
                <button onClick={handleLike}>{liked ? "❤️" : "🤍"} {likeCount}</button>
                <button onClick={goToDetail}>{`💬 ${commentCount}`}</button>
                <button onClick={handleScrap}>{scrapped ? "🔖" : "📌"}</button>
            </div>
        </div>
    );
};

export default PostCard;