import styles from './MyLayout.module.css';
import { UserContentBase, MyCommentPost, MyLikedPost, MyScrapPost } from '../types';
import { getBadgeImage } from '../utils/badge';
import { useLikedScrapped } from '../context/LikedScrappedContext';

interface MyContentsCardProps {
    items: (UserContentBase | MyCommentPost)[];
    type: 'written' | 'comment' | 'liked' | 'scrap-fan' | 'scrap-artist' | 'scrap-official';
}

const MyContentsCard = ({ items, type }: MyContentsCardProps) => {
    const {
        artistLikedIds, fanLikedIds, officialLikedIds,
        artistScrappedIds, fanScrappedIds, officialScrappedIds,
        toggleLike, toggleScrap
    } = useLikedScrapped();

    // 좋아요/스크랩 여부 체크 함수
    const isLiked = (item: MyLikedPost) => {
        if (item.type === 'artist') return artistLikedIds.includes(item.id);
        if (item.type === 'community') return fanLikedIds.includes(item.id);
        if (item.type === 'agency') return officialLikedIds.includes(item.id);
        return false;
    };
    const isScrapped = (item: MyScrapPost) => {
        if (item.scrapCategory === 'artist') return artistScrappedIds.includes(item.id);
        if (item.scrapCategory === 'community') return fanScrappedIds.includes(item.id);
        if (item.scrapCategory === 'agency') return officialScrappedIds.includes(item.id);
        return false;
    };

    return (
        <div className={styles.myContentsWrap}>
            {items.length === 0 && (
                <div className={styles.emptyMsg}>데이터가 없습니다.</div>
            )}
            {items.map((item) => (
                <div className={styles.card} key={item.id}>
                    {/* 내가 작성한 게시물 */}
                    {type === 'written' && (
                        <>
                            <div className={styles.cardRow}>
                                <img
                                    src={(item as UserContentBase).imageUrls?.[0] || "/images/default_thumb.png"}
                                    alt="게시물 이미지"
                                    className={styles.cardThumb}
                                />
                                <div className={styles.cardTextWrap}>
                                    <div className={styles.cardDesc}>{(item as UserContentBase).description}</div>
                                </div>
                            </div>
                            <div className={styles.cardFooter}>
                                <div className={styles.cardDate}>{(item as UserContentBase).date}</div>
                            </div>
                        </>
                    )}
                    {/* 내가 작성한 댓글 */}
                    {type === 'comment' && (
                        <div className={styles.commentCard}>
                            <div className={styles.commentHeader}>
                                <span className={styles.commentLabel}>게시물</span>
                                <span className={styles.commentParentTitle}>{(item as MyCommentPost).parentTitle}</span>
                            </div>
                            <div className={styles.commentContent}>{(item as MyCommentPost).content}</div>
                            <div className={styles.cardDate}>{(item as MyCommentPost).date}</div>
                        </div>
                    )}
                    {/* 내가 좋아요한 게시물 */}
                    {type === 'liked' && (
                        <>
                            <div className={styles.likedCardRow}>
                                <img
                                    src={(item as MyLikedPost).imageUrls?.[0] || "/images/default_thumb.png"}
                                    alt="게시물 이미지"
                                    className={styles.cardThumb}
                                />
                                <div className={styles.likedCardTextWrap}>
                                    <div className={styles.likedCardUserRow}>
                                        <span className={styles.likedCardUserName}>{(item as MyLikedPost).author?.name}</span>
                                        {(item as MyLikedPost).author?.badgeType && (
                                            <img
                                                src={getBadgeImage(
                                                    (item as MyLikedPost).author!.badgeType,
                                                    (item as MyLikedPost).author!.badgeLevel
                                                )}
                                                alt="뱃지"
                                                className={styles.badgeIcon}
                                            />
                                        )}
                                        {(item as MyLikedPost).author?.badgeType === "fan" && (
                                            <span className={styles.likedCardUserId}>@{(item as MyLikedPost).author?.userId}</span>
                                        )}
                                    </div>
                                    <div className={styles.likedCardDesc}>{(item as MyLikedPost).description}</div>
                                </div>
                                <button
                                    className={styles.likedCardLikeBtn}
                                    onClick={() => toggleLike(
                                        (item as MyLikedPost).type === 'artist'
                                            ? 'artist'
                                            : (item as MyLikedPost).type === 'community'
                                                ? 'fan'
                                                : 'official',
                                        item.id,
                                        (item as MyLikedPost).likes
                                    )}
                                    aria-label="좋아요 토글"
                                >
                                    {isLiked(item as MyLikedPost) ? "❤️" : "🤍"}
                                </button>
                                <div className={styles.cardDate}>{(item as MyLikedPost).date}</div>
                            </div>
                        </>
                    )}
                    {(type === 'scrap-fan' || type === 'scrap-artist' || type === 'scrap-official') && (
                        <div className={styles.scrapCardRow}>
                            {/* 게시물 이미지 */}
                            <img
                                src={(item as MyScrapPost).imageUrls?.[0] || "/images/default_thumb.png"}
                                alt="게시물 이미지"
                                className={styles.cardThumb}
                            />

                            {/* 가운데: 팬/아티스트/오피셜 분기 */}
                            <div className={styles.scrapCardTextWrap}>
                                {/* 팬/아티스트: 유저 정보 */}
                                {(type === 'scrap-fan' || type === 'scrap-artist') && (
                                    <div className={styles.scrapCardUserRow}>
                                        <span className={styles.scrapCardUserName}>{(item as MyScrapPost).author?.name}</span>
                                        {(item as MyScrapPost).author?.badgeType && (
                                            <img
                                                src={getBadgeImage(
                                                    (item as MyScrapPost).author!.badgeType,
                                                    (item as MyScrapPost).author!.badgeLevel
                                                )}
                                                alt="뱃지"
                                                className={styles.badgeIcon}
                                            />
                                        )}
                                        {/* 팬만 유저아이디 */}
                                        {type === 'scrap-fan' && (
                                            <span className={styles.scrapCardUserId}>@{(item as MyScrapPost).author?.userId}</span>
                                        )}
                                    </div>
                                )}
                                {/* 오피셜: 타이틀 */}
                                {type === 'scrap-official' && (
                                    <div className={styles.scrapCardTitle}>{(item as MyScrapPost).description.split('\n')[0]}</div>
                                )}
                                {/* 디스크립션(공통) */}
                                <div className={styles.scrapCardDesc}>
                                    {type === 'scrap-official'
                                        ? (item as MyScrapPost).description.split('\n').slice(1).join('\n')
                                        : (item as MyScrapPost).description}
                                </div>
                            </div>

                            {/* 오른쪽: 스크랩 버튼 + 날짜 */}
                            <div className={styles.scrapCardRight}>
                                <button
                                    className={styles.scrapBtn}
                                    onClick={() =>
                                        toggleScrap(
                                            type === 'scrap-fan'
                                                ? 'fan'
                                                : type === 'scrap-artist'
                                                    ? 'artist'
                                                    : 'official',
                                            item.id
                                        )
                                    }
                                    aria-label="스크랩 토글"
                                >
                                    {isScrapped(item as MyScrapPost) ? "🔖" : "📌"}
                                </button>
                                <div className={styles.cardDate}>{(item as MyScrapPost).date}</div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyContentsCard;