import React from "react";
import Container from "../components/Container";
import styles from "./Mypage.module.css";
import type { UserPreview, UserLevelStatus } from "../types";
import { getBadgeImage, getLevelBadgeIcon } from "../utils/badge";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext ";

// 로그인 유저 정보 사용
const Mypage = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();

    // 비회원 접근 시 처리
    if (!user) {
        return (
            <Container>
                <div className={styles.mypageWrap}>
                    <div className={styles.notLoginMsg}>
                        마이페이지는 로그인 후 이용 가능합니다.
                    </div>
                </div>
            </Container>
        );
    }

    // user에서 필요한 정보 추출 (UserPreview 형태로 가공)
    const userPreview: UserPreview = {
        name: user.name,
        profileImage: (user as any).profileImage || "/images/emoji1.png",
        badgeType: user.userType === "agency" ? "artist" : user.userType,
        badgeLevel: user.userType === "fan" ? (user as any).badgeLevel ?? 1 : 1,
        userId: user.id,
        nickname: (user as any).nickname || "비스러버",
    };

    // 임시 등급 데이터 (실제 서비스에서는 user 데이터 기반으로 변경)
    const mockLevel: UserLevelStatus = {
        currentLevel: "BLING",
        nextLevel: "LOOPY",
        progress: 62,
        remaining: {
            posts: 3,
            comments: 7,
        },
        badgeIconUrl: getLevelBadgeIcon("BLING"),
    };

    return (
        <Container>
            <div className="all_p_t">
                <div className={`${styles.mypageWrap}  inner`}>
                    <div className={`${styles.profileSection} ${styles.mypageSection}`}>
                        <div className={styles.profileCard}>
                            <div className={styles.profileTop}>
                                <img
                                    src={userPreview.profileImage}
                                    alt={userPreview.name}
                                    className={styles.profileImg}
                                />
                                {userPreview.badgeType === "fan" && (
                                    <img
                                        className={styles.badge_img}
                                        src={getBadgeImage(
                                            userPreview.badgeType,
                                            userPreview.badgeLevel
                                        )}
                                        alt="badge"
                                    />
                                )}
                            </div>
                            <div className={styles.profileInfo}>
                                <p className={styles.profileName}>{userPreview.nickname} 님</p>
                                <span className={styles.profileId}>@{userPreview.userId}</span>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.levelSection} ${styles.mypageSection}`}>
                        <div className={styles.levelCard}>
                            <div className={styles.levelInfo}>
                                <div className={styles.levelLabel}>
                                    현재 {userPreview.nickname}님의 등급은
                                </div>
                                <div className={styles.levelName}>
                                    <span>BLING</span>
                                </div>
                                <div className={styles.levelDesc}>
                                    다음 등급까지 게시물 <b>{mockLevel.remaining.posts}개</b>, 댓글 <b>{mockLevel.remaining.comments}개</b> 남았습니다.
                                </div>
                                <button
                                    className={`${styles.levelBtn} btnBlueS btn_txt`}
                                    onClick={() => navigate("/levelguide")}
                                >
                                    등급안내
                                </button>
                            </div>
                            <div className={styles.levelProgressWrap}>
                                <div className={styles.levelProgressCircle}>
                                    <svg width="170" height="170">
                                        <circle
                                            cx="85"
                                            cy="85"
                                            r="72"
                                            stroke="#e0e0e0"
                                            strokeWidth="10"
                                            fill="none"
                                        />
                                        <circle
                                            cx="85"
                                            cy="85"
                                            r="72"
                                            stroke="#419DDF"
                                            strokeWidth="10"
                                            fill="none"
                                            strokeDasharray={2 * Math.PI * 72}
                                            strokeDashoffset={2 * Math.PI * 72 * (1 - mockLevel.progress / 100)}
                                            strokeLinecap="round"
                                            style={{ transition: "stroke-dashoffset 0.5s" }}
                                        />
                                    </svg>
                                    <div className={styles.levelProgressInner}>
                                        <img
                                            src={getLevelBadgeIcon(mockLevel.nextLevel ?? mockLevel.currentLevel)}
                                            alt={mockLevel.nextLevel ?? mockLevel.currentLevel}
                                            className={styles.levelBadge}
                                        />
                                        <div className={styles.levelProgressPercent}>{mockLevel.progress}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.fanMbtiSection} ${styles.mypageSection}`}>
                        <div className={styles.fanMbtiCard}>
                            <img
                                src="/images/mypage/heartMaster.png"
                                alt="하트마스터"
                                className={styles.heartIcon}
                            />
                            <h3 className={styles.fanMbtiTitle}>하트마스터</h3>
                            <p className={styles.fanMbtiDesc}>
                                하루 평균 좋아요 5개가 넘어가는 당신은 반응만으로도 진심이 느껴지는 팬이에요!
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.menuSection} ${styles.mypageSection}`}>
                        <div className={styles.menuGrid}>
                            <div
                                className={styles.menuItem}
                                onClick={() => navigate("/myecho")}
                            >
                                <img src="/images/icon/echo.png" alt="My Echo" className={styles.menuIcon} />
                                <span className={styles.menuLabel}>My Echo</span>
                            </div>
                            <div
                                className={styles.menuItem}
                                onClick={() => navigate("/mypop")}
                            >
                                <img src="/images/icon/pop_on_icon.png" alt="My POP!" className={styles.menuIcon} />
                                <span className={styles.menuLabel}>My POP!</span>
                            </div>
                            <div
                                className={styles.menuItem}
                                onClick={() => navigate("/mymood")}
                            >
                                <img src="/images/icon/mood.png" alt="My Mood" className={styles.menuIcon} />
                                <span className={styles.menuLabel}>My Mood</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container >
    );
};

export default Mypage;