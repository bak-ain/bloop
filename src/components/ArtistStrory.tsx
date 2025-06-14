import { useEffect, useState } from "react";
import styles from "./PostCard.module.css";
import type { ArtistStoryPost } from "../types";


interface ArtistStoryProps {
    onStoryClick: (story: ArtistStoryPost) => void;
}

const ArtistStory = ({ onStoryClick }: ArtistStoryProps) => {
    const [storyList, setStoryList] = useState<ArtistStoryPost[]>([]);

    useEffect(() => {
        fetch("/data/story.json")
            .then(res => res.json())
            .then(data => setStoryList(data));
    }, []);
    console.log(storyList);
    return (
        <div className={styles.storyContainer}>
            <div className={styles.aBannerContainer}>
                <div className={styles.banner}></div>
                <div className={styles.banner_mini}></div>
            </div>

            <div className={`${styles.storyContent} inner`}>
                {storyList.map(story => (
                    <div
                        className={styles.storyCard}
                        key={story.id}
                        onClick={() => onStoryClick(story)}
                    >
                        <div className={styles.stroyTop}>
                            <div className={`${styles.storyProfile} ${story.user.name ? styles[story.user.name.toLowerCase()] : ""}`}>
                                <img
                                    className={styles.profileImage}
                                    src={story.user.profileImage}
                                    alt={story.user.name}
                                />
                            </div>
                            <img
                                className={styles.storyImage}
                                src={story.thumbnail}
                                alt={story.user.name}
                            />
                        </div>
                        <div className={`${styles.storyName} artist_top`}>
                            {story.user.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArtistStory;