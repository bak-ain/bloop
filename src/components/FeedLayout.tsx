import { useState } from "react";
import PostCard from "./PostCard";
import { ArtistPost, FanPost } from "../types";
import styles from "./FeedLayout.module.css"


interface FeedLayoutProps<T extends ArtistPost | FanPost> {
    posts: T[];
    likedIds: string[];
    scrappedIds: string[];
    onLike: (id: string, defaultLikes: number) => void; // 수정
    onScrap: (id: string) => void;
    onPostClick: (post: T) => void;
    pageSize?: number;
    className?: string;
}

const FeedLayout = <T extends ArtistPost | FanPost>(
    {
        posts,
        likedIds,
        scrappedIds,
        onLike,
        onScrap,
        onPostClick,
        pageSize = 10,
        className,
    }: FeedLayoutProps<T>
) => {
    const [showLikedOnly, setShowLikedOnly] = useState(false);
    const [page, setPage] = useState(1);

    // 필터링
    const filtered = showLikedOnly
        ? posts.filter(post => likedIds.includes(post.id))
        : posts;

    // 페이지네이션
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className={`${styles.feedLayout} ${className ?? ""} inner`}>
            <div style={{ marginBottom: 16 }}>
                <button
                    onClick={() => {
                        setShowLikedOnly(v => {
                            // 버튼을 누를 때마다 page를 1로 초기화
                            setPage(1);
                            return !v;
                        });
                    }}
                >
                    {showLikedOnly ? "ALL VIEW" : "POP VIEW"}
                </button>
            </div>
            {paged.map(post => (
                <PostCard
                    key={post.id}
                    data={post}
                    likedPostIds={likedIds}
                    scrappedPostIds={scrappedIds}
                    // 기본 좋아요 수도 함께 전달
                    onLike={() => onLike(post.id, post.likes)}
                    onScrap={() => onScrap(post.id)}
                    onClick={() => onPostClick(post)}
                />
            ))}
            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div style={{ marginTop: 16 }}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            style={{
                                fontWeight: page === i + 1 ? "bold" : "normal",
                                marginRight: 4,
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeedLayout;