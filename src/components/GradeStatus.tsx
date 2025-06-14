import React from "react";
import styles from "./GradeStatus.module.css";
import { useNavigate } from "react-router-dom";

const GradeStatus = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.gradeWrap}>
      {/* 상단 안내 텍스트 */}
      <div className={styles.textWrap}>
        <div className={styles.badge}>B</div>
        <p className={styles.title}>
          현재 <span className={styles.highlight}>BLING</span> 등급 이십니다.
        </p>
        <p className={styles.sub}>사용가능한 이모지는 총 3개입니다.</p>
      </div>

      {/* 이모지 리스트 */}
      <div className={styles.emojiRow}>
        <img src="/images/emoji1.png" alt="POP!" />
        <img src="/images/emoji2.png" alt="LOVE" />
        <img src="/images/emoji3.png" alt="HELLO" />
      </div>

      {/* 버튼 영역 */}
      <div className={styles.buttonRow}>
        <button className={styles.primaryBtn} onClick={() => navigate("/levelguide")}>
          등급안내 보러가기
        </button>
        <button className={styles.secondaryBtn} onClick={() => navigate("/")}>
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

const EmojiCard = ({ img, label }: { img: string; label: string }) => (
  <div className={styles.emojiCard}>
    <img src={img} alt={label} />
    <p>{label}</p>
  </div>
);

export default GradeStatus;
