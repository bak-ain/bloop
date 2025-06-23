import { OfficialContent } from "../types";
import styles from "./OfficialPost.module.css";
import { useLikedScrapped } from "../context/LikedScrappedContext";
import { useNavigate } from "react-router-dom";


interface OfficialPostProps {
  data: OfficialContent;
  index?: number;
}

const OfficialPost = ({ data, index }: OfficialPostProps) => {
  const {
    officialScrappedIds,
    toggleScrap,
  } = useLikedScrapped();
  const navigate = useNavigate();

  // 스크랩 상태
  const isScrapped = officialScrappedIds.includes(data.id);

  // 카드 클릭 시 상세 페이지 이동
  const handleClick = () => {
    navigate(`/official/${data.id}`);
  };

  // 스크랩 버튼 클릭
  const handleScrap = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleScrap("official", data.id);
  };

  switch (data.type) {
    case "new":
      // 트렌드 미디어 카드
      return (
        <div className={styles.mediaCard} onClick={handleClick}>
          <div className={styles.mediaThumb}>
            {/* 썸네일 이미지가 있다면 */}
            {data.media && data.media[0] ? (
              data.media[0].type === "video" ? (
                // 비디오일 경우 썸네일 이미지 사용
                data.media[0].thumbnail ? (
                  <img src={data.media[0].thumbnail} alt={data.title} />
                ) : (
                  <div className={`${styles.mediaThumbPlaceholder} ${styles.mediaImg}`} />
                )
              ) : (
                // 이미지일 경우 그대로 출력
                <img src={data.media[0].url} alt={data.title} className={`${styles.mediaImg}`} />
              )
            ) : (
              <div className={styles.mediaThumbPlaceholder} />
            )}
          </div>
          <div className={styles.mediaInfo}>
            <div className={`${styles.mediaDate} day_span`}>{data.date}</div>
            <div className={styles.mediaTitle}>
              <h3
                className={`${styles.detailTitle} offic_h3  `}
                dangerouslySetInnerHTML={{ __html: data.title ?? "" }}
              />
            </div>
            {/* 필요시 해시태그, 좋아요 등 추가 */}
          </div>
        </div>
      );
    case "imageOnly":
      // 오피셜 포토 그리드 아이템
      return (
        <div className={styles.photoCard} onClick={handleClick}>
          {data.media && data.media[0]?.url ? (
            <img src={data.media[0].url} alt={data.title} className={`${styles.officeImg}`} />
          ) : (
            <div className={styles.photoPlaceholder} />
          )}
        </div>
      );
    case "feature":
      // 비하인드 카드 (좌우 레이아웃, 두 번째만 반전)
      const isReverse = index === 1;
      return (
        <div
          className={`${styles.behindCard} ${isReverse ? styles.behindCardReverse : ""}`}
          onClick={handleClick}
        >
          <div className={styles.behindThumb}>
            {data.media && data.media[0] ? (
              data.media[0].type === "video" ? (
                data.media[0].thumbnail ? (
                  <img
                    src={data.media[0].thumbnail}
                    alt={data.title}
                    className={styles.officeImg}
                  />
                ) : (
                  <div className={styles.behindThumbPlaceholder} />
                )
              ) : (
                <img
                  src={data.media[0].url}
                  alt={data.title}
                  className={styles.officeImg}
                />
              )
            ) : (
              <div className={styles.behindThumbPlaceholder} />
            )}
          </div>
          <div className={styles.behindInfo}>

            <div className={styles.behindTitleTop}>
              <div className={`${styles.behindTitle} offic_h4`}>{data.title}</div>
              <div
                className={`${styles.behinbehindDescdTitle} offic_p`}
                dangerouslySetInnerHTML={{ __html: data.description ?? "" }}
              />
            </div>
            <button
              className={`${styles.behindDetailBtn} officeBtn`}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              보러가기
              <img
                src="/images/icon/office_icon.png"
                alt="go"
                className={`${styles.behindIcon} ${styles.defaultIcon}`}
              />
              <img
                src="/images/icon/officeW_icon.png"
                alt="go"
                className={`${styles.behindIcon} ${styles.hoverIcon}`}
              />
            </button>

          </div>
        </div>
      );
    default:
      // default(메인배너)는 별도 컴포넌트에서 처리(슬라이더 등)
      return null;
  }
};

export default OfficialPost;