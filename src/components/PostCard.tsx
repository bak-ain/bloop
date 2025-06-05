import { useEffect, useState } from "react";
import { ArtistPost, FanPost, CommentPost } from "../types";
import { getBadgeImage } from "../utils/badge";
import styles from "./PostCard.module.css";
import { updateLikeStatus, updateScrapStatus } from "../utils/postUtils"; // 유틸 사용

interface PostCardProps {
    data: ArtistPost | FanPost;
    likedPostIds: string[];
    scrappedPostIds: string[];
    setLikedPostIds: React.Dispatch<React.SetStateAction<string[]>>;
    setScrappedPostIds: React.Dispatch<React.SetStateAction<string[]>>;
    postList: (ArtistPost | FanPost)[];
    setPostList: React.Dispatch<React.SetStateAction<(ArtistPost | FanPost)[]>>;
    onClick?: (post: ArtistPost | FanPost) => void;
}

const PostCard = ({
    data,
    likedPostIds,
    scrappedPostIds,
    setLikedPostIds,
    setScrappedPostIds,
    postList,
    setPostList,
    onClick
}: PostCardProps) => {
    const goToDetail = () => {
        if (onClick) onClick(data);
    };

    const isArtist = data.badgeType === "artist";
    const feedType = isArtist ? "artist" : "fan";

    const [liked, setLiked] = useState(false);
    const [scrapped, setScrapped] = useState(false);
    const [likeCount, setLikeCount] = useState(data.likes);
    const [commentCount, setCommentCount] = useState(data.comment);

    // 초기 liked/scrapped 상태 설정
    useEffect(() => {
        setLiked(likedPostIds.includes(data.id));
        setScrapped(scrappedPostIds.includes(data.id));
    }, [likedPostIds, scrappedPostIds, data.id]);

    // ✅ 댓글 수: postList에서 최신값 동기화
    useEffect(() => {
        const found = postList.find((p) => p.id === data.id);
        if (found) setCommentCount(found.comment);
    }, [postList, data.id]);

    const toggleLike = () => {
        const isNowLiked = !liked;
        const result = updateLikeStatus(data, isNowLiked, likedPostIds, postList, feedType);
        setLiked(isNowLiked);
        setLikeCount((prev) => isNowLiked ? prev + 1 : Math.max(prev - 1, 0));
        setLikedPostIds(result.updatedLikes);
        setPostList(result.updatedPostList);
    };

    const toggleScrap = () => {
        const isNowScrapped = !scrapped;
        const result = updateScrapStatus(data, isNowScrapped, scrappedPostIds, postList, feedType);
        setScrapped(isNowScrapped);
        setScrappedPostIds(result.updatedScraps);
        setPostList(result.updatedPostList);
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
                                {data.media.map((m, i) =>
                                    m.type === "video" ? (
                                        <video key={i} src={m.url} controls className={styles.media_item} />
                                    ) : (
                                        <img key={i} src={m.url} alt={`media-${i}`} className={styles.media_item} />
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
                                    src={getBadgeImage('fan', data.badgeLevel)}
                                    alt={`fan badge Lv.${data.badgeLevel}`}
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
                                {data.media.map((m, i) =>
                                    m.type === "video" ? (
                                        <video key={i} src={m.url} controls className={styles.media_item} />
                                    ) : (
                                        <img key={i} src={m.url} alt={`media-${i}`} className={styles.media_item} />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className={styles.meta_row}>
                <button onClick={toggleLike}>{liked ? "❤️" : "🤍"} {likeCount}</button>
                <button onClick={goToDetail}>{`💬 ${commentCount}`}</button>
                <button onClick={toggleScrap}>{scrapped ? "🔖" : "📌"}</button>
            </div>
        </div>
    );
};

export default PostCard;
