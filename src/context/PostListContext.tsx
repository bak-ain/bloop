import { createContext, useContext, useState, useEffect } from "react";
import { ArtistPost, FanPost } from "../types";

interface PostListContextType {
    artistPosts: ArtistPost[];
    setArtistPosts: React.Dispatch<React.SetStateAction<ArtistPost[]>>;
    fanPosts: FanPost[];
    setFanPosts: React.Dispatch<React.SetStateAction<FanPost[]>>;
}

const PostListContext = createContext<PostListContextType | null>(null);

export const usePostList = () => {
    const ctx = useContext(PostListContext);
    if (!ctx) throw new Error("usePostList must be used within PostListProvider");
    return ctx;
};

export const PostListProvider = ({ children }: { children: React.ReactNode }) => {
    const [artistPosts, setArtistPosts] = useState<ArtistPost[]>([]);
    const [fanPosts, setFanPosts] = useState<FanPost[]>([]);

    useEffect(() => {
        // 아티스트 피드
        const storedArtistPosts = JSON.parse(localStorage.getItem("artistPostList") || "null");
        if (storedArtistPosts) {
            setArtistPosts(storedArtistPosts);
        } else {
            fetch("/data/posts.json")
                .then((res) => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then((data) => {
                    setArtistPosts(data.artist);
                    localStorage.setItem("artistPostList", JSON.stringify(data.artist));
                })
                .catch((err) => {
                    console.error("아티스트 피드 fetch 실패:", err);
                });
        }

        // 팬 피드
        const storedFanPosts = JSON.parse(localStorage.getItem("fanPostList") || "null");
        if (storedFanPosts) {
            setFanPosts(storedFanPosts);
        } else {
            fetch("/data/posts.json")
                .then((res) => res.json())
                .then((data) => {
                    setFanPosts(data.fan);
                    localStorage.setItem("fanPostList", JSON.stringify(data.fan));
                });
        }
    }, []);

    // 변경 시 localStorage 동기화
    useEffect(() => {
        if (artistPosts.length > 0) {
            localStorage.setItem("artistPostList", JSON.stringify(artistPosts));
        }
    }, [artistPosts]);

    useEffect(() => {
        if (fanPosts.length > 0) {
            localStorage.setItem("fanPostList", JSON.stringify(fanPosts));
        }
    }, [fanPosts]);

    return (
        <PostListContext.Provider value={{ artistPosts, setArtistPosts, fanPosts, setFanPosts }}>
            {children}
        </PostListContext.Provider>
    );
};