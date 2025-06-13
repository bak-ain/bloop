import { createContext, useContext, useState, useEffect } from "react";
import { ArtistPost, FanPost, OfficialContent } from "../types";

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
  artistLikedPosts: ArtistPost[];
  setArtistLikedPosts: React.Dispatch<React.SetStateAction<ArtistPost[]>>;
  fanLikedPosts: FanPost[];
  setFanLikedPosts: React.Dispatch<React.SetStateAction<FanPost[]>>;
  officialLikedPosts: OfficialContent[];
  setOfficialLikedPosts: React.Dispatch<React.SetStateAction<OfficialContent[]>>;
  artistScrappedPosts: ArtistPost[];
  setArtistScrappedPosts: React.Dispatch<React.SetStateAction<ArtistPost[]>>;
  fanScrappedPosts: FanPost[];
  setFanScrappedPosts: React.Dispatch<React.SetStateAction<FanPost[]>>;
  officialScrappedPosts: OfficialContent[];
  setOfficialScrappedPosts: React.Dispatch<React.SetStateAction<OfficialContent[]>>;
  toggleLike: (
    type: "artist" | "fan" | "official",
    postId: string,
    defaultLikes: number,
    postData?: ArtistPost | FanPost | OfficialContent
  ) => void;
  toggleScrap: (
    type: "artist" | "fan" | "official",
    postId: string,
    postData?: ArtistPost | FanPost | OfficialContent
  ) => void;
}

const LikedScrappedContext = createContext<LikedScrappedContextType | null>(null);

export const useLikedScrapped = () => {
  const ctx = useContext(LikedScrappedContext);
  if (!ctx) throw new Error("useLikedScrapped must be used within LikedScrappedProvider");
  return ctx;
};

export const LikedScrappedProvider = ({
  children,
  posts // { artist: ArtistPost[], fan: FanPost[], official: OfficialContent[] }
}: {
  children: React.ReactNode;
  posts?: {
    artist?: ArtistPost[];
    fan?: FanPost[];
    official?: OfficialContent[];
  };
}) => {
  // 1. posts에서 isLiked/isScrapped가 true인 id 추출
  const artistLikedInit = posts?.artist?.filter(p => p.isLiked).map(p => p.id) ?? [];
  const fanLikedInit = posts?.fan?.filter(p => p.isLiked).map(p => p.id) ?? [];
  const officialLikedInit = posts?.official?.filter(p => p.isLiked).map(p => p.id) ?? [];
  const artistScrappedInit = posts?.artist?.filter(p => p.isScrapped).map(p => p.id) ?? [];
  const fanScrappedInit = posts?.fan?.filter(p => p.isScrapped).map(p => p.id) ?? [];
  const officialScrappedInit = posts?.official?.filter(p => p.isScrapped).map(p => p.id) ?? [];
  
  // 2. localStorage에 값이 있으면 그걸 우선, 없으면 위에서 추출한 초기값 사용
  const [artistLikedIds, setArtistLikedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("artistLikedPosts") || JSON.stringify(artistLikedInit))
  );
  const [fanLikedIds, setFanLikedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("fanLikedPosts") || JSON.stringify(fanLikedInit))
  );
  const [officialLikedIds, setOfficialLikedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("officialLikedPosts") || JSON.stringify(officialLikedInit))
  );
  const [artistScrappedIds, setArtistScrappedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("artistScrappedPosts") || JSON.stringify(artistScrappedInit))
  );
  const [fanScrappedIds, setFanScrappedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("fanScrappedPosts") || JSON.stringify(fanScrappedInit))
  );
  const [officialScrappedIds, setOfficialScrappedIds] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("officialScrappedPosts") || JSON.stringify(officialScrappedInit))
  );
  const [postLikeCounts, setPostLikeCounts] = useState<Record<string, number>>(
    () => JSON.parse(localStorage.getItem("postLikeCounts") || "{}")
  );

  const [artistLikedPosts, setArtistLikedPosts] = useState<ArtistPost[]>(
    () => {
      const saved = localStorage.getItem("artistLikedPostsData");
      if (saved) return JSON.parse(saved);
      return posts?.artist?.filter(p => p.isLiked) ?? [];
    }
  );
  const [fanLikedPosts, setFanLikedPosts] = useState<FanPost[]>(
    () => {
      const saved = localStorage.getItem("fanLikedPostsData");
      if (saved) return JSON.parse(saved);
      return posts?.fan?.filter(p => p.isLiked) ?? [];
    }
  );
  const [officialLikedPosts, setOfficialLikedPosts] = useState<OfficialContent[]>(
    () => {
      const saved = localStorage.getItem("officialLikedPostsData");
      if (saved) return JSON.parse(saved);
      return posts?.official?.filter(p => p.isLiked) ?? [];
    }
  );

  const [artistScrappedPosts, setArtistScrappedPosts] = useState<ArtistPost[]>(
    () => {
      const saved = localStorage.getItem("artistScrappedPostsData");
      if (saved) return JSON.parse(saved);
      return posts?.artist?.filter(p => p.isScrapped) ?? [];
    }
  );
  const [fanScrappedPosts, setFanScrappedPosts] = useState<FanPost[]>(
    () => {
      const saved = localStorage.getItem("fanScrappedPostsData");
      if (saved) return JSON.parse(saved);
      return posts?.fan?.filter(p => p.isScrapped) ?? [];
    }
  );
  const [officialScrappedPosts, setOfficialScrappedPosts] = useState<OfficialContent[]>(
    () => {
      const saved = localStorage.getItem("officialScrappedPostsData");
      if (saved) return JSON.parse(saved);
      return posts?.official?.filter(p => p.isScrapped) ?? [];
    }
  );
  // localStorage 동기화
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
  useEffect(() => {
    localStorage.setItem("artistLikedPostsData", JSON.stringify(artistLikedPosts));
  }, [artistLikedPosts]);
  useEffect(() => {
    localStorage.setItem("fanLikedPostsData", JSON.stringify(fanLikedPosts));
  }, [fanLikedPosts]);
  useEffect(() => {
    localStorage.setItem("officialLikedPostsData", JSON.stringify(officialLikedPosts));
  }, [officialLikedPosts]);
  useEffect(() => {
    localStorage.setItem("artistScrappedPostsData", JSON.stringify(artistScrappedPosts));
  }, [artistScrappedPosts]);
  useEffect(() => {
    localStorage.setItem("fanScrappedPostsData", JSON.stringify(fanScrappedPosts));
  }, [fanScrappedPosts]);
  useEffect(() => {
    localStorage.setItem("officialScrappedPostsData", JSON.stringify(officialScrappedPosts));
  }, [officialScrappedPosts]);

  // 좋아요 토글 시 게시물 데이터도 함께 관리
  const toggleLike = (
    type: "artist" | "fan" | "official",
    postId: string,
    defaultLikes: number,
    postData?: ArtistPost | FanPost | OfficialContent
  ) => {
    if (type === "artist") {
      setArtistLikedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
      setArtistLikedPosts((prev) => {
        if (prev.find((p) => p.id === postId)) {
          // 이미 있으면 제거
          return prev.filter((p) => p.id !== postId);
        } else if (postData && "user" in postData) {
          // 없으면 추가 (타입 가드)
          return [...prev, postData as ArtistPost];
        }
        return prev;
      });
    } else if (type === "fan") {
      setFanLikedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
      setFanLikedPosts((prev) => {
        if (prev.find((p) => p.id === postId)) {
          return prev.filter((p) => p.id !== postId);
        } else if (postData && "user" in postData) {
          return [...prev, postData as FanPost];
        }
        return prev;
      });
    } else {
      setOfficialLikedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
      setOfficialLikedPosts((prev) => {
        if (prev.find((p) => p.id === postId)) {
          return prev.filter((p) => p.id !== postId);
        } else if (postData && !("user" in postData)) {
          // user가 없으면 OfficialContent로 간주
          return [...prev, postData as OfficialContent];
        }
        return prev;
      });
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

  // 스크랩 토글 시 게시물 데이터도 함께 관리
  const toggleScrap = (
    type: "artist" | "fan" | "official",
    postId: string,
    postData?: ArtistPost | FanPost | OfficialContent
  ) => {
    if (type === "artist") {
      setArtistScrappedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
      setArtistScrappedPosts((prev) => {
        if (prev.find((p) => p.id === postId)) {
          return prev.filter((p) => p.id !== postId);
        } else if (postData && "user" in postData) {
          return [...prev, postData as ArtistPost];
        }
        return prev;
      });
    } else if (type === "fan") {
      setFanScrappedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
      setFanScrappedPosts((prev) => {
        if (prev.find((p) => p.id === postId)) {
          return prev.filter((p) => p.id !== postId);
        } else if (postData && "user" in postData) {
          return [...prev, postData as FanPost];
        }
        return prev;
      });
    } else {
      setOfficialScrappedIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
      setOfficialScrappedPosts((prev) => {
        if (prev.find((p) => p.id === postId)) {
          return prev.filter((p) => p.id !== postId);
        } else if (postData && !("user" in postData)) {
          return [...prev, postData as OfficialContent];
        }
        return prev;
      });
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
        artistLikedPosts, setArtistLikedPosts,
        fanLikedPosts, setFanLikedPosts,
        officialLikedPosts, setOfficialLikedPosts,
        artistScrappedPosts, setArtistScrappedPosts,
        fanScrappedPosts, setFanScrappedPosts,
        officialScrappedPosts, setOfficialScrappedPosts,
        toggleLike, toggleScrap
      }}
    >
      {children}
    </LikedScrappedContext.Provider>
  );
};