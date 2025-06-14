import { OfficialContent } from "../types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import styles from "../pages/Home.module.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface MainOfficialProps {
  contents: OfficialContent[];
}

const MainOfficial = ({ contents }: MainOfficialProps) => (
  <section className={styles.mainOfficial}>
    <h2 className={`${styles.mainOfficialTitle} allura_h2`}>Contents</h2>
    <div className={styles.mainOfficialSwiperWrapper}>
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={3}
        centeredSlides
        spaceBetween={0}
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
      >
        {contents.map(content => (
          <SwiperSlide key={content.id}>
            <div className={styles.mainOfficialCard}>
              <img
                src={content.media?.[0]?.thumbnail || content.media?.[0]?.url}
                alt={content.title}
                className={styles.mainOfficialImg}
              />
              <div className={styles.mainOfficialContent}>
                <h3 dangerouslySetInnerHTML={{ __html: content.title || "" }} />
                <p >{content.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className={styles.mainOfficialPrev} aria-label="이전"></button>
      <div className={styles.mainOfficialPagination}></div>
      <button className={styles.mainOfficialNext} aria-label="다음"></button>
    </div>
  </section>
);

export default MainOfficial;