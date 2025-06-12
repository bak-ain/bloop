import Container from "../components/Container";
import OfficialBanner from "../components/OfficialBanner";
import OfficialPost from "../components/OfficialPost";
import { usePostList } from "../context/PostListContext";
import styles from "./OfficialFeed.module.css"
import "swiper/css";
import "swiper/css/navigation";

const OfficialFeed = () => {
    const { officialPosts } = usePostList();

    // type별로 분류
    const highlights = officialPosts.filter(post => post.type === "default");
    const media = officialPosts.filter(post => post.type === "new");
    const photos = officialPosts.filter(post => post.type === "imageOnly");
    const behinds = officialPosts.filter(post => post.type === "feature");

    return (
        <div className={`${styles.office}`}>
            <Container>
                <div className={`${styles.officialWrap} inner`}>
                    {/* 배너 */}

                    <OfficialBanner highlights={highlights} />


                    {/* 트렌드 미디어 */}
                    <section style={{ marginBottom: 80 }}>
                        <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>트렌드 미디어</h2>
                        <div style={{ display: "flex", gap: 32 }}>
                            {media.map(post => (
                                <OfficialPost key={post.id} data={post} />
                            ))}
                        </div>
                    </section>

                    {/* 오피셜 포토 */}
                    <section style={{ marginBottom: 80 }}>
                        <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>오피셜 포토</h2>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: 8,
                                maxWidth: 900,
                            }}
                        >
                            {photos.map(post => (
                                <OfficialPost key={post.id} data={post} />
                            ))}
                        </div>
                    </section>

                    {/* 비하인드 엿보기 */}
                    <section>
                        <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>비하인드 엿보기</h2>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 32,
                                maxWidth: 900,
                            }}
                        >
                            {behinds.map(post => (
                                <OfficialPost key={post.id} data={post} />
                            ))}
                        </div>
                    </section>
                </div>
            </Container>
        </div>

    );
};

export default OfficialFeed;