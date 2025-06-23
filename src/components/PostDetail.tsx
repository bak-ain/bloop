import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArtistPost, FanPost, CommentPost, CommentInput } from "../types";
import { getBadgeImage, getAvailableEmojis } from "../utils/badge";
import styles from "./PostDetail.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/ko';
import { useLikedScrapped } from "../context/LikedScrappedContext";
import { useComment } from "../context/CommentContext";
import { useUserContext } from "../context/UserContext ";
import { useMyContent } from "../context/MyContentContext";

dayjs.extend(relativeTime);
dayjs.locale('ko');

interface PostDetailProps<T extends ArtistPost | FanPost> {
  type: "artist" | "fan";
  data: T;
  postList: T[];
  setPostList: React.Dispatch<React.SetStateAction<T[]>>;
  onClose?: () => void;
  onEdit?: (post: T) => void;
}

const PostDetail = <T extends ArtistPost | FanPost>({ type, data, postList, setPostList, onClose, onEdit }: PostDetailProps<T>) => {
  const navigate = useNavigate();
  // 좋아요/스크랩 context 사용
  const {
    postLikeCounts,
    toggleLike,
    artistLikedIds,
    fanLikedIds,
    artistScrappedIds,
    fanScrappedIds,
    toggleScrap,
  } = useLikedScrapped();

  // 댓글 context 사용
  const {
    artistComments,
    fanComments,
    addComment,
    deleteComment,
    toggleCommentLike,
    showRepliesMap,
    toggleShowReplies,
    likedCommentIds,
  } = useComment();

  const { user } = useUserContext();
  const { removeWritten, removeComment } = useMyContent();

  function getDisplayDate(dateStr: string) {
    const now = dayjs();
    const date = dayjs(dateStr);
    return now.diff(date, "hour") < 24
      ? date.fromNow()
      : date.format("YYYY.MM.DD");
  }
  const likedPostIds = type === "artist" ? artistLikedIds : fanLikedIds;
  const scrappedPostIds = type === "artist" ? artistScrappedIds : fanScrappedIds;

  // 댓글 목록을 context에서 가져옴
  const comments = (type === "artist" ? artistComments[data.id] : fanComments[data.id]) || [];

  const [liked, setLiked] = useState(likedPostIds.includes(data.id));
  const [scrapped, setScrapped] = useState(scrappedPostIds.includes(data.id));
  const [likeCount, setLikeCount] = useState(postLikeCounts[data.id] ?? data.likes);
  const [commentCount, setCommentCount] = useState(data.comment);
  const [input, setInput] = useState<CommentInput>({ content: "", parentPostId: data.id });
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "post" | "comment", id: string } | null>(null);
  const userLevel = (user && (user as any).badgeLevel) || 1;
  const emojis = getAvailableEmojis(userLevel);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // 내 userId
  const myUserId = user?.id || "";

  useEffect(() => {
    setLiked(likedPostIds.includes(data.id));
    setScrapped(scrappedPostIds.includes(data.id));
  }, [data.id, likedPostIds, scrappedPostIds]);

  useEffect(() => {
    setLikeCount(postLikeCounts[data.id] ?? data.likes);
  }, [postLikeCounts, data.id, data.likes]);

  useEffect(() => {
    setCommentCount(comments.length);
    setPostList(prev =>
      prev.map(post =>
        post.id === data.id
          ? { ...post, comment: comments.length }
          : post
      )
    );
  }, [comments, data.id, setPostList]);

  const handleToggleLike = () => {
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    toggleLike(type, data.id, data.likes);
  };

  const handleToggleScrap = () => {
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    toggleScrap(type, data.id);
  };

  const handleSubmitComment = () => {
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    if (!input.content.trim() && !input.emoji) return;

    let content = input.content;
    // 답글일 때만 @유저이름 제거
    if (replyToId) {
      // 댓글 내용이 "@닉네임 "으로 시작하면 제거
      const replyTarget = comments.find(c => c.id === replyToId);
      if (replyTarget && content.startsWith(`@${replyTarget.user.name} `)) {
        content = content.replace(`@${replyTarget.user.name} `, "");
      }
    }

    const commentData: CommentPost = {
      id: `${Date.now()}-${Math.random()}`,
      postId: data.id,
      postType: type,
      ...input,
      content, // 수정된 내용 사용
      user: {
        name: user.name,
        profileImage: (user as any).profileImage || "/images/profiles/me.png",
        badgeType: user.userType === "agency" ? "fan" : user.userType,
        badgeLevel: (user as any).badgeLevel || 1,
        userId: user.id,
      },
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false,
      editable: true,
      replies: [],
    };

    if (replyToId) {
      addComment(type, data.id, commentData, replyToId);
    } else {
      addComment(type, data.id, commentData);
    }

    setInput({ content: "", parentPostId: data.id });
    setReplyToId(null);
    setSelectedEmoji(null);
    setShowStickerPicker(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === "post") {
      setPostList(prev => prev.filter(post => post.id !== confirmDelete.id));
      removeWritten(confirmDelete.id);
      alert("삭제되었습니다.");
      setConfirmDelete(null);
      if (typeof onClose === "function") onClose();
    } else {
      deleteComment(type, data.id, confirmDelete.id);
      removeComment(confirmDelete.id);
      alert("삭제되었습니다.");
      setConfirmDelete(null);
    }
  };

  const toggleReplyInput = (id: string, username: string) => {
    setReplyToId((prev) => (prev === id ? null : id));
    setInput((prev) => ({ ...prev, content: prev.content.startsWith(`@${username}`) ? prev.content : `@${username} ` }));
  };

  const handleCommentLike = (id: string) => {
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    toggleCommentLike(type, data.id, id);
  };

  const handleShowReplies = (id: string) => {
    toggleShowReplies(id);
  };

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    setInput((prev) => ({ ...prev, emoji }));
  };

  return (
    <div className={styles.post_detail}>
      {/* 모바일 헤더 */}
      <div className={styles.mobile_header}>
        <button
          className={styles.back_btn}
          onClick={() => {
            if (onClose) onClose();
            if (type === "artist") navigate("/muse");
            else navigate("/loop");
          }}
        >
          <img src="/images/icon/back.png" alt="뒤로가기" />
        </button>
        <span className={styles.feed_tab}>{type === "artist" ? "아티스트" : "커뮤니티"}</span>
      </div>
      <div className={styles.post_detail_all}>
        <section className={`${styles.feed_content} ${styles.day_span}`}>
          {data.user.userId === myUserId && (
            <div className={styles.more_menu_wrapper}>
              <button
                className={styles.more_btn}
                onClick={() => setShowMoreMenu((prev) => !prev)}
              >
                <img src="/images/icon/more.png" alt="더보기" />
              </button>
              {showMoreMenu && (
                <div className={styles.more_menu}>
                  <button onClick={() => { setShowMoreMenu(false); onEdit?.(data); }}>수정하기</button>
                  <button onClick={() => setConfirmDelete({ type: "post", id: data.id })}>삭제하기</button>
                </div>
              )}
            </div>
          )}
          <div className={styles.feed_wrapper}>
            <div className={styles.profile_row}>
              <img className={styles.profile_img} src={data.user.profileImage} alt={data.user.name} />
              <div className={styles.info}>
                <strong className={styles.card_name}>
                  {data.user.name}
                  <img
                    className={styles.badge_img}
                    src={getBadgeImage(
                      data.user.badgeType,
                      data.user.badgeType === "fan" ? data.user.badgeLevel : undefined
                    )}
                    alt="badge"
                  />
                </strong>
                <p className={styles.date}>{getDisplayDate(data.date)}</p>
              </div>
            </div>

            <div className={styles.body_wrapper}>
              <p className={styles.desc} dangerouslySetInnerHTML={{ __html: data.description }} />
              {data.hashtag && (
                <div className={styles.hashtags}>
                  {data.hashtag.split(" ").map((tag, i) => <span key={i} className={styles.tag}>{tag}</span>)}
                </div>
              )}
              {data.media && (
                <div className={styles.media}>
                  {data.media.map((m, i) =>
                    m.type === "video"
                      ? <video key={i} src={m.url} controls className={styles.media_item} />
                      : <img key={i} src={m.url} alt={`media-${i}`} className={styles.media_item} />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles.meta_row}>
            <button onClick={handleToggleLike}>
              <img className={styles.like_icon}
                src={liked ? "/images/icon/heart_p_icon.png" : "/images/icon/heart_icon.png"}
                alt={liked ? "좋아요 취소" : "좋아요"}
              />{" "}
              {likeCount}
            </button>
            <button><img className={styles.like_icon}
              src="/images/icon/message.png"
              alt="댓글"
            />{" "}
              {commentCount}
            </button>
            <button onClick={handleToggleScrap}>
              <img
                className={styles.like_icon}
                src={scrapped ? "/images/icon/pop_p_icon.png" : "/images/icon/pop_icon.png"}
                alt={scrapped ? "스크랩 취소" : "스크랩"}
              />
            </button>
          </div>
        </section>
        <aside className={styles.comment_panel}>
          <div className={styles.comment_list}>
            {comments.map((c) => (
              <div key={c.id} className={styles.comment_item}>
                <div className={styles.comment_item_left}>
                  <img src={c.user.profileImage} alt={c.user.name} className={styles.comment_avatar} />
                  <div className={styles.comment_content_row}>
                    <div className={styles.comment_main}>
                      <div className={styles.comment_main_top}>
                        <strong>
                          {c.user.name}
                          <img className={styles.badge_img} src={getBadgeImage(c.user.badgeType, c.user.badgeLevel)} alt="badge" />
                        </strong>
                        <p>{c.content}</p>
                      </div>
                      {c.emoji && <img src={c.emoji} className={styles.comment_emoji} />}
                      <div className={styles.comment_meta}>
                        <span>{getDisplayDate(c.date)}</span>
                        <button className={styles.commentBtn} onClick={() => toggleReplyInput(c.id, c.user.name)}>답글 달기</button>
                        {c.user.userId === myUserId && (
                          <button className={styles.deleteBtn} onClick={() => setConfirmDelete({ type: "comment", id: c.id })}>삭제</button>
                        )}

                      </div>
                      {/* 답글 토글/리스트 */}
                      {c.replies && c.replies.length > 0 && (
                        <div className={styles.reply_toggle_row}>
                          <button onClick={() => handleShowReplies(c.id)} className={styles.reply_toggle_btn}>
                            {showRepliesMap[c.id]
                              ? "답글 숨기기"
                              : `${c.replies.length}개 답글 보기`}
                          </button>
                        </div>
                      )}
                      {c.replies && c.replies.length > 0 && showRepliesMap[c.id] && (
                        <div className={styles.reply_list}>
                          {c.replies.map((r) => (
                            <div key={r.id} className={styles.reply_item}>
                              <div className={styles.reply_item_left}>
                                <img src={r.user.profileImage} alt={r.user.name} className={styles.comment_avatar} />
                                <div className={styles.reply_item_info}>
                                  <strong>
                                    {r.user.name}
                                    <img className={styles.badge_img} src={getBadgeImage(r.user.badgeType, r.user.badgeLevel)} alt="badge" />
                                  </strong>

                                  <p>{r.content}</p>
                                  {r.emoji && <img src={r.emoji} className={styles.comment_emoji} />}
                                  <div className={styles.comment_meta}>
                                    <span>{getDisplayDate(r.date)}</span>
                                    {r.user.userId === myUserId && (
                                      <button className={styles.delete} onClick={() => setConfirmDelete({ type: "comment", id: r.id })}>삭제</button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className={styles.comment_actions}>
                                <button onClick={() => handleCommentLike(r.id)}>  <img
                                  src={likedCommentIds.includes(r.id) ? "/images/icon/heart_p_icon.png" : "/images/icon/heart_icon.png"}
                                  alt={likedCommentIds.includes(r.id) ? "좋아요 취소" : "좋아요"}
                                  className={styles.comment_like_icon}
                                /></button>
                                <span>{r.likes}</span>
                              </div>

                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* 오른쪽 영역: 좋아요 */}
                <div className={styles.comment_like_box}>
                  <button onClick={() => handleCommentLike(c.id)}>
                    <img
                      src={likedCommentIds.includes(c.id) ? "/images/icon/heart_p_icon.png" : "/images/icon/heart_icon.png"}
                      alt={likedCommentIds.includes(c.id) ? "좋아요 취소" : "좋아요"}
                      className={styles.comment_like_icon}
                    />
                  </button>
                  <span>{c.likes}</span>
                </div>

              </div>
            ))}
          </div>

          {confirmDelete && (
            <div className={styles.confirm_popup_overlay}>
              <div className={styles.confirm_popup}>
                <p>정말 삭제하시겠어요?</p>
                <div className={styles.confirm_popup_buttons}>
                  <button className={styles.delete} onClick={handleDelete}>삭제</button>
                  <button className={styles.cancel} onClick={() => setConfirmDelete(null)}>취소</button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.comment_input}>
            <input
              className={`${styles.comment_input_field} ${styles.day_span}`}
              type="text"
              value={input.content}
              onChange={(e) => setInput({ ...input, content: e.target.value })}
              placeholder="댓글을 입력하세요"
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <button className={styles.smileBtn} onClick={() => setShowStickerPicker((prev) => !prev)}>
              <img src="/images/icon/smile.png" alt="스티커 선택" />
            </button>
            <button className={styles.uploadBtn} onClick={handleSubmitComment}>
              <img src="/images/icon/upload.png" alt="등록" />
            </button>
          </div>

          {selectedEmoji && (
            <div className={styles.emoji_preview}>
              <img src={selectedEmoji} alt="selected emoji" />
              <button onClick={() => setSelectedEmoji(null)}>✖</button>
            </div>
          )}
          {showStickerPicker && (
            <div className={styles.sticker_picker}>
              {emojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => handleEmojiClick(emoji)}
                >
                  <img src={emoji} alt={`emoji${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PostDetail;