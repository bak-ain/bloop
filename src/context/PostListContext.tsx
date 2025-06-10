import { createContext, useContext, useState, useEffect } from "react";
import { ArtistPost, FanPost, OfficialContent } from "../types";

interface PostListContextType {
    artistPosts: ArtistPost[];
    setArtistPosts: React.Dispatch<React.SetStateAction<ArtistPost[]>>;
    fanPosts: FanPost[];
    setFanPosts: React.Dispatch<React.SetStateAction<FanPost[]>>;
    officialPosts: OfficialContent[];
    setOfficialPosts: React.Dispatch<React.SetStateAction<OfficialContent[]>>;
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
    const [officialPosts, setOfficialPosts] = useState<OfficialContent[]>([]);

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

        // 오피셜 피드
        const storedOfficialPosts = JSON.parse(localStorage.getItem("officialPostList") || "null");
        if (storedOfficialPosts) {
            setOfficialPosts(storedOfficialPosts);
        } else {
            fetch("/data/official.json")
                .then((res) => res.json())
                .then((data) => {
                    // official.json은 highlight, media, photo, behind 등으로 나뉘어 있으므로 합쳐서 배열로 저장
                    const allOfficial: OfficialContent[] = [
                        ...(data.highlight || []),
                        ...(data.media || []),
                        ...(data.photo || []),
                        ...(data.behind || []),
                    ].filter((item: any) => item && item.id); // 빈 객체 제거
                    setOfficialPosts(allOfficial);
                    localStorage.setItem("officialPostList", JSON.stringify(allOfficial));
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

    useEffect(() => {
        if (officialPosts.length > 0) {
            localStorage.setItem("officialPostList", JSON.stringify(officialPosts));
        }
    }, [officialPosts]);

    return (
        <PostListContext.Provider value={{ artistPosts, setArtistPosts, fanPosts, setFanPosts, officialPosts, setOfficialPosts }}>
            {children}
        </PostListContext.Provider>
    );
};