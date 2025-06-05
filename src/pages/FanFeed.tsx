import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import Container from "../components/Container";
import Popup from "../components/Popup";
import { ArtistPost, FanPost } from "../types";

const FanFeed = () => {
    const [postList, setPostList] = useState<(ArtistPost | FanPost)[]>([]);
    const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
        return JSON.parse(localStorage.getItem("fanLikedPosts") || "[]");
    });

    const [scrappedPostIds, setScrappedPostIds] = useState<string[]>(() => {
        return JSON.parse(localStorage.getItem("fanScrappedPosts") || "[]");
    });

    const [selectedPost, setSelectedPost] = useState<FanPost | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);


    const handleClosePopup = () => {
        setSelectedPost(null);
        setIsPopupOpen(false);
    };

    useEffect(() => {
        const storedPostList = JSON.parse(localStorage.getItem("fanPostList") || "null");
        if (storedPostList) {
            setPostList(storedPostList);
        } else {
            fetch("/data/posts.json")
                .then(res => res.json())
                .then(data => {
                    setPostList(data.fan);
                    localStorage.setItem("fanPostList", JSON.stringify(data.fan));
                });
        }
    }, []);

    return (
        <Container>
            {postList.map((post) => (
                <PostCard
                    key={post.id}
                    data={post}
                    likedPostIds={likedPostIds}
                    scrappedPostIds={scrappedPostIds}
                    setLikedPostIds={setLikedPostIds}
                    setScrappedPostIds={setScrappedPostIds}
                    postList={postList}
                    setPostList={setPostList}
                    onClick={(post) => {
                        setSelectedPost(post as FanPost); // 확실하니까 FanPost로 캐스팅
                        setIsPopupOpen(true);
                    }}
                />
            ))}

            {isPopupOpen && selectedPost && (
                <Popup
                    type="fanFeed"
                    data={selectedPost}
                    postList={postList as FanPost[]}
                    setPostList={setPostList as React.Dispatch<React.SetStateAction<FanPost[]>>}
                    onClose={handleClosePopup}
                />
            )}
        </Container>
    );
};

export default FanFeed;
