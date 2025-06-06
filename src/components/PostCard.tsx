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

    // user가 없을 수 있으니 안전하게 처리
    const isArtist = data.user?.badgeType === "artist";
    const [liked, setLiked] = useState(false);
    const [scrapped, setScrapped] = useState(false);

    // 좋아요 수를 context에서 관리
    const { postLikeCounts } = useLikedScrapped();
    const [likeCount, setLikeCount] = useState(
        postLikeCounts[data.id] ?? data.likes
    );
    const [commentCount, setCommentCount] = useState(data.comment);

    // 최신 liked/scrapped 상태 동기화
    useEffect(() => {
        setLiked(likedPostIds.includes(data.id));
        setScrapped(scrappedPostIds.includes(data.id));
    }, [likedPostIds, scrappedPostIds, data.id]);

    // 최신 좋아요 수 동기화
    useEffect(() => {
        setLikeCount(postLikeCounts[data.id] ?? data.likes);
    }, [postLikeCounts, data.id, data.likes]);

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
        // setLiked와 setLikeCount는 context에서 동기화되므로 별도 setState 불필요
    };

    const handleScrap = () => {
        onScrap();
        // setScrapped는 context에서 동기화되므로 별도 setState 불필요
    };

    // user가 없을 때 기본값 처리
    const user = data.user ?? {
        name: "알 수 없음",
        profileImage: "/images/3.png",
        badgeType: "fan" as const,
        badgeLevel: 1
    };

    return (
        <div className={`${styles.post_card} ${isArtist ? styles.artist : styles.fan}`}>
            {isArtist ? (
                <div className={styles.profile_bubble_layout}>
                    <img className={styles.profile_img} src={user.profileImage} alt={user.name} />
                    <div className={styles.bubble_box} onClick={goToDetail}>
                        <div className={styles.bubble_header}>
                            <strong>
                                {user.name}
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
                        <img className={styles.profile_img} src={user.profileImage} alt={user.name} />
                        <div className={styles.info}>
                            <strong>
                                {user.name}
                                <img
                                    className={styles.badge_img}
                                    src={getBadgeImage(
                                        'fan',
                                        user.badgeType === "fan" ? user.badgeLevel : undefined
                                    )}
                                    alt={
                                        user.badgeType === "fan"
                                            ? `fan badge Lv.${user.badgeLevel}`
                                            : "fan badge"
                                    }
                                />
                            </strong>
                            <p className={styles.date}>{data.date}</p>
                        </div>
                    </div>
                    <div className={styles.body_wrapper} onClick={goToDetail}>
                        <p className={styles.desc}>{data.description}</p>
                        {data.hashtag && (
                            <div className={styles.hashtags}>
                                {data.hashtag.split(" ").map((tag, i) => (
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