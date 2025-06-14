import { usePostList } from "../context/PostListContext";
import { ArtistPost } from "../types";
import styles from "./PostCard.module.css";

const ArtistStory = ({ onStoryClick }: { onStoryClick: (story: ArtistPost) => void }) => {
    const { artistPosts } = usePostList();
    const storyList = artistPosts.filter(post => post.isStory);
    console.log("storyList", storyList);

    return (
        <div className={`${styles.storyContainer}`}>
            <div className={`${styles.aBannerContainer}`}>
                <div className={`${styles.banner}`}></div>
                <div className={`${styles.banner_mini}`}></div>
            </div>

            <div className={`${styles.storyContent} con`}>
                {storyList.map(story => (
                    <div className={styles.storyCard} key={story.id} onClick={() => onStoryClick(story)}>
                        {/* user가 undefined일 수 있으니 옵셔널 체이닝 처리 */}
                        <div className={`${styles.stroyTop}`}>
                            <img className={styles.profileImage} src={story.user?.profileImage ?? "/images/mainDoa.jpg"} alt={story.user?.name ?? "아티스트"} />
                            {story.media && story.media.filter(m => m.type === "image").length > 0 && (
                                <img
                                    className={styles.storyImage}
                                    src={story.media.find(m => m.type === "image")!.url}
                                    alt={story.user?.name ?? "아티스트"}
                                />
                            )}
                        </div>
                        <div className={`${styles.storyName} artist_top`}>{story.user?.name ?? "아티스트"}</div>
                    </div>
                ))}
            </div>



        </div>
    );
};

export default ArtistStory;