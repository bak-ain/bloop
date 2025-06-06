import { createContext, useContext, useState, useEffect } from "react";
import { CommentPost, CommentInput } from "../types";

// 내 userId를 가져오는 함수(혹은 상수로 대체)
const myUserId = localStorage.getItem("userId") || "me"; // 실제 구현에 맞게 수정

interface CommentContextType {
    artistComments: Record<string, CommentPost[]>;
    setArtistComments: React.Dispatch<React.SetStateAction<Record<string, CommentPost[]>>>;
    fanComments: Record<string, CommentPost[]>;
    setFanComments: React.Dispatch<React.SetStateAction<Record<string, CommentPost[]>>>;
    myComments: CommentPost[];
    addComment: (
        type: "artist" | "fan",
        postId: string,
        comment: CommentPost
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
}

const CommentContext = createContext<CommentContextType | null>(null);

export const useComment = () => {
    const ctx = useContext(CommentContext);
    if (!ctx) throw new Error("useComment must be used within CommentProvider");
    return ctx;
};

export const CommentProvider = ({ children }: { children: React.ReactNode }) => {
    const [artistComments, setArtistComments] = useState<Record<string, CommentPost[]>>({});
    const [fanComments, setFanComments] = useState<Record<string, CommentPost[]>>({});
    const [myComments, setMyComments] = useState<CommentPost[]>([]);

    // 댓글 데이터 불러오기
    useEffect(() => {
        // 아티스트 댓글
        const loadedArtistComments: Record<string, CommentPost[]> = {};
        const artistPostList = JSON.parse(localStorage.getItem("artistPostList") || "[]");
        artistPostList.forEach((post: { id: string }) => {
            const saved = localStorage.getItem(`comments_artist_${post.id}`);
            if (saved) loadedArtistComments[post.id] = JSON.parse(saved);
        });
        setArtistComments(loadedArtistComments);

        // 팬 댓글
        const loadedFanComments: Record<string, CommentPost[]> = {};
        const fanPostList = JSON.parse(localStorage.getItem("fanPostList") || "[]");
        fanPostList.forEach((post: { id: string }) => {
            const saved = localStorage.getItem(`comments_fan_${post.id}`);
            if (saved) loadedFanComments[post.id] = JSON.parse(saved);
        });
        setFanComments(loadedFanComments);
    }, []);

    // 내 댓글 리스트 동기화
    useEffect(() => {
        // 모든 댓글 중 내가 쓴 것만 모으기 (아티스트+팬, 답댓글 포함)
        const mine: CommentPost[] = [];

        function collectMyComments(list: CommentPost[]) {
            list.forEach((c) => {
                if (c.user.userId === myUserId) mine.push(c);
                if (c.replies && c.replies.length > 0) collectMyComments(c.replies);
            });
        }

        Object.values(artistComments).forEach((list) => collectMyComments(list));
        Object.values(fanComments).forEach((list) => collectMyComments(list));

        setMyComments(mine);
        localStorage.setItem("myComments", JSON.stringify(mine));
    }, [artistComments, fanComments]);
    // 댓글 변경 시 localStorage에 저장
    useEffect(() => {
        Object.entries(artistComments).forEach(([postId, comments]) => {
            localStorage.setItem(`comments_artist_${postId}`, JSON.stringify(comments));
        });
    }, [artistComments]);

    useEffect(() => {
        Object.entries(fanComments).forEach(([postId, comments]) => {
            localStorage.setItem(`comments_fan_${postId}`, JSON.stringify(comments));
        });
    }, [fanComments]);

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
                    updated[postId] = updated[postId].map((c) =>
                        c.id === parentCommentId
                            ? {
                                ...c,
                                replies: c.replies ? [...c.replies, comment] : [comment],
                            }
                            : c
                    );
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
                    updated[postId] = updated[postId].map((c) =>
                        c.id === parentCommentId
                            ? {
                                ...c,
                                replies: c.replies ? [...c.replies, comment] : [comment],
                            }
                            : c
                    );
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
        if (type === "artist") {
            setArtistComments((prev) => ({
                ...prev,
                [postId]: prev[postId]?.filter((c) => c.id !== commentId) || [],
            }));
        } else {
            setFanComments((prev) => ({
                ...prev,
                [postId]: prev[postId]?.filter((c) => c.id !== commentId) || [],
            }));
        }
        // myComments에서도 삭제
        setMyComments((prev) => prev.filter((c) => c.id !== commentId));
        localStorage.setItem("myComments", JSON.stringify(myComments.filter((c) => c.id !== commentId)));
    };

    // 댓글 좋아요 토글 함수
    const toggleCommentLike = (
        type: "artist" | "fan",
        postId: string,
        commentId: string
    ) => {
        if (type === "artist") {
            setArtistComments((prev) => ({
                ...prev,
                [postId]: prev[postId]?.map((c) =>
                    c.id === commentId
                        ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
                        : c
                ) || [],
            }));
        } else {
            setFanComments((prev) => ({
                ...prev,
                [postId]: prev[postId]?.map((c) =>
                    c.id === commentId
                        ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
                        : c
                ) || [],
            }));
        }
    };

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
            }}
        >
            {children}
        </CommentContext.Provider>
    );
};