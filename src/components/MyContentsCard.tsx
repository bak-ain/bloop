import styles from './MyLayout.module.css';
import { ArtistPost, FanPost, OfficialContent, MyCommentPost } from '../types';
import { getBadgeImage } from '../utils/badge';
import { useLikedScrapped } from '../context/LikedScrappedContext';

interface MyContentsCardProps {
    items: (ArtistPost | FanPost | OfficialContent | MyCommentPost)[];
    type: 'written' | 'comment' | 'liked' | 'scrap-fan' | 'scrap-artist' | 'scrap-official';
    editMode?: boolean;
    checkedIds?: string[];
    onCheck?: (id: string) => void;
    onCardClick?: (item: any) => void;
}

function isOfficialContent(item: any): item is OfficialContent {
    return (
        item &&
        typeof item === "object" &&
        "type" in item &&
        (item.type === "new" || item.type === "imageOnly" || item.type === "feature" || item.type === "default")
    );
}
function isArtistPost(item: any): item is ArtistPost {
    return item && typeof item === "object" && "user" in item && item.user?.badgeType === "artist";
}
function isFanPost(item: any): item is FanPost {
    return item && typeof item === "object" && "user" in item && item.user?.badgeType === "fan";
}
function isMyCommentPost(item: any): item is MyCommentPost {
    return (
        item &&
        typeof item === "object" &&
        "content" in item &&
        "date" in item
    );
}

// 미디어에서 첫 번째 이미지 url 추출
function getFirstImage(item: ArtistPost | FanPost | OfficialContent | MyCommentPost): string {
    if ('media' in item && Array.isArray(item.media) && item.media.length > 0) {
        const img = item.media.find(m => m.type === 'image');
        return img?.url || "/images/default_thumb.png";
    }
    return "/images/default_thumb.png";
}

const MyContentsCard = ({
    items,
    type,
    editMode = false,
    checkedIds = [],
    onCheck,
    onCardClick
}: MyContentsCardProps) => {
    const {
        artistLikedIds, fanLikedIds, officialLikedIds,
        artistScrappedIds, fanScrappedIds, officialScrappedIds,
        toggleLike, toggleScrap
    } = useLikedScrapped();

    // 좋아요/스크랩 활성화 체크
    const isLiked = (item: ArtistPost | FanPost | OfficialContent) => {
        if (isArtistPost(item)) return artistLikedIds.includes(item.id);
        if (isFanPost(item)) return fanLikedIds.includes(item.id);
        if (isOfficialContent(item)) return officialLikedIds.includes(item.id);
        return false;
    };
    const isScrapped = (item: ArtistPost | FanPost | OfficialContent) => {
        if (isArtistPost(item)) return artistScrappedIds.includes(item.id);
        if (isFanPost(item)) return fanScrappedIds.includes(item.id);
        if (isOfficialContent(item)) return officialScrappedIds.includes(item.id);
        return false;
    };

    return (
        <div className={styles.myContentsWrap}>
            {items.length === 0 && (
                <div className={styles.emptyMsg}>데이터가 없습니다.</div>
            )}
            {items.map((item) => (
                <div
                    className={styles.card}
                    key={item.id}
                    onClick={e => {
                        // 체크박스 클릭 시 카드 onClick 무시
                        if (
                            (e.target as HTMLElement).tagName === 'INPUT' &&
                            (e.target as HTMLInputElement).type === 'checkbox'
                        ) {
                            return;
                        }
                        onCardClick && onCardClick(item);
                    }}
                    style={{ cursor: onCardClick ? "pointer" : undefined }}
                >
                    {/* 체크박스 (편집 모드) */}
                    {editMode && (
                        <input
                            type="checkbox"
                            className={styles.cardCheckbox}
                            checked={checkedIds.includes(item.id)}
                            onChange={e => {
                                e.stopPropagation();
                                onCheck && onCheck(item.id);
                            }}
                        />
                    )}
                    {/* 내가 작성한 게시물 */}
                    {type === 'written' && (
                        <>
                            <div className={styles.cardRow}>
                                <img
                                    src={getFirstImage(item)}
                                    alt="게시물 이미지"
                                    className={styles.cardThumb}
                                />
                                <div className={styles.cardTextWrap}>
                                    <div className={styles.cardDesc}>
                                        {'description' in item ? item.description ?? "" : ""}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.cardFooter}>
                                <div className={styles.cardDate}>
                                    {'date' in item ? item.date ?? "" : ""}
                                </div>
                            </div>
                        </>
                    )}
                    {/* 내가 작성한 댓글 */}
                    {type === 'comment' && isMyCommentPost(item) && (
                        <div className={styles.commentCard}>
                            <div className={styles.commentHeader}>
                                <span className={styles.commentLabel}>게시물</span>
                                <span className={styles.commentParentTitle}>{item.parentTitle ?? ''}</span>
                            </div>
                            <div className={styles.commentContent}>{item.content}</div>
                            <div className={styles.cardDate}>{item.date}</div>
                        </div>
                    )}
                    {/* 내가 좋아요한 게시물 */}
                    {type === 'liked' && !isMyCommentPost(item) && (
                        <>
                            {/* 오피셜 게시물 */}
                            {isOfficialContent(item) ? (
                                <div className={styles.likedCardRow}>
                                    <img
                                        src={getFirstImage(item)}
                                        alt="오피셜 이미지"
                                        className={styles.cardThumb}
                                    />
                                    <div className={styles.likedCardTextWrap}>
                                        <div
                                            className={styles.likedCardTitle}
                                            dangerouslySetInnerHTML={{
                                                __html: `${item.title ?? ""}${item.descriptionDetail ? `<br>${item.descriptionDetail}` : ""}`
                                            }}
                                        />
                                        <div className={styles.likedCardDesc}>
                                            {item.description ?? ""}
                                        </div>
                                    </div>
                                    <button
                                        className={styles.likedCardLikeBtn}
                                        onClick={e => {
                                            e.stopPropagation();
                                            toggleLike('official', item.id, item.likes ?? 0, item);
                                        }}
                                        aria-label="좋아요 토글"
                                    >
                                        {isLiked(item) ? "❤️" : "🤍"}
                                    </button>
                                    <div className={styles.cardDate}>{item.date ?? ""}</div>
                                </div>
                            ) : (
                                // 팬/아티스트 게시물
                                <div className={styles.likedCardRow}>
                                    <img
                                        src={getFirstImage(item)}
                                        alt="게시물 이미지"
                                        className={styles.cardThumb}
                                    />
                                    <div className={styles.likedCardTextWrap}>
                                        <div className={styles.likedCardUserRow}>
                                            <span className={styles.likedCardUserName}>{('user' in item && item.user?.name) || ''}</span>
                                            {('user' in item && item.user?.badgeType) && (
                                                <img
                                                    src={getBadgeImage(
                                                        item.user.badgeType,
                                                        (item.user as any).badgeLevel
                                                    )}
                                                    alt="뱃지"
                                                    className={styles.badgeIcon}
                                                />
                                            )}
                                            {('user' in item && item.user?.badgeType === "fan") && (
                                                <span className={styles.likedCardUserId}>@{item.user?.userId}</span>
                                            )}
                                        </div>
                                        <div className={styles.likedCardDesc}>{('description' in item && item.description) || ''}</div>
                                    </div>
                                    <button
                                        className={styles.likedCardLikeBtn}
                                        onClick={e => {
                                            e.stopPropagation();
                                            if (isArtistPost(item)) {
                                                toggleLike('artist', item.id, item.likes ?? 0, item);
                                            } else if (isFanPost(item)) {
                                                toggleLike('fan', item.id, item.likes ?? 0, item);
                                            }
                                        }}
                                        aria-label="좋아요 토글"
                                    >
                                        {isLiked(item) ? "❤️" : "🤍"}
                                    </button>
                                    <div className={styles.cardDate}>{('date' in item && item.date) || ''}</div>
                                </div>
                            )}
                        </>
                    )}
                    {/* 내가 스크랩한 게시물 */}
                    {(type === 'scrap-fan' || type === 'scrap-artist' || type === 'scrap-official') && !isMyCommentPost(item) && (
                        <div className={styles.scrapCardRow}>
                            <img
                                src={getFirstImage(item)}
                                alt="게시물 이미지"
                                className={styles.cardThumb}
                            />
                            <div className={styles.scrapCardTextWrap}>
                                {(type === 'scrap-fan' || type === 'scrap-artist') && 'user' in item && (
                                    <div className={styles.scrapCardUserRow}>
                                        <span className={styles.scrapCardUserName}>{item.user?.name}</span>
                                        {item.user?.badgeType && (
                                            <img
                                                src={getBadgeImage(
                                                    item.user.badgeType,
                                                    (item.user as any).badgeLevel
                                                )}
                                                alt="뱃지"
                                                className={styles.badgeIcon}
                                            />
                                        )}
                                        {type === 'scrap-fan' && (
                                            <span className={styles.scrapCardUserId}>@{item.user?.userId}</span>
                                        )}
                                    </div>
                                )}
                                {type === 'scrap-official' && isOfficialContent(item) && (
                                    <>
                                        <div className={styles.scrapCardTitle}>
                                            {item.title?.split('\n')[0] ?? ""}
                                        </div>
                                        {item.descriptionDetail && (
                                            <div className={styles.scrapCardDetail}>
                                                {item.descriptionDetail}
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className={styles.scrapCardDesc}>
                                    {type === 'scrap-official' && isOfficialContent(item)
                                        ? (item.description?.split('\n').slice(1).join('\n') ?? "")
                                        : ('description' in item && item.description)}
                                </div>
                            </div>
                            <div className={styles.scrapCardRight}>
                                <button
                                    className={styles.scrapBtn}
                                    onClick={e => {
                                        e.stopPropagation();
                                        if (type === 'scrap-fan' && (isFanPost(item) || isArtistPost(item))) {
                                            toggleScrap('fan', item.id, item);
                                        } else if (type === 'scrap-artist' && isArtistPost(item)) {
                                            toggleScrap('artist', item.id, item);
                                        } else if (type === 'scrap-official' && isOfficialContent(item)) {
                                            toggleScrap('official', item.id, item);
                                        }
                                    }}
                                    aria-label="스크랩 토글"
                                >
                                    {isScrapped(item as ArtistPost | FanPost | OfficialContent) ? "🔖" : "📌"}
                                </button>
                                <div className={styles.cardDate}>{('date' in item && item.date) || ''}</div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyContentsCard;