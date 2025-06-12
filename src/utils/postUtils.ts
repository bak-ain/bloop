import { ArtistPost, FanPost, CommentPost, MyCommentPost } from "../types";

export function updateLikeStatus<T extends ArtistPost | FanPost>(
  data: T,
  isLiked: boolean,
  likedPostIds: string[],
  postList: T[],
  feedType: "artist" | "fan"
): {
  updatedLikes: string[];
  updatedPostList: T[];
} {
  const updatedLikes = isLiked
    ? [...likedPostIds, data.id]
    : likedPostIds.filter((id) => id !== data.id);

  const updatedPostList = postList.map((p) =>
    p.id === data.id ? { ...p, likes: isLiked ? p.likes + 1 : Math.max(p.likes - 1, 0) } : p
  );

  const likedPostData: T[] = JSON.parse(localStorage.getItem(`${feedType}LikedPostData`) || "[]");
  const updatedLikedData = isLiked
    ? [...likedPostData, data]
    : likedPostData.filter((post) => post.id !== data.id);

  localStorage.setItem(`${feedType}LikedPosts`, JSON.stringify(updatedLikes));
  localStorage.setItem(`${feedType}PostList`, JSON.stringify(updatedPostList));
  localStorage.setItem(`${feedType}LikedPostData`, JSON.stringify(updatedLikedData));

  return { updatedLikes, updatedPostList };
}

export function updateScrapStatus<T extends ArtistPost | FanPost>(
  data: T,
  isScrapped: boolean,
  scrappedPostIds: string[],
  postList: T[],
  feedType: "artist" | "fan"
): {
  updatedScraps: string[];
  updatedPostList: T[];
} {
  const updatedScraps = isScrapped
    ? [...scrappedPostIds, data.id]
    : scrappedPostIds.filter((id) => id !== data.id);

  // ✅ postList 내부 데이터도 반영 (예: isScrapped 필드가 없다면 likes처럼 스크랩 수라도 넣을 수 있음)
  const updatedPostList = postList.map((p) =>
    p.id === data.id
      ? { ...p, scrapped: isScrapped } // 필드 없으면 추가
      : p
  );

  const scrappedPostData: T[] = JSON.parse(localStorage.getItem(`${feedType}ScrappedPostData`) || "[]");
  const updatedScrapData = isScrapped
    ? [...scrappedPostData, data]
    : scrappedPostData.filter((post) => post.id !== data.id);

  localStorage.setItem(`${feedType}ScrappedPosts`, JSON.stringify(updatedScraps));
  localStorage.setItem(`${feedType}PostList`, JSON.stringify(updatedPostList));
  localStorage.setItem(`${feedType}ScrappedPostData`, JSON.stringify(updatedScrapData));

  return { updatedScraps, updatedPostList };
}



export function updateCommentListAndCount<T extends ArtistPost | FanPost>(
  newComment: CommentPost,
  post: T,
  comments: CommentPost[],
  postList: T[],
  feedType: "artist" | "fan"
): {
  updatedComments: CommentPost[];
  updatedPostList: T[];
} {
  const updatedComments = [...comments, newComment];
  const updatedPostList = postList.map((p) =>
    p.id === post.id ? { ...p, comment: updatedComments.length } : p
  );

  localStorage.setItem(`comments_${post.id}`, JSON.stringify(updatedComments));
  localStorage.setItem(`${feedType}PostList`, JSON.stringify(updatedPostList));

  // MyCommentPost 저장도 함께 처리
  // const myComment: MyCommentPost = {
  //   id: newComment.id,
  //   viewType: "comment",
  //   parentTitle: post.description,
  //   content: newComment.content,
  //   date: newComment.date,
  //   editable: true,
  //   userId: newComment.user // Ensure newComment has user
  // };
  // const prevMyComments: MyCommentPost[] = JSON.parse(localStorage.getItem("myComments") || "[]");
  // localStorage.setItem("myComments", JSON.stringify([...prevMyComments, myComment]));

  return { updatedComments, updatedPostList };
}
