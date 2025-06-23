import styles from './MyLayout.module.css';
import { ArtistPost, FanPost, OfficialContent, MyCommentPost } from '../types';
import { getBadgeImage } from '../utils/badge';
import { useLikedScrapped } from '../context/LikedScrappedContext';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
dayjs.extend(relativeTime);
dayjs.locale("ko");

interface MyContentsCardProps {
    items: (
        | ArtistPost
        | FanPost
        | OfficialContent
        | (MyCommentPost & { parentDescription?: string })
    )[];
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
function getFirstImage(item: ArtistPost | FanPost | OfficialContent | MyCommentPost): string | null {
    if ('media' in item && Array.isArray(item.media) && item.media.length > 0) {
        const img = item.media.find(m => m.type === 'image');
        return img?.url || null;
    }
    return null;
}
function removeImgTags(html: string) {
    return html.replace(/<img[^>]*>/gi, "");
}
// 날짜 포맷 함수
function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const now = dayjs();
    const date = dayjs(dateStr);
    if (now.diff(date, "hour") < 24) {
        return date.fromNow();
    }
    return date.format("YYYY-MM-DD");
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
                <div className={styles.emptyMsg}>
                    {type === 'written' && '작성한 게시물이 없습니다.'}
                    {type === 'comment' && '작성한 댓글이 없습니다.'}
                    {(type === 'scrap-fan' || type === 'scrap-artist' || type === 'scrap-official') && 'POP한 게시물이 없습니다.'}
                    {type === 'liked' && '좋아요한 게시물이 없습니다.'}
                </div>
            )}
            {items.map((item) => {
                const firstImage = getFirstImage(item);

                return (
                    <div
                        className={`${styles.cardWrap}
                                    ${styles[`cardWrap_${type}`]} 
                                    ${isOfficialContent(item) ? styles.cardWrap_official : ""}
                                    ${isArtistPost(item) ? styles.cardWrap_artist : ""}
                                    ${isFanPost(item) ? styles.cardWrap_fan : ""}
                                    ${isMyCommentPost(item) ? styles.cardWrap_comment : ""}`}
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
                        <div className={styles.card}>
                            {/* 내가 작성한 게시물 */}
                            {type === 'written' && (
                                <>
                                    <div className={styles.cardRow}>
                                        {/* 이미지가 있을 때만 렌더링 */}
                                        {firstImage && (
                                            <img
                                                src={firstImage}
                                                alt="게시물 이미지"
                                                className={styles.cardThumb}
                                            />
                                        )}
                                        <div className={styles.cardTextWrap}>
                                            <div
                                                className={`${styles.cardDesc} card_p`}
                                                dangerouslySetInnerHTML={{
                                                    __html: 'description' in item ? removeImgTags(item.description ?? "") : ""
                                                }}
                                            />
                                        </div>
                                        <div className={` ${styles.cardDate} pop_icon_num`}>
                                            {('date' in item && formatDate(item.date ?? "")) || ''}
                                        </div>
                                    </div>
                                    {/* <div className={styles.cardFooter}>
                                    <div className={` ${` ${styles.cardDate} pop_icon_num`} pop_icon_num`}>
                                        {('date' in item && formatDate(item.date ?? "")) || ''}
                                    </div>
                                </div> */}
                                </>
                            )}
                            {/* 내가 작성한 댓글 */}
                            {type === 'comment' && isMyCommentPost(item) && (
                                <div className={styles.commentCard}>
                                    <div className={styles.commentHeader}>
                                        <span className={styles.commentLabel}>게시물</span>
                                        <span className={styles.commentParentTitle}>
                                            {item.parentDescription ?? ''}
                                        </span>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <div
                                            className={styles.commentContent}
                                            dangerouslySetInnerHTML={{
                                                __html: item.content
                                            }}
                                        />
                                        <div className={` ${styles.cardDate} pop_icon_num`}>
                                            {('date' in item && formatDate(item.date ?? "")) || ''}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* 내가 좋아요한 게시물 */}
                            {type === 'liked' && !isMyCommentPost(item) && (
                                <>
                                    {/* 오피셜 게시물 */}
                                    {isOfficialContent(item) ? (
                                        <div className={`${styles.cardRow} ${styles.likedCardRow}`}>
                                            {firstImage && (
                                                <img
                                                    src={firstImage}
                                                    alt="오피셜 이미지"
                                                    className={styles.cardThumb}
                                                />
                                            )}
                                            <div className={` ${styles.cardTextWrap} ${styles.likedCardTextWrap} `}>
                                                <div
                                                    className={styles.officialCardTitle}
                                                    dangerouslySetInnerHTML={{
                                                        __html: (item.title ?? "").replace(/<br\s*\/?>/gi, " ")
                                                    }}
                                                />
                                                <div
                                                    className={`${styles.officialCardDesc} ${styles.cardDesc} user_txt_p_tag`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.descriptionDetail ?? ""
                                                    }}
                                                />
                                            </div>
                                            <div className={styles.CardRight}>
                                                <button
                                                    className={styles.likedCardLikeBtn}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        toggleLike('official', item.id, item.likes ?? 0, item);
                                                    }}
                                                    aria-label="좋아요 토글"
                                                >
                                                    <img
                                                        src={isLiked(item) ? "/images/icon/heart_p_icon.png" : "/images/icon/heart_icon.png"}
                                                        alt={isLiked(item) ? "좋아요됨" : "좋아요"}
                                                        className={styles.likeIcon}
                                                    />
                                                </button>
                                                <div className={` ${styles.cardDate} pop_icon_num`}>
                                                    {('date' in item && formatDate(item.date ?? "")) || ''}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // 팬/아티스트 게시물
                                        <div className={`${styles.cardRow} ${styles.likedCardRow}`}>
                                            {firstImage && (
                                                <img
                                                    src={firstImage}
                                                    alt="게시물 이미지"
                                                    className={styles.cardThumb}
                                                />
                                            )}
                                            <div className={` ${styles.cardTextWrap} ${styles.likedCardTextWrap} `}>
                                                <div className={styles.CardUserRow}>
                                                    <span className={` ${styles.likedCardUserName} card_name`}>{('user' in item && item.user?.name) || ''}</span>
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
                                                </div>
                                                <div
                                                    className={`${styles.likedCardDesc} ${styles.cardDesc} card_p`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: ('description' in item && item.description) || ''
                                                    }}
                                                />
                                            </div>
                                            <div className={styles.CardRight}>
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
                                                    <img
                                                        src={isLiked(item) ? "/images/icon/heart_p_icon.png" : "/images/icon/heart_icon.png"}
                                                        alt={isLiked(item) ? "좋아요됨" : "좋아요"}
                                                        className={styles.likeIcon}
                                                    />
                                                </button>
                                                <div className={` ${styles.cardDate} pop_icon_num`}>
                                                    {('date' in item && formatDate(item.date ?? "")) || ''}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            {/* 내가 스크랩한 게시물 */}
                            {(type === 'scrap-fan' || type === 'scrap-artist' || type === 'scrap-official') && !isMyCommentPost(item) && (
                                <div className={`${styles.cardRow} ${styles.scrapCardRow}`}>
                                    {firstImage && (
                                        <img
                                            src={firstImage}
                                            alt="게시물 이미지"
                                            className={styles.cardThumb}
                                        />
                                    )}
                                    <div className={` ${styles.cardTextWrap} ${styles.scrapCardTextWrap} `}>
                                        {(type === 'scrap-fan' || type === 'scrap-artist') && 'user' in item && (
                                            <div className={styles.CardUserRow}>
                                                <span className={` ${styles.scrapCardUserName} card_name`}>{item.user?.name}</span>
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
                                                {/* {type === 'scrap-fan' && (
                                                    <span className={styles.scrapCardUserId}>@{item.user?.userId}</span>
                                                )} */}
                                            </div>
                                        )}
                                        {type === 'scrap-official' && isOfficialContent(item) && (
                                            <>
                                                {item.title && (
                                                    <div
                                                        className={styles.officialCardTitle}
                                                        dangerouslySetInnerHTML={{
                                                            __html: (item.title ?? "").replace(/<br\s*\/?>/gi, " ")
                                                        }}
                                                    />
                                                )}

                                                {item.descriptionDetail && (
                                                    <div
                                                        className={`${styles.officialCardDesc} ${styles.cardDesc} user_txt_p_tag`}
                                                        dangerouslySetInnerHTML={{ __html: item.descriptionDetail }}
                                                    />
                                                )}
                                            </>
                                        )}
                                        <div
                                            className={`${styles.scrapCardDesc} ${styles.cardDesc} card_p`}
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    type === 'scrap-official' && isOfficialContent(item)
                                                        ? (item.description?.split('\n').slice(1).join('\n') ?? "")
                                                        : ('description' in item && item.description) || ''
                                            }}
                                        />
                                    </div>
                                    <div className={styles.CardRight}>
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
                                            <img
                                                className={styles.pop_icon}
                                                src={
                                                    isScrapped(item as ArtistPost | FanPost | OfficialContent)
                                                        ? "/images/icon/pop_p_icon.png"
                                                        : "/images/icon/pop_icon.png"
                                                }
                                                alt={
                                                    isScrapped(item as ArtistPost | FanPost | OfficialContent)
                                                        ? "스크랩 취소"
                                                        : "스크랩"
                                                }
                                            />
                                        </button>
                                        <div className={` ${styles.cardDate} pop_icon_num`}>{('date' in item && item.date) || ''}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

        </div>
    );
};

export default MyContentsCard;