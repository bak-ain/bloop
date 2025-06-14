import Container from "../components/Container";
import styles from "./LevelGuide.module.css";
import { getLevelBadgeIcon, getAvailableEmojis } from "../utils/badge";

const LEVELS = [
  {
    key: "BLING",
    name: "Bling",
    color: "#FFD966",
    desc: (
      <>
        우리의 가족이 된다면,<br />
        블링 등급 완료!
      </>
    ),
    detail: (
      <>
        BLOOP에 가입한 그 순간,<br />
        반짝이는 Bling 뱃지가 자동으로 쾅!<br />
        이제 당신은 BLOOP의 귀여운 새 가족
      </>
    ),
    condition: "가입 즉시 자동 부여",
    badge: getLevelBadgeIcon("BLING"),
    emojis: getAvailableEmojis(1),
  },
  {
    key: "LOOPY",
    name: "loopy",
    color: "#6EC6FF",
    desc: (
      <>
        덕심이 루프를<br />
        타고 올라오는 중!
      </>
    ),
    detail: (
      <>
        댓글도 쓰고 게시물도 올리다 보면,<br />
        어느새 BLOOP 루프에 퐁당 입장!<br />
        이제 당신은 푹 빠진 중독성 팬 loopy
      </>
    ),
    condition: "댓글 15개 이상 + 게시글 10개 이상",
    badge: getLevelBadgeIcon("LOOPY"),
    emojis: getAvailableEmojis(2),
  },
  {
    key: "POPIN",
    name: "popin",
    color: "#B39DDB",
    desc: (
      <>
        오늘도 활활<br />
        타오르는 팬심
      </>
    ),
    detail: (
      <>
        활동이 활짝 피어난 핵심 팬이라면,<br />
        이모지가 와르르 쏟아지는 popin!<br />
        지금 당신이 바로 BLOOP의 MVP
      </>
    ),
    condition: "댓글 15개 이상 + 게시글 10개 이상",
    badge: getLevelBadgeIcon("POPIN"),
    emojis: getAvailableEmojis(3),
  },
];

const LevelGuide = () => {
  return (
    <Container>
      <div className="all_p_t">
        <div className={`${styles.levelGuideWrap} inner`}>
          <h3 className={styles.levelGuideTitle}>등급 안내</h3>
          <h4 className={styles.levelGuideSubtitle}>팬심이 자라나는 순간, BLOOP 등급으로 기록해요</h4>
          <div className={styles.levelGrid}>
            {LEVELS.map((level) => (
              <div className={styles.levelCard} key={level.key}>
                <div className={styles.levelBadgeWrap}>
                  <img src={level.badge} alt={level.name} className={styles.levelBadgeImg} />
                </div>
                <div className={styles.levelName} style={{ color: level.color }}>
                  {level.name}
                </div>
                <div className={styles.levelDesc}>{level.desc}</div>
                <div className={styles.levelDetail}>{level.detail}</div>
                <div className={styles.levelCondition}>
                  가입 조건<br />
                  {level.condition}
                </div>
                <div className={styles.levelEmojis}>
                  <div className={styles.levelEmojiLabel}>사용 가능 이모지</div>
                  <div className={styles.levelEmojiList}>
                    {level.emojis.map((emoji, idx) => (
                      <img src={emoji} alt={`emoji${idx + 1}`} key={emoji} className={styles.levelEmojiImg} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LevelGuide;