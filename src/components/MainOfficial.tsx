import { OfficialContent } from "../types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination,EffectCoverflow } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import styles from "../pages/Home.module.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

interface MainOfficialProps {
  contents: OfficialContent[];
}


const MainOfficial = ({ contents }: MainOfficialProps) => {
  const navigate = useNavigate();

  return (
    <section className={styles.mainOfficial}>
      <h2 className={`${styles.mainOfficialTitle} allura_h2`}>Contents</h2>
      <div className={styles.mainOfficialCon}>
        <div className={styles.mainOfficialSwiperWrapper}>
          <Swiper
            modules={[Navigation, Pagination, EffectCoverflow]}
            slidesPerView={1.2}
            centeredSlides
            spaceBetween={0}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 40,
              depth: 120,
              modifier: 1,
              slideShadows: false,
            }}
            navigation={{
              nextEl: `.${styles.mainOfficialNext}`,
              prevEl: `.${styles.mainOfficialPrev}`,
            }}
            pagination={{
              clickable: true,
              el: `.${styles.mainOfficialPagination}`,
              bulletClass: `swiper-pagination-bullet ${styles.mainOfficialBullet}`,
              bulletActiveClass: `swiper-pagination-bullet-active ${styles.mainOfficialBulletActive}`,
            }}
            loop={contents.length > 2}
            initialSlide={1}
            className={`${styles.mainOfficialSwiper} mainOfficialSwiper`}
            breakpoints={{
              767: {
                slidesPerView: 3,
                effect: "slide",
              }
            }}
          >
            {contents.map(content => (
              <SwiperSlide key={content.id}>
                <div
                  className={styles.mainOfficialCard}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url(${content.media?.[0]?.thumbnail || content.media?.[0]?.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(`/official/${content.id}`)}
                >
                  <div className={styles.mainOfficialContent}>
                    <h3 dangerouslySetInnerHTML={{ __html: content.title || "" }} />
                    <p>{content.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className={styles.mainOfficialPrev} aria-label="이전"></button>
          <div className={styles.mainOfficialPagination}></div>
          <button className={styles.mainOfficialNext} aria-label="다음"></button>
        </div>
        <button
          className={`${styles.mainOfficialMore} btn_txt btnBlue`}
          aria-label="더보기"
          onClick={() => navigate("/official")}
        >
          더보기
        </button>
      </div>
    </section>
  );
};

export default MainOfficial;