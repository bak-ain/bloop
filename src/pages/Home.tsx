import Container from "../components/Container";
import Scheduler from "../components/Scheduler";
import MainOfficial from "../components/MainOfficial";
import { usePostList } from "../context/PostListContext";
import { useUserContext } from "../context/UserContext ";
import styles from "./Home.module.css"

// MemberProfile
interface Member {
    name: string;
    en: string;
    image: string;
    sticker: string;
}

const members: Member[] = [
    { name: "도아", en: "DOA", image: "/images/mainDoa.jpg", sticker: "/images/cherry.png" },
    { name: "아린", en: "ARIN", image: "/images/mainArin.jpg", sticker: "/images/blingRed.png" },
    { name: "세이", en: "SEI", image: "/images/mainSei.jpg", sticker: "/images/heartRed.png" },
    { name: "루하", en: "LUHA", image: "/images/mainLuha.jpg", sticker: "/images/ribbon.png" },
];

const MemberProfile = () => (
    <section className={styles.memberProfile}>
        <h2 className={styles.profileTitle}>Profile</h2>
        <div className={styles.profileList}>
            {members.map((m) => (
                <div className={`${styles.profileCard} ${styles[m.en]}`} key={m.en}>
                    <div className={styles.profileImg}>
                        <img src={m.image} alt={m.name} />
                        {/* 스티커 이미지 */}
                        <img
                            className={styles.sticker}
                            src={m.sticker}
                            alt="sticker"
                        />
                    </div>
                    <div className={styles.profileName}>
                        {m.name} <span>({m.en})</span>
                    </div>
                </div>
            ))}
        </div>
    </section>
);


const Home = () => {
    const { user } = useUserContext();
    const isLogin = !!user;
    const { officialPosts } = usePostList();
    type CustomMainOfficialKey = "h1" | "h2" | "h3";
    const customMainOfficial: Record<CustomMainOfficialKey, { title: string; description: string }> = {
        h1: { title: "하이비스 데뷔 첫 풀 앨범‘STARSEED’", description: "만족스러운 콘서트를 위해!" },
        h2: { title: "도아 솔로 출격 !", description: "미니 1 집 ‘FLASHPOINT’ 발매" },
        h3: { title: "데뷔 2주년 팬미팅 ", description: "팬쇼케이스 RE:MEMBER 개최" },
    };

    const officialDefaultList = officialPosts
        .filter(item => item.type === "default")
        .map(item => {
            const key = item.id as CustomMainOfficialKey;
            return {
                ...item,
                title: customMainOfficial[key]?.title ?? item.title,
                description: customMainOfficial[key]?.description ?? item.description,
                media: item.media?.map((m: any) => ({
                    ...m,
                    type: m.type === "image" || m.type === "video" ? m.type : "image",
                })),
            };
        });

    return (
        <div className={`${styles.home} home`}>
            <Container>
                <div className={styles.mainBanner} />
                <div className={styles.mainContent}>
                    <section className={styles.schedule} style={{ position: "relative" }}>
                        <div className={styles.scheduleBg} />
                        <h2 className={styles.scheduleTitle}>Schedule</h2>
                        <div style={!isLogin ? { filter: "blur(3px)", pointerEvents: "none" } : {}}>
                            <Scheduler />
                        </div>
                        {!isLogin && (
                            <div className={styles.blurOverlay}>
                                <span>로그인 후 이용 가능합니다.</span>
                            </div>
                        )}
                    </section>
                    <MainOfficial contents={officialDefaultList} />
                </div>
            </Container>
        </div>
    )
}

export default Home;