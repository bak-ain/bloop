import Container from "../components/Container";
import Scheduler from "../components/Scheduler";
import MainOfficial from "../components/MainOfficial";
import { usePostList } from "../context/PostListContext";
import { useUserContext } from "../context/UserContext ";
import styles from "./Home.module.css"

/* import { useState } from "react";
import Container from "../components/Container";
import Scheduler from "../components/Scheduler";
import MainOfficial from "../components/MainOfficial";
import { usePostList } from "../context/PostListContext";
import { useUserContext } from "../context/UserContext ";
import styles from "./Home.module.css";
import { MemberCard } from "../types";
import membersData from "../utils/members.json";

// 멤버 프로필 팝업 컴포넌트
interface MemberProfileModalProps {
  member: MemberCard;
  onClose: () => void;
}
const MemberProfileModal = ({ member, onClose }: MemberProfileModalProps) => (
  <div className={styles.profileModalOverlay}>
    <div className={styles.profileModal}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
      <div className={styles.profileModalImg}>
        <img src={member.imageUrl} alt={member.name} />
        {member.stickerUrl && (
          <img className={styles.sticker} src={member.stickerUrl} alt="sticker" />
        )}
      </div>
      <div className={styles.profileModalName}>
        <b>{member.name}</b>
      </div>
      <div className={styles.profileModalDesc}>{member.description}</div>
      <div className={styles.profileModalInfo}>
        <div>
          <span>생년월일</span> {member.birth} ({member.age}세)
        </div>
        <div>
          <span>포지션</span> {member.position}
        </div>
        <div>
          <span>신체</span> {member.height}
        </div>
        <div>
          <span>MBTI</span> {member.mbti}
        </div>
      </div>
    </div>
  </div>
);

// 멤버 프로필 리스트
const MemberProfile = () => {
  const [selected, setSelected] = useState<MemberCard | null>(null);
  const members: MemberCard[] = membersData;

  return (
    <section className={styles.memberProfile}>
      <h2 className={`${styles.profileTitle} allura_h2`}>Profile</h2>
      <div className={`${styles.profileList} inner`}>
        {members.map((m) => (
          <div
            className={styles.profileCard}
            key={m.id}
            onClick={() => setSelected(m)}
            tabIndex={0}
            role="button"
            aria-label={`${m.name} 프로필 열기`}
          >
            <div className={styles.profileImg}>
              <img src={m.imageUrl} alt={m.name} />
              {m.stickerUrl && (
                <img
                  className={styles.sticker}
                  src={m.stickerUrl}
                  alt="sticker"
                />
              )}
            </div>
            <div className={`${styles.profileName} main_card_p`}>
              {m.name}
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <MemberProfileModal
          member={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
};

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
          <MemberProfile />
          <section className={styles.schedule} style={{ position: "relative" }}>
            <div className={styles.scheduleBg} />
            <h2 className={`${styles.scheduleTitle} allura_h2`}>Schedule</h2>
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
  );
};

export default Home; */

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
    <section className={`${styles.memberProfile} `}>
        <h2 className={`${styles.profileTitle} allura_h2`}>Profile</h2>
        {/*  <div className="inner"> */}
        <div className={`${styles.profileList} inner `} >
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
                    <div className={`${styles.profileName} main_card_p`}>
                        {m.name} <span>({m.en})</span>
                    </div>
                </div>
            ))}
        </div>
        {/* </div> */}

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
                    <MemberProfile />
                    <section className={styles.schedule} style={{ position: "relative" }}>
                        <div className={styles.scheduleBg} />
                        <h2 className={`${styles.scheduleTitle} allura_h2`}>Schedule</h2>
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

