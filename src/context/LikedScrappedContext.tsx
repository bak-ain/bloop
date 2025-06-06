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
  toggleLike: (type: "artist" | "fan", postId: string) => void;
  toggleScrap: (type: "artist" | "fan", postId: string) => void;
}

const LikedScrappedContext = createContext<LikedScrappedContextType | null>(null);

export const useLikedScrapped = () => {
  const ctx = useContext(LikedScrappedContext);
  if (!ctx) throw new Error("useLikedScrapped must be used within LikedScrappedProvider");
  return ctx;
};

export const LikedScrappedProvider = ({ children }: { children: React.ReactNode }) => {
  const [artistLikedIds, setArtistLikedIds] = useState<string[]>([]);
  const [fanLikedIds, setFanLikedIds] = useState<string[]>([]);
  const [artistScrappedIds, setArtistScrappedIds] = useState<string[]>([]);
  const [fanScrappedIds, setFanScrappedIds] = useState<string[]>([]);

  useEffect(() => {
    // localStorage에서 불러오기
    setArtistLikedIds(JSON.parse(localStorage.getItem("artistLikedPosts") || "[]"));
    setFanLikedIds(JSON.parse(localStorage.getItem("fanLikedPosts") || "[]"));
    setArtistScrappedIds(JSON.parse(localStorage.getItem("artistScrappedPosts") || "[]"));
    setFanScrappedIds(JSON.parse(localStorage.getItem("fanScrappedPosts") || "[]"));
  }, []);

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

  const toggleLike = (type: "artist" | "fan", postId: string) => {
    if (type === "artist") {
      setArtistLikedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    } else {
      setFanLikedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    }
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
        toggleLike, toggleScrap
      }}
    >
      {children}
    </LikedScrappedContext.Provider>
  );
};