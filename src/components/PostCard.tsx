import { useEffect, useState } from "react";
import { ArtistPost, FanPost } from "../types";
import { getBadgeImage } from "../utils/badge";
import styles from "./PostCard.module.css";
import { useLikedScrapped } from "../context/LikedScrappedContext";
import { usePostList } from "../context/PostListContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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

  function getDisplayDate(dateStr: string) {
    const now = dayjs();
    const date = dayjs(dateStr);
    // 24시간(1일) 이내면 fromNow, 아니면 날짜/시간 포맷
    return now.diff(date, "hour") < 24
      ? date.fromNow()
      : date.format("YYYY.MM.DD");
  }

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
      if (found && found.comment !== commentCount) {
        setCommentCount(found.comment);
      }
    } else {
      const found = fanPosts.find((p) => p.id === data.id);
      if (found && found.comment !== commentCount) {
        setCommentCount(found.comment);
      }
    }
    // eslint-disable-next-line
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

<<<<<<< HEAD
=======

>>>>>>> ce43ac81fa2a1b2a15083309103262882cd4a294
  return (
    <div className={`${styles.post_card} ${isArtist ? styles.artist : styles.fan}`}>
      {/* 아티스트 게시물 카드 */}
      {isArtist ? (
  <div className={styles.profile_bubble_layout}>
    <>
      <img className={styles.a_profile_img} src={user.profileImage} alt={user.name} />
      <svg width="34" height="30" viewBox="0 0 17 30" className={styles.bubble_tail}>
        <path
          d="M20,0 L5,15 L20,30 Z"
          fill="#f5f5f5"
          stroke="#333333"         // ← 보더 색상(예시: 연회색)
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* 겹치는 부분 덮기 (stroke 없음, bubble_box 배경색과 동일) */}
        <rect 
          x="18.5" y="-2" width="5" height="38"
          fill="#f5f5f5"
          stroke="none"
          rx="2"  
          ry="2"
        />
      </svg>
      <div className={styles.bubble_box} onClick={goToDetail}>
        <div className={styles.infoTop}>
          <div className={styles.info}>
            <strong className="card_name">
              {user.name}
              <img
                className={styles.a_badge_img}
                src={getBadgeImage('artist')}
                alt="artist badge"
              />
            </strong>
            <p className={`day_span`}>{getDisplayDate(data.date)}</p>
          </div>
          <p className={`card_p`} dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>
        {
          data.media && (
            <div className={styles.a_media}>
              {data.media.slice(0, 2).map((m, i) =>
                m.type === "video" ? (
                  <video key={i} src={m.url} controls className={styles.a_media_item} />
                ) : (
                  <div key={i} className={styles.a_media_item_wrapper}>
                    <img src={m.url} alt={`media-${i}`} className={styles.a_media_item} />
                    {i === 1 && (data.media?.length ?? 0) > 2 && (
                      <div className={styles.a_media_overlay}>
                        +{(data.media?.length ?? 0) - 2}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )
        }
        <div className={styles.a_meta_row}>
          <button onClick={e => {
            e.stopPropagation(); // 상세보기로 버블링 방지
            handleLike();
          }}>
            <img className={styles.like_icon}
              src={liked ? "/images/icon/heart_p_icon.png" : "/images/icon/heart_icon.png"}
              alt={liked ? "좋아요 취소" : "좋아요"}
            />{" "}
            {likeCount}
          </button>
          <button onClick={goToDetail}>
            <img className={styles.chat_icon}
              src="/images/icon/message.png"
              alt="댓글"
            />{" "}
            {commentCount}
          </button>
          <button onClick={e => {
            e.stopPropagation(); // 상세보기로 버블링 방지
            handleScrap();
          }}>
            <img
              className={styles.pop_icon}
              src={scrapped ? "/images/icon/pop_p_icon.png" : "/images/icon/pop_icon.png"}
              alt={scrapped ? "스크랩 취소" : "스크랩"}
            />
          </button>
        </div>
      </div >
    </>
  </div >
      ) : (
  <>
    {/* 팬게시물카드 */}
    <div className={styles.profile_row}>
      <img className={styles.profile_img} src={user.profileImage} alt={user.name} />
      <div className={styles.info}>
        <strong className="card_name">
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
        <p className={`day_span`}>{getDisplayDate(data.date)}</p>
      </div>
    </div>
    <div className={styles.body_wrapper} onClick={goToDetail}>
      <p className={`card_p`} dangerouslySetInnerHTML={{ __html: data.description }} />
      {data.hashtag && (
        <div className={styles.hashtags}>
          {data.hashtag.split(" ").map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
      {data.media && (
        <div
          className={`${styles.media} ${data.media.length === 1 ? styles.single : styles.multi
            }`}
        >
          {data.media.slice(0, 2).map((m, i) =>
            m.type === "video" ? (
              <video key={i} src={m.url} controls className={styles.media_item} />
            ) : (
              <div key={i} className={styles.media_item_wrapper}>
                <img
                  src={m.url}
                  alt={`media-${i}`}
                  className={styles.media_item}
                />
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
    <div className={styles.meta_row}>
      <button onClick={handleLike}>
        <img className={styles.like_icon}
          src={liked ? "/images/icon/heart_p_icon.png" : "/images/icon/heart_icon.png"}
          alt={liked ? "좋아요 취소" : "좋아요"}
        />{" "}
        {likeCount}
      </button>
      <button onClick={goToDetail}>
        <img className={styles.chat_icon}
          src="/images/icon/message.png"
          alt="댓글"
        />{" "}
        {commentCount}
      </button>
      <button onClick={handleScrap}>
        <img
          className={styles.pop_icon}
          src={scrapped ? "/images/icon/pop_p_icon.png" : "/images/icon/pop_icon.png"}
          alt={scrapped ? "스크랩 취소" : "스크랩"}
        />
      </button>
    </div>
  </>
)
      }
    </div >
  );
};

export default PostCard;