import Container from "../components/Container";
import Scheduler from "../components/Scheduler";
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
    return (
        <div className={`${styles.home} home`}>
            <Container>
                <div className={styles.mainBanner} />
                <div className={styles.mainContent}>
                    <MemberProfile />
                    <section className={styles.schedule}>
                        <h2 className={styles.scheduleTitle}>Schedule</h2>
                        <Scheduler />
                    </section>
                </div>
            </Container>
        </div>
    )
}

export default Home;