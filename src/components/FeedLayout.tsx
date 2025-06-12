import { useState } from "react";
import PostCard from "./PostCard";
import { ArtistPost, FanPost } from "../types";
import styles from "./FeedLayout.module.css"

interface FeedLayoutProps<T extends ArtistPost | FanPost> {
    posts: T[];
    likedIds: string[];
    scrappedIds: string[];
    onLike: (id: string, defaultLikes: number) => void;
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
    const [showScrappedOnly, setShowScrappedOnly] = useState(false);
    const [page, setPage] = useState(1);

    // 필터링
    const filtered = showScrappedOnly
        ? posts.filter(post => scrappedIds.includes(post.id))
        : posts;

    // 페이지네이션
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className={`${styles.feedLayout} ${className ?? ""} inner`}>
            <div className={styles.popviewBtn}>
            {/* <div style={{ marginBottom: 16 }}> */}
                <button className={styles.popView}
                    onClick={() => {
                        setShowScrappedOnly(v => {
                            setPage(1);
                            return !v;
                        });
                    }}
                >
                    <img
                        src="/images/icon/popview.png"
                        alt="POP VIEW"
                    />
                    {showScrappedOnly ? "ALL VIEW" : "POP VIEW"}
                </button>
            </div>
            {paged.map(post => (
                <PostCard
                    key={post.id}
                    data={post}
                    likedPostIds={likedIds}
                    scrappedPostIds={scrappedIds}
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