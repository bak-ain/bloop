import { useEffect, useState } from "react";
import { ArtistPost, FanPost, CommentPost, CommentInput } from "../types";
import { getBadgeImage, getAvailableEmojis } from "../utils/badge";
import styles from "./PostDetail.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/ko';
import { useLikedScrapped } from "../context/LikedScrappedContext";
dayjs.extend(relativeTime);
dayjs.locale('ko');

interface PostDetailProps<T extends ArtistPost | FanPost> {
    type: "artist" | "fan";
    data: T;
    postList: T[];
    setPostList: React.Dispatch<React.SetStateAction<T[]>>;
}

const PostDetail = <T extends ArtistPost | FanPost>({ type, data, postList, setPostList }: PostDetailProps<T>) => {
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

    const likedPostIds = type === "artist" ? artistLikedIds : fanLikedIds;
    const scrappedPostIds = type === "artist" ? artistScrappedIds : fanScrappedIds;

    const [liked, setLiked] = useState(likedPostIds.includes(data.id));
    const [scrapped, setScrapped] = useState(scrappedPostIds.includes(data.id));
    const [likeCount, setLikeCount] = useState(postLikeCounts[data.id] ?? data.likes);
    const [commentCount, setCommentCount] = useState(data.comment);
    const [comments, setComments] = useState<CommentPost[]>([]);
    const [input, setInput] = useState<CommentInput>({ content: "", parentPostId: data.id });
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const [showStickerPicker, setShowStickerPicker] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const userLevel = 2;
    const emojis = getAvailableEmojis(userLevel);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

    useEffect(() => {
        setLiked(likedPostIds.includes(data.id));
        setScrapped(scrappedPostIds.includes(data.id));
    }, [data.id, likedPostIds, scrappedPostIds]);

    useEffect(() => {
        setLikeCount(postLikeCounts[data.id] ?? data.likes);
    }, [postLikeCounts, data.id, data.likes]);

    useEffect(() => {
        const saved = localStorage.getItem(`comments_${data.id}`);
        const parsed = saved ? JSON.parse(saved) : null;

        if (parsed && parsed.length > 0) {
            setComments(parsed);
            setCommentCount(parsed.length);
        } else {
            fetch("/data/comments.json")
                .then((res) => res.json())
                .then((json: CommentPost[]) => {
                    const filtered = json.filter((c) => c.postId === data.id && c.postType === type);
                    setComments(filtered);
                    setCommentCount(filtered.length);
                    localStorage.setItem(`comments_${data.id}`, JSON.stringify(filtered));
                })
                .catch((err) => console.error("댓글 불러오기 실패", err));
        }
    }, [data.id, type]);

    const handleToggleLike = () => {
        toggleLike(type, data.id, data.likes);
    };

    const handleToggleScrap = () => {
        toggleScrap(type, data.id);
    };

    const toggleCommentLike = (id: string) => {
        setComments((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c
            )
        );
    };

    const handleSubmitComment = () => {
        if (!input.content.trim() && !input.emoji) return;

        if (replyToId) {
            setComments((prev) => {
                const updated = prev.map((c) => {
                    if (c.id === replyToId) {
                        const newReply: CommentPost = {
                            id: String(Date.now()),
                            postId: data.id,
                            postType: type,
                            user: {
                                name: "me",
                                profileImage: "/images/profiles/me.png",
                                badgeType: "fan",
                                badgeLevel: 1,
                                userId: "me123",
                            },
                            content: input.content,
                            emoji: input.emoji,
                            date: new Date().toISOString(),
                            likes: 0,
                            comments: 0,
                            isLiked: false,
                            editable: true,
                            replies: []
                        };
                        return {
                            ...c,
                            replies: [...(c.replies || []), newReply]
                        };
                    }
                    return c;
                });
                localStorage.setItem(`comments_${data.id}`, JSON.stringify(updated));
                // 답글은 postList의 commentCount에는 반영하지 않음
                return updated;
            });
        } else {
            const newComment: CommentPost = {
                id: String(Date.now()),
                postId: data.id,
                postType: type,
                user: {
                    name: "me",
                    profileImage: "/images/profiles/me.png",
                    badgeType: "fan",
                    badgeLevel: 1,
                    userId: "me123",
                },
                content: input.content,
                emoji: input.emoji,
                date: new Date().toISOString(),
                likes: 0,
                comments: 0,
                isLiked: false,
                editable: true,
                replies: []
            };
            const updatedComments = [...comments, newComment];
            setComments(updatedComments);
            setCommentCount(updatedComments.length);
            localStorage.setItem(`comments_${data.id}`, JSON.stringify(updatedComments));
            // ★ PostCard의 댓글 수도 함께 업데이트
            setPostList(prev =>
                prev.map(post =>
                    post.id === data.id
                        ? { ...post, comment: updatedComments.length }
                        : post
                )
            );
        }

        setInput({ content: "", parentPostId: data.id });
        setReplyToId(null);
        setSelectedEmoji(null);
        setShowStickerPicker(false);
    };


    const handleDelete = (id: string) => {
        const updatedComments: CommentPost[] = comments
            .map((c) => {
                if (c.id === id) return null;
                if (c.replies && c.replies.length > 0) {
                    const filteredReplies = c.replies.filter((r) => r.id !== id);
                    return { ...c, replies: filteredReplies };
                }
                return c;
            })
            .filter((c): c is CommentPost => c !== null);

        setComments(updatedComments);
        setCommentCount(updatedComments.length); // ★ 즉시 카운트 반영
        localStorage.setItem(`comments_${data.id}`, JSON.stringify(updatedComments));
        setPostList(prev =>
            prev.map(post =>
                post.id === data.id
                    ? { ...post, comment: updatedComments.length }
                    : post
            )
        );
        setConfirmDeleteId(null);
    };

    // 답글 입력창용
    const toggleReplyInput = (id: string, username: string) => {
        setReplyToId((prev) => (prev === id ? null : id));
        setInput((prev) => ({ ...prev, content: prev.content.startsWith(`@${username}`) ? prev.content : `@${username} ` }));
    };

    // 답글 보기/숨기기용
    const toggleShowReplies = (id: string) => {
        setComments((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, showReplies: !c.showReplies } : c
            )
        );
    };

    const handleEmojiClick = (emoji: string) => {
        setSelectedEmoji(emoji);
        setInput((prev) => ({ ...prev, emoji }));
    };

    return (
        <div className={styles.post_detail}>
            <section className={styles.feed_content}>
                <div className={styles.profile_row}>
                    <img className={styles.profile_img} src={data.user.profileImage} alt={data.user.name} />
                    <div className={styles.info}>
                        <strong>
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
                        <p className={styles.date}>{data.date}</p>
                    </div>
                </div>

                <div className={styles.body_wrapper}>
                    <p className={styles.desc}>{data.description}</p>
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

                <div className={styles.meta_row}>
                    <button onClick={handleToggleLike}>{liked ? "❤️" : "🤍"} {likeCount}</button>
                    <button>{`💬 ${commentCount}`}</button>
                    <button onClick={handleToggleScrap}>{scrapped ? "🔖" : "📌"}</button>
                </div>
            </section>
            <aside className={styles.comment_panel}>
                <div className={styles.comment_list}>
                    {comments.map((c) => (
                        <div key={c.id} className={styles.comment_item}>
                            <img src={c.user.profileImage} alt={c.user.name} className={styles.comment_avatar} />
                            <div>
                                <strong>
                                    {c.user.name}
                                    <img className={styles.badge_img} src={getBadgeImage(c.user.badgeType, c.user.badgeLevel)} alt="badge" />
                                </strong>
                                <p>{c.content}</p>
                                {c.emoji && <img src={c.emoji} className={styles.comment_emoji} />}
                                <div className={styles.comment_meta}>
                                    <span>{dayjs(c.date).fromNow()}</span>
                                    <button onClick={() => toggleReplyInput(c.id, c.user.name)}>답글 달기</button>
                                    {c.editable && <button className={styles.delete} onClick={() => setConfirmDeleteId(c.id)}>삭제</button>}
                                </div>
                                <div className={styles.comment_actions}>
                                    <button onClick={() => toggleCommentLike(c.id)}>{c.isLiked ? "❤️" : "🤍"}</button>
                                    <span>{c.likes}</span>
                                </div>
                                {c.replies && c.replies.length > 0 && (
                                    <div className={styles.reply_toggle_row}>
                                        <button onClick={() => toggleShowReplies(c.id)}>
                                            {c.replies.length}개 답글 {c.showReplies ? '숨기기' : '보기'}
                                        </button>
                                    </div>
                                )}
                                {c.showReplies && (
                                    <div className={styles.reply_list}>
                                        {c.replies?.map((r) => (
                                            <div key={r.id} className={styles.reply_item}>
                                                <img src={r.user.profileImage} alt={r.user.name} className={styles.comment_avatar} />
                                                <div>
                                                    <strong>
                                                        {r.user.name}
                                                        <img className={styles.badge_img} src={getBadgeImage(r.user.badgeType, r.user.badgeLevel)} alt="badge" />
                                                    </strong>
                                                    <p>{r.content}</p>
                                                    {r.emoji && <img src={r.emoji} className={styles.comment_emoji} />}
                                                    <div className={styles.comment_meta}>
                                                        <span>{dayjs(r.date).fromNow()}</span>
                                                        {r.editable && <button className={styles.delete} onClick={() => setConfirmDeleteId(r.id)}>삭제</button>}
                                                    </div>
                                                    <div className={styles.comment_actions}>
                                                        <button onClick={() => toggleCommentLike(r.id)}>{r.isLiked ? "❤️" : "🤍"}</button>
                                                        <span>{r.likes}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>

                {confirmDeleteId && (
                    <div className={styles.confirm_popup}>
                        <p>정말 삭제하시겠어요?</p>
                        <button onClick={() => handleDelete(confirmDeleteId)}>삭제</button>
                        <button onClick={() => setConfirmDeleteId(null)}>취소</button>
                    </div>
                )}
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

                <div className={styles.comment_input}>
                    <input
                        type="text"
                        value={input.content}
                        onChange={(e) => setInput({ ...input, content: e.target.value })}
                        placeholder="댓글을 입력하세요"
                    />
                    <button onClick={() => setShowStickerPicker((prev) => !prev)}>😀</button>
                    <button onClick={handleSubmitComment}>등록</button>
                </div>
            </aside>
        </div>
    );
};

export default PostDetail;