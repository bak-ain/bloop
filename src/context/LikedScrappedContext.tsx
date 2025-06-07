import { createContext, useContext, useState, useEffect } from "react";

interface LikedScrappedContextType {
  artistLikedIds: string[];
  setArtistLikedIds: React.Dispatch<React.SetStateAction<string[]>>;
  fanLikedIds: string[];
  setFanLikedIds: React.Dispatch<React.SetStateAction<string[]>>;
  artistScrappedIds: string[];
  setArtistScrappedIds: React.Dispatch<React.SetStateAction<string[]>>;
  fanScrappedIds: string[];
  setFanScrappedIds: React.Dispatch<React.SetStateAction<string[]>>;
  postLikeCounts: Record<string, number>;
  setPostLikeCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  toggleLike: (type: "artist" | "fan", postId: string, defaultLikes: number) => void;
  toggleScrap: (type: "artist" | "fan", postId: string) => void;
}

const LikedScrappedContext = createContext<LikedScrappedContextType | null>(null);

export const useLikedScrapped = () => {
  const ctx = useContext(LikedScrappedContext);
  if (!ctx) throw new Error("useLikedScrapped must be used within LikedScrappedProvider");
  return ctx;
};

export const LikedScrappedProvider = ({ children }: { children: React.ReactNode }) => {
  // useState의 초기값에서 localStorage 값을 읽어오도록 수정
  const [artistLikedIds, setArtistLikedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("artistLikedPosts") || "[]")
  );
  const [fanLikedIds, setFanLikedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("fanLikedPosts") || "[]")
  );
  const [artistScrappedIds, setArtistScrappedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("artistScrappedPosts") || "[]")
  );
  const [fanScrappedIds, setFanScrappedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("fanScrappedPosts") || "[]")
  );
  const [postLikeCounts, setPostLikeCounts] = useState<Record<string, number>>(
    () => JSON.parse(localStorage.getItem("postLikeCounts") || "{}")
  );

  // 변경사항이 있을 때만 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("artistLikedPosts", JSON.stringify(artistLikedIds));
  }, [artistLikedIds]);
  useEffect(() => {
    localStorage.setItem("fanLikedPosts", JSON.stringify(fanLikedIds));
  }, [fanLikedIds]);
  useEffect(() => {
    localStorage.setItem("artistScrappedPosts", JSON.stringify(artistScrappedIds));
  }, [artistScrappedIds]);
  useEffect(() => {
    localStorage.setItem("fanScrappedPosts", JSON.stringify(fanScrappedIds));
  }, [fanScrappedIds]);
  useEffect(() => {
    localStorage.setItem("postLikeCounts", JSON.stringify(postLikeCounts));
  }, [postLikeCounts]);

  // 좋아요 토글 시 likeCount도 함께 관리
  const toggleLike = (type: "artist" | "fan", postId: string, defaultLikes: number) => {
    if (type === "artist") {
      setArtistLikedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    } else {
      setFanLikedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    }
    setPostLikeCounts((prev) => {
      const liked =
        (type === "artist" ? artistLikedIds : fanLikedIds).includes(postId);
      const current = prev[postId] ?? defaultLikes;
      return {
        ...prev,
        [postId]: liked ? Math.max(current - 1, 0) : current + 1,
      };
    });
  };

  const toggleScrap = (type: "artist" | "fan", postId: string) => {
    if (type === "artist") {
      setArtistScrappedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    } else {
      setFanScrappedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    }
  };

  return (
    <LikedScrappedContext.Provider
      value={{
        artistLikedIds, setArtistLikedIds,
        fanLikedIds, setFanLikedIds,
        artistScrappedIds, setArtistScrappedIds,
        fanScrappedIds, setFanScrappedIds,
        postLikeCounts, setPostLikeCounts,
        toggleLike, toggleScrap
      }}
    >
      {children}
    </LikedScrappedContext.Provider>
  );
};