import React, { useState } from 'react';
import Container from '../components/Container';
import styles from './Mypage.module.css';
import MyContentsCard from '../components/MyContentsCard';
import { useMyContent } from '../context/MyContentContext';
import { useLikedScrapped } from '../context/LikedScrappedContext';
import { useComment } from '../context/CommentContext';

// import writtenMock from '../../public/data/myWritten.json'; // 삭제!

const tabList = [
  { key: 'written', label: '게시물' },
  { key: 'comment', label: '댓글' },
  { key: 'liked', label: '좋아요' },
];

const MyEcho = () => {
  const [tab, setTab] = useState<'written' | 'comment' | 'liked'>('written');
  const { written, comments } = useMyContent();
  const { artistLikedIds, fanLikedIds, officialLikedIds } = useLikedScrapped();
  const { myComments } = useComment();

  // 좋아요 탭: 내가 좋아요한 모든 게시물 id를 합침
  const likedIds = [...artistLikedIds, ...fanLikedIds, ...officialLikedIds];

  // written: MyContentContext에서 이미 목데이터+로컬 합쳐서 관리함
  let items: any[] = [];
  if (tab === 'written') items = written;
  else if (tab === 'comment') items = myComments.length > 0 ? myComments : comments;
  else if (tab === 'liked') items = written.filter(post => likedIds.includes(post.id));

  return (
    <Container>
      <div className={`${styles.myechoBg} ${styles.myBg}`} />
      <div className={`${styles.myechoWrap} inner`}>
        {/* 탭바 */}
        <div className={styles.tabBar}>
          {tabList.map((t) => (
            <button
              key={t.key}
              className={`${styles.tabBtn} ${tab === t.key ? styles.active : ''}`}
              onClick={() => setTab(t.key as typeof tab)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* 카드 리스트 */}
        <MyContentsCard items={items} type={tab} />
      </div>
    </Container>
  );
};

export default MyEcho;