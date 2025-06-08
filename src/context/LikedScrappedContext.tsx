import { createContext, useContext, useState, useEffect } from "react";

interface LikedScrappedContextType {
  artistLikedIds: string[];
  setArtistLikedIds: React.Dispatch<React.SetStateAction<string[]>>;
  fanLikedIds: string[];
  setFanLikedIds: React.Dispatch<React.SetStateAction<string[]>>;
  officialLikedIds: string[];
  setOfficialLikedIds: React.Dispatch<React.SetStateAction<string[]>>;
  artistScrappedIds: string[];
  setArtistScrappedIds: React.Dispatch<React.SetStateAction<string[]>>;
  fanScrappedIds: string[];
  setFanScrappedIds: React.Dispatch<React.SetStateAction<string[]>>;
  officialScrappedIds: string[];
  setOfficialScrappedIds: React.Dispatch<React.SetStateAction<string[]>>;
  postLikeCounts: Record<string, number>;
  setPostLikeCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  toggleLike: (type: "artist" | "fan" | "official", postId: string, defaultLikes: number) => void;
  toggleScrap: (type: "artist" | "fan" | "official", postId: string) => void;
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
  const [officialLikedIds, setOfficialLikedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("officialLikedPosts") || "[]")
  );
  const [artistScrappedIds, setArtistScrappedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("artistScrappedPosts") || "[]")
  );
  const [fanScrappedIds, setFanScrappedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("fanScrappedPosts") || "[]")
  );
  const [officialScrappedIds, setOfficialScrappedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("officialScrappedPosts") || "[]")
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
    localStorage.setItem("officialLikedPosts", JSON.stringify(officialLikedIds));
  }, [officialLikedIds]);
  useEffect(() => {
    localStorage.setItem("artistScrappedPosts", JSON.stringify(artistScrappedIds));
  }, [artistScrappedIds]);
  useEffect(() => {
    localStorage.setItem("fanScrappedPosts", JSON.stringify(fanScrappedIds));
  }, [fanScrappedIds]);
  useEffect(() => {
    localStorage.setItem("officialScrappedPosts", JSON.stringify(officialScrappedIds));
  }, [officialScrappedIds]);
  useEffect(() => {
    localStorage.setItem("postLikeCounts", JSON.stringify(postLikeCounts));
  }, [postLikeCounts]);

  // 좋아요 토글 시 likeCount도 함께 관리
  const toggleLike = (type: "artist" | "fan" | "official", postId: string, defaultLikes: number) => {
    if (type === "artist") {
      setArtistLikedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    } else if (type === "fan") {
      setFanLikedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    } else {
      setOfficialLikedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    }
    setPostLikeCounts((prev) => {
      let liked = false;
      if (type === "artist") liked = artistLikedIds.includes(postId);
      else if (type === "fan") liked = fanLikedIds.includes(postId);
      else liked = officialLikedIds.includes(postId);
      const current = prev[postId] ?? defaultLikes;
      return {
        ...prev,
        [postId]: liked ? Math.max(current - 1, 0) : current + 1,
      };
    });
  };

  const toggleScrap = (type: "artist" | "fan" | "official", postId: string) => {
    if (type === "artist") {
      setArtistScrappedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    } else if (type === "fan") {
      setFanScrappedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    } else {
      setOfficialScrappedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    }
  };

  return (
    <LikedScrappedContext.Provider
      value={{
        artistLikedIds, setArtistLikedIds,
        fanLikedIds, setFanLikedIds,
        officialLikedIds, setOfficialLikedIds,
        artistScrappedIds, setArtistScrappedIds,
        fanScrappedIds, setFanScrappedIds,
        officialScrappedIds, setOfficialScrappedIds,
        postLikeCounts, setPostLikeCounts,
        toggleLike, toggleScrap
      }}
    >
      {children}
    </LikedScrappedContext.Provider>
  );
};