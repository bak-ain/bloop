import React, { useState, useEffect } from 'react';
import Container from '../components/Container';
import styles from './Myecho.module.css';
import MyContentsCard from '../components/MyContentsCard';
import { useMyContent } from '../context/MyContentContext';
import { useLikedScrapped } from '../context/LikedScrappedContext';
import { useComment } from '../context/CommentContext';
import Popup from '../components/Popup';
import { usePostList } from '../context/PostListContext';
import type { ArtistPost, FanPost, OfficialContent, MyCommentPost } from '../types';
import { useNavigate } from "react-router-dom";


const PAGE_SIZE = 5;

const tabList = [
  { key: 'written', label: '게시물' },
  { key: 'comment', label: '댓글' },
  { key: 'liked', label: '좋아요' },
];

function isArtistPost(post: ArtistPost | FanPost): post is ArtistPost {
  return (post as ArtistPost).user?.badgeType === "artist";
}
function isOfficialContent(post: any): post is OfficialContent {
  return (
    post &&
    typeof post === "object" &&
    "type" in post &&
    (
      post.type === "new" ||
      post.type === "imageOnly" ||
      post.type === "feature" ||
      post.type === "default"
    )
  );
}

const MyEcho = () => {

  const navigate = useNavigate();
  // 탭 상태 초기화 시 localStorage에서 읽어오기
  const [tab, setTab] = useState<'written' | 'comment' | 'liked'>(() => {
    return (localStorage.getItem("myEchoTab") as 'written' | 'comment' | 'liked') || 'written';
  });
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ArtistPost | FanPost | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editPost, setEditPost] = useState<FanPost | null>(null);

  const { written, comments, setWritten } = useMyContent();
  const { artistPosts, setArtistPosts, fanPosts, setFanPosts } = usePostList();
  const {
    artistLikedPosts,
    fanLikedPosts,
    officialLikedPosts,
    setArtistLikedPosts,
    setFanLikedPosts,
    setOfficialLikedPosts,
  } = useLikedScrapped();
  const { myComments, setMyComments } = useComment();
  const allPosts: (ArtistPost | FanPost)[] = [...artistPosts, ...fanPosts];
  // commentItems 생성 시
  const commentItems = comments.map(comment => {
    const parentPost = allPosts.find(post => post.id === comment.postId);
    return {
      ...comment,
      parentDescription: parentPost?.description || ""
    };
  }) as (MyCommentPost & { parentDescription?: string })[];

  // ...생략...
  let items: any[] = [];
  if (tab === 'written') items = written.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  else if (tab === 'comment') items = (myComments.length > 0 ? myComments : comments).slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  else if (tab === 'liked') items = [
    ...artistLikedPosts,
    ...fanLikedPosts,
    ...officialLikedPosts
  ].slice().sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime());

  const [page, setPage] = useState(1);
  // 페이지네이션 적용
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pagedItems = items.slice(startIdx, endIdx);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);



  const handleTabChange = (newTab: 'written' | 'comment' | 'liked') => {
    setTab(newTab);
    localStorage.setItem("myEchoTab", newTab);
    setEditMode(false);
    setCheckedIds([]);
  };

  // 페이지 이탈 시 localStorage에서 myPopTab 삭제
  useEffect(() => {
    return () => {
      localStorage.removeItem("myEchoTab");
    };
  }, []);

  const handleCheck = (id: string) => {
    setCheckedIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (tab === 'written') {
      setWritten(written.filter(w => !checkedIds.includes(w.id)));
    } else if (tab === 'comment') {
      setMyComments(myComments.filter(c => !checkedIds.includes(c.id)));
    } else if (tab === 'liked') {
      setArtistLikedPosts(artistLikedPosts.filter(p => !checkedIds.includes(p.id)));
      setFanLikedPosts(fanLikedPosts.filter(p => !checkedIds.includes(p.id)));
      setOfficialLikedPosts(officialLikedPosts.filter(p => !checkedIds.includes(p.id)));
    }
    setCheckedIds([]);
    setEditMode(false);
  };
  // 페이지 변경 시 체크박스, 편집모드 초기화
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setCheckedIds([]);
    setEditMode(false);
  };

  const cardCount = items.length;
  const tabLabel = tabList.find(t => t.key === tab)?.label ?? '';

  return (
    <Container>
      <div className={`${styles.myechoBg} ${styles.myBg}`} />
      <div className={`${styles.myWrap} inner`}>
        <h3 className={`${styles.myTitle} ${styles.myEchoTitle} h3_tit`}>MY ECHO</h3>
        <div className={`${styles.tabContainer}`}>
          {/* 탭바 */}
          <div className={styles.tabBar}>
            {tabList.map((t) => (
              <button
                key={t.key}
                className={`${styles.tabBtn} ${tab === t.key ? styles.active : ''}`}
                onClick={() => handleTabChange(t.key as typeof tab)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {/* 카드 개수 & 편집/삭제 버튼 */}
        <div className={styles.cardHeaderRow}>
          <span className={styles.cardCount}>
            {tabLabel} <b>{cardCount > 0 ? `${cardCount}` : '0'}</b>
          </span>
          <button
            className={` ${styles.editBtn} btnWhite`}
            onClick={() => {
              if (editMode && checkedIds.length > 0) handleDelete();
              else setEditMode(e => !e);
            }}
          >
            {editMode ? '삭제' : '편집'}
          </button>
        </div>
        {/* 카드 리스트 */}
        <MyContentsCard
          items={tab === 'comment' ? commentItems : pagedItems}
          type={tab}
          editMode={editMode}
          checkedIds={checkedIds}
          onCheck={handleCheck}
          onCardClick={(item) => {
            if (editMode) {
              handleCheck(item.id);
              return;
            }
            if (isOfficialContent(item)) {
              navigate(`/official/${item.id}`);
            } else if (tab === 'comment') {
              // 댓글 클릭 시: postId로 원본 게시물 찾기
              const postId = item.postId;
              const post =
                artistPosts.find((p) => p.id === postId) ||
                fanPosts.find((p) => p.id === postId);
              if (post) {
                setSelectedPost(post);
                setPopupOpen(true);
              } else {
                alert("원본 게시물을 찾을 수 없습니다.");
              }
            } else {
              setSelectedPost(item);
              setPopupOpen(true);
            }
          }}
        />
        {/* 페이지네이션 UI */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                className={page === idx + 1 ? styles.activePage : ''}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
        {popupOpen && selectedPost && isArtistPost(selectedPost) && (
          <Popup
            type="artistFeed"
            data={selectedPost}
            onClose={() => setPopupOpen(false)}
            postList={artistPosts}
            setPostList={setArtistPosts}
          />
        )}
        {popupOpen && selectedPost && !isArtistPost(selectedPost) && !isOfficialContent(selectedPost) && (
          <Popup
            type="fanFeed"
            data={selectedPost}
            onClose={() => setPopupOpen(false)}
            postList={fanPosts}
            setPostList={setFanPosts}
            onEdit={(post) => {
              setEditPost(post);
              setEditPopupOpen(true);
              setPopupOpen(false);
            }}
          />
        )}

        {editPopupOpen && editPost && (
          <Popup
            type="edit"
            data={editPost}
            onClose={() => setEditPopupOpen(false)}
            onUpdate={(updated) => {
              setFanPosts((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
              );
              setEditPopupOpen(false);
              setSelectedPost(updated);
              setPopupOpen(true);
            }}
          />
        )}
      </div>
    </Container>
  );
};

export default MyEcho;