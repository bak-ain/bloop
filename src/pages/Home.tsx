import { useState, useEffect } from "react";
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
const MemberProfileModal = ({ member, onClose }: MemberProfileModalProps) => {
  useEffect(() => {
    // 모달이 열릴 때 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      // 모달이 닫힐 때 스크롤 복구
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={styles.profileModalOverlay}>
      <div className={styles.profileModal}>
        <button className={styles.closeBtn} onClick={onClose}></button>
        <div className={`${styles.profileModalName} h3_tit`}>
          <b>{member.name}</b>
        </div>
        <div className={styles.profileModalTop}>
          <img src={member.popUpImageUrl} alt={member.name} />
          <div className={`${styles.profileModalDesc} main_card_p`}>{member.description}</div>
        </div>
        <div className={`${styles.profileModalInfo}`}>
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
};

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
            <div className={`${styles.profileImg} ${m.id ? styles[m.id.toLowerCase()] : ""}`}>
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
    .filter(item => item.type === "default" || item.type === "new")
    .map(item => {
      const key = item.id as CustomMainOfficialKey;
      // 썸네일 추출 로직 추가
      let thumbnail = item.media?.[0]?.url;
      if (item.type === "new" && item.media?.[0]?.thumbnail) {
        thumbnail = item.media[0].thumbnail;
      }
      return {
        ...item,
        title: customMainOfficial[key]?.title ?? item.title,
        description: customMainOfficial[key]?.description ?? item.description,
        media: item.media?.map((m: any) => ({
          ...m,
          type: m.type === "image" || m.type === "video" ? m.type : "image",
        })),
        // 썸네일 필드 추가
        thumbnail,
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

export default Home;