import { createContext, useContext, useState, useEffect } from "react";
import { CommentPost } from "../types";


// 내 userId를 가져오는 함수(혹은 상수로 대체)
// const myUserId = localStorage.getItem("userId") || "me"; // 실제 구현에 맞게 수정
// 내 userId를 가져오는 함수(혹은 상수로 대체)
const myUserId = "me123"; // 임시로 고정

interface CommentContextType {
    artistComments: Record<string, CommentPost[]>;
    setArtistComments: React.Dispatch<React.SetStateAction<Record<string, CommentPost[]>>>;
    fanComments: Record<string, CommentPost[]>;
    setFanComments: React.Dispatch<React.SetStateAction<Record<string, CommentPost[]>>>;
    myComments: CommentPost[];
    addComment: (
        type: "artist" | "fan",
        postId: string,
        comment: CommentPost,
        parentCommentId?: string
    ) => void;
    deleteComment: (
        type: "artist" | "fan",
        postId: string,
        commentId: string
    ) => void;
    toggleCommentLike: (
        type: "artist" | "fan",
        postId: string,
        commentId: string
    ) => void;
    likedCommentIds: string[];
    showRepliesMap: Record<string, boolean>;
    toggleShowReplies: (commentId: string) => void;
}

const CommentContext = createContext<CommentContextType | null>(null);

export const useComment = () => {
    const ctx = useContext(CommentContext);
    if (!ctx) throw new Error("useComment must be used within CommentProvider");
    return ctx;
};

export const CommentProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [artistComments, setArtistComments] = useState<Record<string, CommentPost[]>>({});
    const [fanComments, setFanComments] = useState<Record<string, CommentPost[]>>({});
    const [myComments, setMyComments] = useState<CommentPost[]>([]);
    const [showRepliesMap, setShowRepliesMap] = useState<Record<string, boolean>>({});
    const [likedCommentIds, setLikedCommentIds] = useState<string[]>(
        () => JSON.parse(localStorage.getItem("likedCommentIds") || "[]")
    );

    useEffect(() => {
        const artist = localStorage.getItem("artistComments");
        const fan = localStorage.getItem("fanComments");

        // 값이 있고, 파싱했을 때 빈 객체가 아니면 바로 세팅
        if (artist && fan) {
            const parsedArtist = JSON.parse(artist);
            const parsedFan = JSON.parse(fan);
            const hasArtist = Object.keys(parsedArtist).length > 0;
            const hasFan = Object.keys(parsedFan).length > 0;
            if (hasArtist || hasFan) {
                setArtistComments(parsedArtist);
                setFanComments(parsedFan);
                setLoading(false);
                return;
            }
        }

        // 값이 없거나 비어있으면 fetch로 초기화
        fetch("/data/comments.json")
            .then(res => res.json())
            .then((commentsData) => {
                const artistComments: Record<string, CommentPost[]> = {};
                const fanComments: Record<string, CommentPost[]> = {};

                (commentsData as CommentPost[]).forEach((c) => {
                    if (c.postType === "artist") {
                        if (!artistComments[c.postId]) artistComments[c.postId] = [];
                        artistComments[c.postId].push({ ...c, replies: c.replies || [] });
                    } else if (c.postType === "fan") {
                        if (!fanComments[c.postId]) fanComments[c.postId] = [];
                        fanComments[c.postId].push({ ...c, replies: c.replies || [] });
                    }
                });

                localStorage.setItem("artistComments", JSON.stringify(artistComments));
                localStorage.setItem("fanComments", JSON.stringify(fanComments));
                setArtistComments(artistComments);
                setFanComments(fanComments);
                setLoading(false);
            });
    }, []);



    // 댓글 변경 시 localStorage에 저장
    useEffect(() => {
        localStorage.setItem("artistComments", JSON.stringify(artistComments));
    }, [artistComments]);

    useEffect(() => {
        localStorage.setItem("fanComments", JSON.stringify(fanComments));
    }, [fanComments]);

    // 내 댓글 리스트 동기화
    useEffect(() => {
        // 모든 댓글 중 내가 쓴 것만 모으기 (아티스트+팬, 답댓글 포함)
        const mine: CommentPost[] = [];

        function collectMyComments(list: CommentPost[]) {
            list.forEach((c) => {
                if (c.user?.userId === myUserId) mine.push(c);
                if (c.replies && c.replies.length > 0) collectMyComments(c.replies);
            });
        }

        Object.values(artistComments).forEach((list) => collectMyComments(list));
        Object.values(fanComments).forEach((list) => collectMyComments(list));

        setMyComments(mine);
        localStorage.setItem("myComments", JSON.stringify(mine));
    }, [artistComments, fanComments]);

    // 댓글 추가 함수
    const addComment = (
        type: "artist" | "fan",
        postId: string,
        comment: CommentPost,
        parentCommentId?: string // 답댓글일 경우 부모 댓글 id
    ) => {
        if (type === "artist") {
            setArtistComments((prev) => {
                let updated = { ...prev };
                if (parentCommentId) {
                    // 답댓글: 부모의 replies에만 추가
                    updated[postId] = updated[postId]?.map((c) =>
                        c.id === parentCommentId
                            ? {
                                ...c,
                                replies: c.replies ? [...c.replies, comment] : [comment],
                            }
                            : c
                    ) ?? [];
                } else {
                    // 일반 댓글: 최상위 배열에 추가
                    updated[postId] = prev[postId] ? [...prev[postId], comment] : [comment];
                }
                return updated;
            });
        } else {
            setFanComments((prev) => {
                let updated = { ...prev };
                if (parentCommentId) {
                    updated[postId] = updated[postId]?.map((c) =>
                        c.id === parentCommentId
                            ? {
                                ...c,
                                replies: c.replies ? [...c.replies, comment] : [comment],
                            }
                            : c
                    ) ?? [];
                } else {
                    updated[postId] = prev[postId] ? [...prev[postId], comment] : [comment];
                }
                return updated;
            });
        }
        // myComments는 useEffect에서 자동으로 동기화되므로 여기서 setMyComments는 필요 없습니다.
    };

    // 댓글 삭제 함수
    const deleteComment = (
        type: "artist" | "fan",
        postId: string,
        commentId: string
    ) => {
        const deleteRecursive = (comments: CommentPost[]): CommentPost[] =>
            comments
                .filter((c) => c.id !== commentId)
                .map((c) =>
                    c.replies
                        ? { ...c, replies: deleteRecursive(c.replies) }
                        : c
                );

        if (type === "artist") {
            setArtistComments((prev) => ({
                ...prev,
                [postId]: prev[postId] ? deleteRecursive(prev[postId]) : [],
            }));
        } else {
            setFanComments((prev) => ({
                ...prev,
                [postId]: prev[postId] ? deleteRecursive(prev[postId]) : [],
            }));
        }
        // myComments는 useEffect에서 자동 동기화
    };

    // 댓글 좋아요 토글 함수
    const toggleCommentLike = (
        type: "artist" | "fan",
        postId: string,
        commentId: string
    ) => {
        const alreadyLiked = likedCommentIds.includes(commentId);

        // likes만 업데이트
        const toggleLikeRecursive = (comments: CommentPost[]): CommentPost[] =>
            comments.map((c) =>
                c.id === commentId
                    ? {
                        ...c,
                        likes: alreadyLiked ? Math.max(c.likes - 1, 0) : c.likes + 1,
                    }
                    : {
                        ...c,
                        replies: c.replies ? toggleLikeRecursive(c.replies) : [],
                    }
            );

        if (type === "artist") {
            setArtistComments((prev) => ({
                ...prev,
                [postId]: prev[postId] ? toggleLikeRecursive(prev[postId]) : [],
            }));
        } else {
            setFanComments((prev) => ({
                ...prev,
                [postId]: prev[postId] ? toggleLikeRecursive(prev[postId]) : [],
            }));
        }

        // likedCommentIds 업데이트
        setLikedCommentIds((prev) =>
            alreadyLiked
                ? prev.filter((id) => id !== commentId)
                : [...prev, commentId]
        );
    };

    // 그리고 useEffect로 동기화
    useEffect(() => {
        localStorage.setItem("likedCommentIds", JSON.stringify(likedCommentIds));
    }, [likedCommentIds]);
    // 답글 보기/숨기기 토글 함수
    const toggleShowReplies = (commentId: string) => {
        setShowRepliesMap((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };
    if (loading) return null; // 또는 로딩 UI
    return (
        <CommentContext.Provider
            value={{
                artistComments,
                setArtistComments,
                fanComments,
                setFanComments,
                myComments,
                addComment,
                deleteComment,
                toggleCommentLike,
                showRepliesMap,
                toggleShowReplies,
                likedCommentIds,
            }}
        >
            {children}
        </CommentContext.Provider>
    );
};