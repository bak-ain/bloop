import Container from "../components/Container";
import { useParams } from "react-router-dom";
import { usePostList } from "../context/PostListContext";
import { useLikedScrapped } from "../context/LikedScrappedContext";
import styles from "../components/OfficialPost.module.css";
import { useMemo } from "react";

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

    // 해당 포스트 찾기
    const post = useMemo(
        () => officialPosts.find((p) => p.id === id),
        [officialPosts, id]
    );

    if (!post) return <div style={{ padding: 80, textAlign: "center" }}>존재하지 않는 게시물입니다.</div>;

    const isLiked = officialLikedIds.includes(post.id);
    const isScrapped = officialScrappedIds.includes(post.id);
    const likeCount = postLikeCounts[post.id] ?? post.likes ?? 0;

    // 해시태그 분리
    const hashtags = post.hashtag ? post.hashtag.split(" ").filter(Boolean) : [];

    return (
        <Container>
            <div className={styles.detailWrapper} style={{ maxWidth: 900, margin: "0 auto", padding: "48px 0" }}>
                <div style={{ marginBottom: 8 }}>
                    {post.type === "new" && (
                        <span style={{ color: "#D13B5A", fontWeight: 700, fontSize: 28, marginRight: 12 }}>NEW</span>
                    )}
                    <span style={{ fontSize: 32, fontWeight: 700, verticalAlign: "middle" }} dangerouslySetInnerHTML={{ __html: post.title ?? "" }} />
                </div>
                <div style={{ color: "#666", fontSize: 15, marginBottom: 24 }}>
                    {post.date}
                </div>
                <div
                    style={{
                        background: "#f2f2f2",
                        borderRadius: 8,
                        width: "100%",
                        minHeight: 350,
                        marginBottom: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        gap: 12,
                        flexWrap: "wrap"
                    }}
                >
                    {post.media && post.media.length > 0 ? (
                        post.media.map((item, idx) =>
                            item.type === "image" ? (
                                <img
                                    key={idx}
                                    src={item.url}
                                    alt={post.title}
                                    style={{ maxWidth: "48%", maxHeight: 350, borderRadius: 8 }}
                                />
                            ) : (
                                <video
                                    key={idx}
                                    src={item.url}
                                    controls
                                    style={{ maxWidth: "48%", maxHeight: 350, borderRadius: 8 }}
                                />
                            )
                        )
                    ) : null}
                </div>
                <div style={{ fontSize: 16, color: "#222", marginBottom: 32 }}>
                    <div dangerouslySetInnerHTML={{ __html: post.descriptionDetail ?? post.description ?? "" }} />
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
                    {hashtags.map((tag, idx) => (
                        <span key={idx} style={{ color: "#2986E2", fontSize: 15 }}>#{tag.replace("#", "")}</span>
                    ))}
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    borderTop: "1px solid #eee",
                    paddingTop: 24,
                    gap: 24,
                    fontSize: 22,
                    color: "#222"
                }}>
                    <button
                        onClick={() => toggleLike("official", post.id, post.likes ?? 0)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: isLiked ? "#D13B5A" : "#888",
                            fontSize: 22,
                            display: "flex",
                            alignItems: "center"
                        }}
                        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                    >
                        <span style={{ marginRight: 6 }}>♡</span>
                        <span style={{ fontSize: 18 }}>{likeCount}</span>
                    </button>
                    <button
                        onClick={() => toggleScrap("official", post.id)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: isScrapped ? "#2986E2" : "#888",
                            fontSize: 22,
                            display: "flex",
                            alignItems: "center"
                        }}
                        aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
                    >
                        <span>★</span>
                    </button>
                    {/* 공유 버튼 등 추가 가능 */}
                </div>
            </div>
        </Container>
    );
};

export default OfficialPostDetail;