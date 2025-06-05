import { createContext, useContext, useEffect, useState } from "react";
import { ArtistPost, CommentPost, CommentInput } from "../types";
import {
  updateLikeStatus,
  updateScrapStatus,
  updateCommentListAndCount,
} from "../utils/postUtils";

interface ArtistPostContextType {
  postList: ArtistPost[];
  setPostList: React.Dispatch<React.SetStateAction<ArtistPost[]>>;

  likedPostIds: string[];
  setLikedPostIds: React.Dispatch<React.SetStateAction<string[]>>;

  scrappedPostIds: string[];
  setScrappedPostIds: React.Dispatch<React.SetStateAction<string[]>>;

  commentsMap: Record<string, CommentPost[]>;
  setCommentsMap: React.Dispatch<React.SetStateAction<Record<string, CommentPost[]>>>;

  toggleLike: (post: ArtistPost) => void;
  toggleScrap: (post: ArtistPost) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
  submitComment: (post: ArtistPost, input: CommentInput, replyToId?: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
}

const ArtistPostContext = createContext<ArtistPostContextType | null>(null);

export const useArtistPost = () => {
  const context = useContext(ArtistPostContext);
  if (!context) {
    throw new Error("useArtistPost must be used within ArtistPostProvider");
  }
  return context;
};

export const ArtistPostProvider = ({ children }: { children: React.ReactNode }) => {
  const [postList, setPostList] = useState<ArtistPost[]>(() => {
    const stored = localStorage.getItem("artistPostList");
    return stored ? JSON.parse(stored) : [];
  });

  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("artistLikedPosts") || "[]");
  });

  const [scrappedPostIds, setScrappedPostIds] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("artistScrappedPosts") || "[]");
  });

  const [commentsMap, setCommentsMap] = useState<Record<string, CommentPost[]>>(() => {
    const all: Record<string, CommentPost[]> = {};
    const stored = localStorage.getItem("artistPostList");
    const parsed: ArtistPost[] = stored ? JSON.parse(stored) : [];
    parsed.forEach((post) => {
      const raw = localStorage.getItem(`comments_${post.id}`);
      if (raw) {
        all[post.id] = JSON.parse(raw);
      }
    });
    return all;
  });

  useEffect(() => {
    localStorage.setItem("artistPostList", JSON.stringify(postList));
  }, [postList]);

  useEffect(() => {
    localStorage.setItem("artistLikedPosts", JSON.stringify(likedPostIds));
  }, [likedPostIds]);

  useEffect(() => {
    localStorage.setItem("artistScrappedPosts", JSON.stringify(scrappedPostIds));
  }, [scrappedPostIds]);

  useEffect(() => {
    Object.entries(commentsMap).forEach(([postId, comments]) => {
      localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
    });
  }, [commentsMap]);

  const toggleLike = (post: ArtistPost) => {
    const isNowLiked = !likedPostIds.includes(post.id);
    const result = updateLikeStatus(post, isNowLiked, likedPostIds, postList, "artist");
    setLikedPostIds(result.updatedLikes);
    setPostList(result.updatedPostList);
  };

  const toggleScrap = (post: ArtistPost) => {
    const isNowScrapped = !scrappedPostIds.includes(post.id);
    const result = updateScrapStatus(post, isNowScrapped, scrappedPostIds, postList, "artist");
    setScrappedPostIds(result.updatedScraps);
    setPostList(result.updatedPostList);
  };

  const toggleCommentLike = (postId: string, commentId: string) => {
    setCommentsMap((prev) => {
      const updated = prev[postId]?.map((c) =>
        c.id === commentId
          ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
          : {
              ...c,
              replies: c.replies?.map((r) =>
                r.id === commentId
                  ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
                  : r
              ) || [],
            }
      ) ?? [];
      return { ...prev, [postId]: updated };
    });
  };

  const submitComment = (post: ArtistPost, input: CommentInput, replyToId?: string) => {
    const newComment: CommentPost = {
      id: String(Date.now()),
      postId: post.id,
      postType: "artist",
      user: {
        name: "me",
        profileImage: "/images/profiles/me.png",
        badgeType: "fan",
        badgeLevel: 1,
        userId: "me123",
      },
      content: input.content,
      emoji: input.emoji,
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false,
      editable: true,
      replies: [],
    };

    setCommentsMap((prev) => {
      const current = prev[post.id] || [];
      let updated: CommentPost[];

      if (replyToId) {
        updated = current.map((c) =>
          c.id === replyToId
            ? {
                ...c,
                replies: [...(c.replies || []), newComment],
              }
            : c
        );
      } else {
        const result = updateCommentListAndCount(newComment, post, current, postList, "artist");
        setPostList(result.updatedPostList);
        updated = result.updatedComments;
      }

      return { ...prev, [post.id]: updated };
    });
  };

  const deleteComment = (postId: string, commentId: string) => {
    setCommentsMap((prev) => {
      const updated = (prev[postId] || [])
        .map((c) => {
          if (c.id === commentId) return null;
          if (c.replies?.length) {
            const filteredReplies = c.replies.filter((r) => r.id !== commentId);
            return { ...c, replies: filteredReplies };
          }
          return c;
        })
        .filter((c): c is CommentPost => c !== null);

      return { ...prev, [postId]: updated };
    });
  };

  return (
    <ArtistPostContext.Provider
      value={{
        postList,
        setPostList,
        likedPostIds,
        setLikedPostIds,
        scrappedPostIds,
        setScrappedPostIds,
        commentsMap,
        setCommentsMap,
        toggleLike,
        toggleScrap,
        toggleCommentLike,
        submitComment,
        deleteComment,
      }}
    >
      {children}
    </ArtistPostContext.Provider>
  );
};
