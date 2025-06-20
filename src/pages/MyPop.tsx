import React, { useState, useEffect } from 'react';
import Container from '../components/Container';
import styles from './Myecho.module.css';
import MyContentsCard from '../components/MyContentsCard';
import { useLikedScrapped } from '../context/LikedScrappedContext';
import Popup from '../components/Popup';
import { usePostList } from '../context/PostListContext';
import { useNavigate } from "react-router-dom";
import type { ArtistPost, FanPost, OfficialContent } from '../types';

const PAGE_SIZE = 5;

const tabList = [
    { key: 'scrap-official', label: '기획사' },
    { key: 'scrap-artist', label: '아티스트' },
    { key: 'scrap-fan', label: '커뮤니티' },
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

const MyPop = () => {
    const navigate = useNavigate();
    // 탭 상태를 localStorage에서 읽어오기
    const [tab, setTab] = useState<'scrap-official' | 'scrap-artist' | 'scrap-fan'>(() => {
        return (
            (localStorage.getItem("myPopTab") as 'scrap-official' | 'scrap-artist' | 'scrap-fan') ||
            'scrap-official'
        );
    });
    const [editMode, setEditMode] = useState(false);
    const [checkedIds, setCheckedIds] = useState<string[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<ArtistPost | FanPost | null>(null);

    const {
        fanScrappedPosts,
        artistScrappedPosts,
        officialScrappedPosts,
        setFanScrappedPosts,
        setArtistScrappedPosts,
        setOfficialScrappedPosts,
    } = useLikedScrapped();

    const { artistPosts, setArtistPosts, fanPosts, setFanPosts } = usePostList();


    let items: any[] = [];
    if (tab === 'scrap-fan') {
        items = fanScrappedPosts.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (tab === 'scrap-artist') {
        items = artistScrappedPosts.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (tab === 'scrap-official') {
        items = officialScrappedPosts.slice().sort(
            (a, b) =>
                new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
        );
    }

    // 탭 변경 핸들러
    const handleTabChange = (newTab: 'scrap-official' | 'scrap-artist' | 'scrap-fan') => {
        setTab(newTab);
        localStorage.setItem("myPopTab", newTab);
        setEditMode(false);
        setCheckedIds([]);
        setPage(1);
    };
    // 페이지 이탈 시 localStorage에서 myPopTab 삭제
    useEffect(() => {
        return () => {
            localStorage.removeItem("myPopTab");
        };
    }, []);

    // 페이지네이션
    const [page, setPage] = useState(1);
    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pagedItems = items.slice(startIdx, endIdx);
    const totalPages = Math.ceil(items.length / PAGE_SIZE);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setCheckedIds([]);
        setEditMode(false);
    };

    const handleCheck = (id: string) => {
        setCheckedIds(prev =>
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
        );
    };

    const handleDelete = () => {
        if (tab === 'scrap-fan') {
            const newList = fanScrappedPosts.filter(p => !checkedIds.includes(p.id));
            setFanScrappedPosts(newList);
            localStorage.setItem('fanScrappedPosts', JSON.stringify(newList));
        } else if (tab === 'scrap-artist') {
            const newList = artistScrappedPosts.filter(p => !checkedIds.includes(p.id));
            setArtistScrappedPosts(newList);
            localStorage.setItem('artistScrappedPosts', JSON.stringify(newList));
        } else if (tab === 'scrap-official') {
            const newList = officialScrappedPosts.filter(p => !checkedIds.includes(p.id));
            setOfficialScrappedPosts(newList);
            localStorage.setItem('officialScrappedPosts', JSON.stringify(newList));
        }
        setCheckedIds([]);
        setEditMode(false);
    };

    const cardCount = items.length;
    const tabLabel = tabList.find(t => t.key === tab)?.label ?? '';

    return (
        <Container>
            <div className={`${styles.myePopBg} ${styles.myBg}`} />
            <div className={`${styles.myWrap} inner`}>
                <h3 className={`${styles.myTitle} h3_tit`}>MY POP</h3>
                {/* 탭바 */}
                <div className={`${styles.tabContainer}`}>
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
                        POP!한 글 <b>{cardCount > 0 ? `${cardCount}` : '0'}</b>
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
                    items={pagedItems}
                    type={tab}
                    editMode={editMode}
                    checkedIds={checkedIds}
                    onCheck={handleCheck}
                    onCardClick={(post) => {
                        if (editMode) {
                            handleCheck(post.id);
                            return;
                        }
                        if (isOfficialContent(post)) {
                            navigate(`/official/${post.id}`);
                        } else {
                            setSelectedPost(post);
                            setPopupOpen(true);
                        }
                    }}
                />
                {/* 페이지네이션 */}
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
                {/* 팝업 */}
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
                    />
                )}
            </div>
        </Container>
    );
};

export default MyPop;