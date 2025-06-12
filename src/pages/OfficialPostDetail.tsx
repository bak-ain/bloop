import React, { useMemo, useState } from "react";
import Container from "../components/Container";
import { useParams } from "react-router-dom";
import { usePostList } from "../context/PostListContext";
import { useLikedScrapped } from "../context/LikedScrappedContext";
import styles from "../components/OfficialPost.module.css";

const OfficialPostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { officialPosts } = usePostList();
    const {
        officialLikedIds,
        officialScrappedIds,
        toggleLike,
        toggleScrap,
        postLikeCounts,
    } = useLikedScrapped();

    const [showShare, setShowShare] = useState(false);

    // 해당 포스트 찾기
    const post = useMemo(
        () => officialPosts.find((p) => p.id === id),
        [officialPosts, id]
    );

    if (!post) return <div className={styles.notFound}>존재하지 않는 게시물입니다.</div>;

    const isLiked = officialLikedIds.includes(post.id);
    const isScrapped = officialScrappedIds.includes(post.id);
    const likeCount = postLikeCounts[post.id] ?? post.likes ?? 0;

    // 해시태그 분리
    const hashtags = post.hashtag ? post.hashtag.split(" ").filter(Boolean) : [];

    // 공유하기
    const shareUrl = window.location.href;
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                url: shareUrl,
            });
        } else {
            setShowShare(true);
        }
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setShowShare(false);
        alert("링크가 복사되었습니다!");
    };

    return (
        <Container>
            <div className={`${styles.detailWrapper} inner`}>
                <div className={`${styles.detailTop} `}>
                    <div className={`${styles.detailTxt} `}>
                        <div className={`${styles.detailHeader} office_h3_tit`}>
                            <h3
                                className={`${styles.detailTitle} office_h3_tit`}
                                dangerouslySetInnerHTML={{ __html: post.title ?? "" }}
                            />
                        </div>
                        <div className={`${styles.detailDate} day_span`}>{post.date}</div>
                    </div>

                    <div className={styles.detailMedia}>
                        {post.media && post.media.length > 0 ? (
                            post.media.map((item, idx) =>
                                item.type === "image" ? (
                                    <img
                                        key={idx}
                                        src={item.url}
                                        alt={post.title}
                                        className={styles.detailImg}
                                    />
                                ) : (
                                    <video
                                        key={idx}
                                        src={item.url}
                                        controls
                                        autoPlay
                                        loop
                                        muted
                                        className={styles.detailVideo}
                                        poster={item.thumbnail}
                                    />
                                )
                            )
                        ) : null}
                    </div>
                </div>
                <div className={`${styles.detailBotttomTxt} `}>
                    <div className={`${styles.detailDesc} offic_detail_p`}>
                        <div dangerouslySetInnerHTML={{ __html: post.descriptionDetail ?? post.description ?? "" }} />
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.detailBottom}>

                        <div className={`${styles.detailHashtags} office_tag`}>
                            {hashtags.map((tag, idx) => (
                                <span key={idx} className={styles.detailHashtag}>#{tag.replace("#", " ")}</span>
                            ))}
                        </div>
                        <div className={styles.detailActions}>
                            <button
                                onClick={() => toggleScrap("official", post.id)}
                                className={styles.detailScrapBtn}
                                aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
                            >
                                <img
                                    src={isScrapped ? "/images/icon/pop_on_icon.png" : "/images/icon/pop_icon.png"}
                                    alt={isScrapped ? "스크랩 해제" : "스크랩"}
                                    className={`${styles.officePopImg}`}
                                />
                            </button>
                            <button
                                onClick={() => toggleLike("official", post.id, post.likes ?? 0)}
                                className={styles.detailLikeBtn}
                                aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                            >
                                <img
                                    src={isLiked ? "/images/icon/heart_p_icon.png" : "/images/icon/heart_icon.png"}
                                    alt={isLiked ? "좋아요 취소" : "좋아요"}

                                    className={`${styles.officeHeartImg}`}
                                />
                            </button>
                            <button
                                onClick={handleShare}
                                className={styles.detailShareBtn}
                                aria-label="공유하기"
                                type="button"
                            >
                                <img src="/images/icon/share_icon.png" alt="공유하기" className={`${styles.officeShare_icon}`} />
                            </button>
                            {showShare && (
                                <div className={styles.sharePopup}>
                                    <div className={styles.shareUrl}>{shareUrl}</div>
                                    <button className={styles.copyBtn} onClick={handleCopy}>링크 복사</button>
                                    <button className={styles.closeBtn} onClick={() => setShowShare(false)}>닫기</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </Container>
    );
};

export default OfficialPostDetail;