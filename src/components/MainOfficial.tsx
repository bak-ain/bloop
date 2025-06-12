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
  <section>
    <h2 className={styles.mainOfficialTitle}>Contents</h2>
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={3}
      centeredSlides
      spaceBetween={0}
      navigation
      pagination={{ clickable: true }}
      loop={contents.length > 2}
      initialSlide={1} 
      loopAdditionalSlides={2}
      className={`${styles.mainOfficialSwiper} mainOfficialSwiper`}
    >
      {contents.map(content => (
        <SwiperSlide key={content.id}>
          <div className={styles.mainOfficialCard}>
            <img src={content.media?.[0]?.url} alt={content.title} className={styles.mainOfficialImg} />
            <div className={styles.mainOfficialContent}>
              <h3 dangerouslySetInnerHTML={{ __html: content.title || "" }} />
              <p >{content.description}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default MainOfficial;