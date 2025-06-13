import Container from "../components/Container";
import OfficialBanner from "../components/OfficialBanner";
import OfficialPost from "../components/OfficialPost";
import { usePostList } from "../context/PostListContext";
import styles from "./OfficialFeed.module.css"
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useState, useEffect } from "react";



function useMobile(maxWidth = 767) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= maxWidth);
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= maxWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [maxWidth]);
    return isMobile;
}

const OfficialFeed = () => {
    const { officialPosts } = usePostList();


    // type별로 분류
    const highlights = officialPosts.filter(post => post.type === "default");
    const media = officialPosts.filter(post => post.type === "new");
    const photos = officialPosts.filter(post => post.type === "imageOnly");
    const behinds = officialPosts.filter(post => post.type === "feature");
    const isMobile = useMobile();
    return (
        <div className={`${styles.office}`}>
            <Container>
                <div className={`${styles.officialWrap} inner`}>
                    {/* 배너 */}

                    <OfficialBanner highlights={highlights} />


                    {/* 트렌드 미디어 */}
                    <section className={`${styles.mediaSection}`}>
                        <h2 className={`offic_h2`}>트렌드 미디어</h2>
                        <div className={`${styles.mediaGrid}`}>
                            {media.map(post => (
                                <OfficialPost key={post.id} data={post} />
                            ))}
                        </div>
                    </section>

                    {/* 오피셜 포토 */}
                    <section className={styles.officeSection}>
                        <h2 className="offic_h2">오피셜 포토</h2>
                        {isMobile ? (
                            <Swiper
                                className={`${styles.photoSwiper} photoSwiper`}
                                modules={[Pagination, Autoplay]}
                                slidesPerView={2}
                                spaceBetween={16}
                                slidesPerGroup={2}
                                pagination={{ clickable: true }}
                                loop={photos.length > 2}
                                autoplay={photos.length > 2 ? { delay: 2000, disableOnInteraction: false } : false}
                                style={{ paddingBottom: 32 }}
                            >
                                {photos.map(post => (
                                    <SwiperSlide key={post.id}>
                                        <OfficialPost data={post} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className={styles.officeGrid}>
                                {photos.map(post => (
                                    <OfficialPost key={post.id} data={post} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* 비하인드 엿보기 */}
                    <section className={styles.behindSection}>
                        <h2 className="offic_h2">비하인드 엿보기</h2>
                        <div className={styles.behindGrid}>
                            {behinds.map((post, idx) => (
                                <OfficialPost key={post.id} data={post} index={idx} />
                            ))}
                        </div>
                    </section>
                </div>
            </Container>
        </div>

    );
};

export default OfficialFeed;