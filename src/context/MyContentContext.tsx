import { createContext, useContext, useState, useEffect } from "react";
import { MyWrittenPost, MyCommentPost } from "../types";

// 좋아요/스크랩은 LikedScrappedContext에서 관리하므로 여기선 제외

interface MyContentContextType {
    written: MyWrittenPost[];
    comments: MyCommentPost[];
    addWritten: (post: MyWrittenPost) => void;
    removeWritten: (id: string) => void;
    addComment: (comment: MyCommentPost) => void;
    removeComment: (id: string) => void;
    refreshAll: () => void;
}

const MyContentContext = createContext<MyContentContextType | null>(null);

export const useMyContent = () => {
    const ctx = useContext(MyContentContext);
    if (!ctx) throw new Error("useMyContent must be used within MyContentProvider");
    return ctx;
};

export const MyContentProvider = ({ children }: { children: React.ReactNode }) => {
    const [written, setWritten] = useState<MyWrittenPost[]>([]);
    const [comments, setComments] = useState<MyCommentPost[]>([]);

    // 데이터 fetch 또는 localStorage에서 불러오기
    const fetchAll = async () => {
        // 1. 목데이터 fetch
        const writtenRes = await fetch("/data/myWritten.json");
        const writtenMock = await writtenRes.json();

        // 2. localStorage 데이터
        const writtenLS = localStorage.getItem("myFanPosts");
        const writtenLocal = writtenLS ? JSON.parse(writtenLS) : [];

        // 3. 합치기 (중복 제거: id 기준)
        const allWritten = [...writtenLocal, ...writtenMock.filter(
            (mock: MyWrittenPost) => !writtenLocal.some((local: MyWrittenPost) => local.id === mock.id)
        )];

        setWritten(allWritten);

        // 댓글도 동일하게
        const commentsLS = localStorage.getItem("myComments");
        const commentsLocal = commentsLS ? JSON.parse(commentsLS) : [];
        setComments(commentsLocal);
    };

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line
    }, []);

    // 업데이트 함수들
    const addWritten = (post: MyWrittenPost) => {
        setWritten(prev => {
            const updated = [post, ...prev.filter(item => item.id !== post.id)];
            localStorage.setItem("myFanPosts", JSON.stringify(updated));
            return updated;
        });
    };

    const removeWritten = (id: string) => {
        setWritten(prev => {
            const updated = prev.filter(item => item.id !== id);
            localStorage.setItem("myFanPosts", JSON.stringify(updated));
            return updated;
        });
    };

    const addComment = (comment: MyCommentPost) => {
        setComments(prev => {
            const updated = [comment, ...prev];
            localStorage.setItem("myComments", JSON.stringify(updated));
            return updated;
        });
    };

    const removeComment = (id: string) => {
        setComments(prev => {
            const updated = prev.filter(item => item.id !== id);
            localStorage.setItem("myComments", JSON.stringify(updated));
            return updated;
        });
    };

    // 전체 새로고침
    const refreshAll = () => {
        fetchAll();
    };

    return (
        <MyContentContext.Provider
            value={{
                written,
                comments,
                addWritten,
                removeWritten,
                addComment,
                removeComment,
                refreshAll,
            }}
        >
            {children}
        </MyContentContext.Provider>
    );
};