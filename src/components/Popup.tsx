import { ArtistPost, FanPost } from "../types";
import PostDetail from "./PostDetail";


type PopupProps =
  | {
    type: 'artistFeed';
    data: ArtistPost;
    postList: ArtistPost[];
    setPostList: React.Dispatch<React.SetStateAction<ArtistPost[]>>;
    onClose: () => void;
    onUpdate?: (updatedPost: ArtistPost | FanPost) => void;
  }
  | {
    type: 'fanFeed';
    data: FanPost;
    postList: FanPost[];
    setPostList: React.Dispatch<React.SetStateAction<FanPost[]>>;
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
  postList,
  setPostList,
}: {
  data: ArtistPost;
  postList: ArtistPost[];
  setPostList: React.Dispatch<React.SetStateAction<ArtistPost[]>>;
}) => <PostDetail type="artist" data={data} postList={postList} setPostList={setPostList} />;

const FanFeedPopup = ({
  data,
  postList,
  setPostList,
}: {
  data: FanPost;
  postList: FanPost[];
  setPostList: React.Dispatch<React.SetStateAction<FanPost[]>>;
}) => <PostDetail type="fan" data={data} postList={postList} setPostList={setPostList} />;

const UploadPopup = ({ onSubmit }: { onSubmit: (data: FanPost) => void }) => {
  const handleUpload = () => {
    const newPost: FanPost = {
      id: "temp-id",
      name: "me",
      date: new Date().toISOString(),
      description: "업로드 내용",
      likes: 0,
      comment: 0,
      profileImage: "/me.png",
      badgeType: "fan",
      badgeLevel: 1,
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
          <ArtistFeedPopup data={props.data} postList={props.postList} setPostList={props.setPostList} />
        )}
        {type === 'fanFeed' && (
          <FanFeedPopup data={props.data} postList={props.postList} setPostList={props.setPostList} />
        )}
        {type === 'upload' && <UploadPopup onSubmit={props.onSubmit} />}
        {type === 'edit' && <EditPopup data={props.data} />}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};






export default Popup;