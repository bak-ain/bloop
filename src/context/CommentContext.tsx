import { createContext, useContext, useState, useEffect } from "react";
import { CommentPost } from "../types";

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
}

const CommentContext = createContext<CommentContextType | null>(null);

export const useComment = () => {
    const ctx = useContext(CommentContext);
    if (!ctx) throw new Error("useComment must be used within CommentProvider");
    return ctx;
};

export const CommentProvider = ({ children }: { children: React.ReactNode }) => {
    // useState의 초기값에서 localStorage 값을 읽어오도록 수정
    const [artistComments, setArtistComments] = useState<Record<string, CommentPost[]>>(
        () => JSON.parse(localStorage.getItem("artistComments") || "{}")
    );
    const [fanComments, setFanComments] = useState<Record<string, CommentPost[]>>(
        () => JSON.parse(localStorage.getItem("fanComments") || "{}")
    );
    const [myComments, setMyComments] = useState<CommentPost[]>(
        () => JSON.parse(localStorage.getItem("myComments") || "[]")
    );

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
        const toggleLikeRecursive = (comments: CommentPost[]): CommentPost[] =>
            comments.map((c) =>
                c.id === commentId
                    ? {
                        ...c,
                        isLiked: !c.isLiked,
                        likes: c.isLiked ? c.likes - 1 : c.likes + 1,
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