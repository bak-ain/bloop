import { usePostList } from "../context/PostListContext";
import { ArtistPost } from "../types";
import styles from "./PostCard.module.css";

const ArtistStory = ({ onStoryClick }: { onStoryClick: (story: ArtistPost) => void }) => {
    const { artistPosts } = usePostList();
    const storyList = artistPosts.filter(post => post.isStory);
    console.log("storyList", storyList);

    return (
        <div className={`${styles.storyContainer} inner`}>
            {storyList.map(story => (
                <div className={styles.storyCard} key={story.id} onClick={() => onStoryClick(story)}>
                    {/* user가 undefined일 수 있으니 옵셔널 체이닝 처리 */}
                    <img className={styles.profileImage} src={story.user?.profileImage ?? "/images/default_profile.png"} alt={story.user?.name ?? "아티스트"} />
                    {story.media && story.media.filter(m => m.type === "image").length > 0 && (
                        <img
                            className={styles.storyImage}
                            src={story.media.find(m => m.type === "image")!.url}
                            alt={story.user?.name ?? "아티스트"}
                        />
                    )}
                    <div className={styles.storyName}>{story.user?.name ?? "아티스트"}</div>
                </div>
            ))}
        </div>
    );
};

export default ArtistStory;