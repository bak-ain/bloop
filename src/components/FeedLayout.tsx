import { useState } from "react";
import PostCard from "./PostCard";
import { ArtistPost, FanPost } from "../types";
import styles from "./FeedLayout.module.css"

interface FeedLayoutProps<T extends ArtistPost | FanPost> {
    posts: T[];
    likedIds: string[];
    scrappedIds: string[];
    onLike: (id: string, defaultLikes: number, post: T) => void;
    onScrap: (id: string, post: T) => void;
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
        <div className={`${styles.feedContain} ${className ?? ""}`}>
           
                <div className={styles.popviewBtn}>
                    {/* <div style={{ marginBottom: 16 }}> */}
                    <button className={`${styles.popView} btn_txt`}
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
                <div className={styles.feed}>
                {paged.map(post => (
                    <PostCard
                        key={post.id}
                        data={post}
                        likedPostIds={likedIds}
                        scrappedPostIds={scrappedIds}
                        onLike={() => onLike(post.id, post.likes, post)}
                        onScrap={() => onScrap(post.id, post)}
                        onClick={() => onPostClick(post)}
                    />
                ))}
                </div>
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.paginationBtn}
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            type="button"
                            aria-label="이전 페이지"
                        >
                            <img
                                src={
                                    page === 1
                                        ? "/images/icon/page_le_off.png"
                                        : "/images/icon/page_le_on.png"
                                }
                                alt="이전"
                                style={{ width: 35, height: 35 }}
                            />
                        </button>
                        {[1, 2, 3].map(i => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`${styles.paginationBtn} ${page === i ? styles.paginationBtnActive : ""}`}
                                type="button"
                                disabled={i > totalPages}
                                tabIndex={i > totalPages ? -1 : 0}
                            >
                                {i}
                            </button>
                        ))}
                        <button
                            className={styles.paginationBtn}
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages || totalPages < 2}
                            type="button"
                            aria-label="다음 페이지"
                        >
                            <img
                                src={
                                    page === totalPages || totalPages < 2
                                        ? "/images/icon/page_ri_off.png"
                                        : "/images/icon/page_ri_on.png "
                                }
                                alt="다음"
                                style={{ width: 35, height: 35 }}
                            />
                        </button>
                    </div>
                )}
           

        </div>
    );
};

export default FeedLayout;