import { ArtistPost, FanPost } from "../types";
import PostDetail from "./PostDetail";
import { usePostList } from "../context/PostListContext";

type PopupProps =
  | {
    type: 'artistFeed';
    data: ArtistPost;
    onClose: () => void;
    onUpdate?: (updatedPost: ArtistPost | FanPost) => void;
  }
  | {
    type: 'fanFeed';
    data: FanPost;
    onClose: () => void;
  }
  | {
    type: 'upload';
    onClose: () => void;
    onSubmit: (data: FanPost) => void;
  }
  | {
    type: 'edit';
    data: FanPost;
    onClose: () => void;
  };

const ArtistFeedPopup = ({
  data,
}: {
  data: ArtistPost;
}) => {
  const { artistPosts, setArtistPosts } = usePostList();
  return <PostDetail type="artist" data={data} postList={artistPosts} setPostList={setArtistPosts} />;
};

const FanFeedPopup = ({
  data,
}: {
  data: FanPost;
}) => {
  const { fanPosts, setFanPosts } = usePostList();
  return <PostDetail type="fan" data={data} postList={fanPosts} setPostList={setFanPosts} />;
};

const UploadPopup = ({ onSubmit }: { onSubmit: (data: FanPost) => void }) => {
  const handleUpload = () => {
    const newPost: FanPost = {
      id: "temp-id",
      user: {
        name: "me",
        profileImage: "/me.png",
        badgeType: "fan",
        badgeLevel: 1,
      },
      date: new Date().toISOString(),
      description: "업로드 내용",
      likes: 0,
      comment: 0,
    };
    onSubmit(newPost);
  };

  return (
    <div>
      <p>업로드 팝업</p>
      <button onClick={handleUpload}>업로드</button>
    </div>
  );
};
const EditPopup = ({ data }: { data: FanPost }) => (
  <div>수정 팝업 내용: {data.description}</div>
);

const Popup = (props: PopupProps) => {
  const { type, onClose } = props;

  return (
    <div className="popup_wrapper">
      <div className="popup_content">
        {type === 'artistFeed' && (
          <ArtistFeedPopup data={props.data} />
        )}
        {type === 'fanFeed' && (
          <FanFeedPopup data={props.data} />
        )}
        {type === 'upload' && <UploadPopup onSubmit={props.onSubmit} />}
        {type === 'edit' && <EditPopup data={props.data} />}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Popup;