import Container from "../components/Container";
import styles from "./Mypage.module.css";
import type { UserPreview } from "../types";

// 임시 유저 데이터
const mockUser: UserPreview = {
    name: "me",
    profileImage: "/images/mockProfile.jpg",
    badgeType: "fan",
    badgeLevel: 1, 
    userId: "me123",
};

const Mypage = () => {
    return (
        <Container>
            <div className={`${styles.mypageWrap} inner`}>
                <div className={styles.profileSection}>
                    <div className={styles.profileCard}>
                        <img
                            src={mockUser.profileImage}
                            alt={mockUser.name}
                            className={styles.profileImg}
                        />
                        <div className={styles.profileInfo}>
                            <div className={styles.profileName}>
                                {mockUser.name}
                                {mockUser.badgeType === "fan" && (
                                    <span className={styles.badge}>B</span>
                                )}
                            </div>
                            <div className={styles.profileId}>@{mockUser.userId}</div>
                        </div>
                    </div>
                </div>
            <div className={styles.levelSection}>
                {/* 등급/진행률 카드 */}
            </div>
            <div className={styles.heartSection}>
                {/* 하트마스터 카드 */}
            </div>
            <div className={styles.menuSection}>
                {/* 메뉴 3개 (My Echo, My POP!, My Mood) */}
            </div>
        </div>
        </Container >
    );
};

export default Mypage;