import React, { useEffect, useState } from "react";
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
    return now.diff(date, "hour") < 24
      ? date.fromNow()
      : date.format("YYYY.MM.DD");
  }

  const isArtist = data.user?.badgeType === "artist";
  const [liked, setLiked] = useState(false);
  const [scrapped, setScrapped] = useState(false);

  const { postLikeCounts } = useLikedScrapped();
  const [likeCount, setLikeCount] = useState(
    postLikeCounts[data.id] ?? data.likes
  );
  const [commentCount, setCommentCount] = useState(data.comment);

  useEffect(() => {
    setLiked(likedPostIds.includes(data.id));
    setScrapped(scrappedPostIds.includes(data.id));
  }, [likedPostIds, scrappedPostIds, data.id]);

  useEffect(() => {
    setLikeCount(postLikeCounts[data.id] ?? data.likes);
  }, [postLikeCounts, data.id, data.likes]);

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

  const handleLike = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onLike();
  };

  const handleScrap = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onScrap();
  };

  const user = data.user ?? {
    name: "알 수 없음",
    profileImage: "/images/3.png",
    badgeType: "fan" as const,
    badgeLevel: 1
  };
  function useIsMobile(breakpoint = 767) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth <= breakpoint);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, [breakpoint]);
    return isMobile;
  }
  const isMobile = useIsMobile();

  if (isArtist) {
    return (
      <div className={`${styles.post_card} ${styles.artist}`}>
        <div className={styles.profile_bubble_layout}>
          {/* PC: 프로필 바깥, 모바일: 프로필 bubble_box > info 안 */}
          {!isMobile && (
            <div className={`${styles.a_profile} ${user.name ? styles[user.name.toLowerCase()] : ""}`}>
              <img className={styles.a_profile_img} src={user.profileImage} alt={user.name} />
            </div>
          )}
          <svg width="30" height="35"/*  viewBox="0 0 34 60" */ className={styles.bubble_tail}>
            {/* 꼬리 전체(보더 포함) */}
            <path
              d="M20,0 L5,15 L20,30 Z"
              fill="#f5f5f5"         // bubble_box 배경색과 동일하게!
              stroke="#333"
              strokeWidth="2"
              strokeLinejoin="round" // 뾰족하게
            />
            {/* 겹치는 부분 덮기 (stroke 없음, bubble_box 배경색과 동일) */}
            <rect
              x="18.8" y="-5" width="30" height="40"
              fill="#f5f5f5"
              stroke="none"
              rx="5" ry="5"
            />
          </svg>
          <div className={styles.bubble_box} onClick={goToDetail}>
            <div className={styles.infoTop}>
              <div className={styles.info}>
                {/* 모바일일 때만 프로필을 info 안에 렌더링 */}
                {isMobile && (
                  <div className={`${styles.a_profile} ${user.name ? styles[user.name.toLowerCase()] : ""}`}>
                    <img className={styles.a_profile_img} src={user.profileImage} alt={user.name} />
                  </div>
                )}
                <div className={styles.infoTxt}>
                  <strong className="card_name">
                    {user.name}
                    <img
                      className={styles.a_badge_img}
                      src={getBadgeImage('artist')}
                      alt="artist badge"
                    />
                  </strong>
                  <p className="day_span">{getDisplayDate(data.date)}</p>
                </div>

              </div>
              <p className="card_p" dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
            {data.media && (
              <div
                className={`${styles.a_media} ${data.media.length === 1 ? styles.single : styles.multi}`}
              >
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
            )}
            <div className={styles.a_meta_row}>
              <button className="icon_num" onClick={handleLike}>
                <img className={styles.like_icon}
                  src={liked ? "/images/icon/heart_p_icon.png" : "/images/icon/heart_icon.png"}
                  alt={liked ? "좋아요 취소" : "좋아요"}
                />{" "}
                {likeCount}
              </button>
              <button className="icon_num" onClick={goToDetail}>
                <img className={styles.chat_icon}
                  src="/images/icon/message.png"
                  alt="댓글"
                />{" "}
                {commentCount}
              </button>
              <button className="icon_num" onClick={handleScrap}>
                <img
                  className={styles.pop_icon}
                  src={scrapped ? "/images/icon/pop_p_icon.png" : "/images/icon/pop_icon.png"}
                  alt={scrapped ? "스크랩 취소" : "스크랩"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 팬 게시물 카드
  return (
    <div className={`${styles.post_card} ${styles.fan}`}>
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
          <p className="day_span">{getDisplayDate(data.date)}</p>
        </div>
      </div>
      <div className={styles.body_wrapper} onClick={goToDetail}>
        <p className="card_p" dangerouslySetInnerHTML={{ __html: data.description }} />
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
        <button className="icon_num" onClick={handleLike}>
          <img className={styles.like_icon}
            src={liked ? "/images/icon/heart_p_icon.png" : "/images/icon/heart_icon.png"}
            alt={liked ? "좋아요 취소" : "좋아요"}
          />{" "}
          {likeCount}
        </button>
        <button className="icon_num" onClick={goToDetail}>
          <img className={styles.chat_icon}
            src="/images/icon/message.png"
            alt="댓글"
          />{" "}
          {commentCount}
        </button>
        <button className="icon_num" onClick={handleScrap}>
          <img
            className={styles.pop_icon}
            src={scrapped ? "/images/icon/pop_p_icon.png" : "/images/icon/pop_icon.png"}
            alt={scrapped ? "스크랩 취소" : "스크랩"}
          />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
