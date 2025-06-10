import { ArtistPost, FanPost } from "../types";
import PostDetail from "./PostDetail";
import { usePostList } from "../context/PostListContext";
import { getAvailableEmojis } from "../utils/badge";
import React, { useRef, useState, useEffect } from "react";
import styles from "./Popup.module.css";
import dayjs from "dayjs";

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
    onEdit?: (post: FanPost) => void;
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
    onUpdate?: (data: FanPost) => void;
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
  onClose,
  onEdit,
}: {
  data: FanPost;
  onClose: () => void;
  onEdit?: (post: FanPost) => void;
}) => {
  const { fanPosts, setFanPosts } = usePostList();
  return (
    <PostDetail
      type="fan"
      data={data}
      postList={fanPosts}
      setPostList={setFanPosts}
      onClose={onClose}
      onEdit={onEdit}
    />
  );
};


const UploadPopup = ({ onSubmit, onClose }: { onSubmit: (data: FanPost) => void; onClose: () => void }) => {
  const [hashtag, setHashtag] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const handleHashtagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtagInput(e.target.value);
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && hashtagInput.trim()) {
      const tag = hashtagInput.trim().replace(/^#/, "");
      if (tag && !hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setHashtagInput("");
      e.preventDefault();
    }
  };

  const handleRemoveHashtag = (idx: number) => {
    setHashtags(hashtags.filter((_, i) => i !== idx));
  };

  // 실제 유저의 badgeLevel로 변경 필요
  const userLevel = 3;
  const emojis = getAvailableEmojis(userLevel);

  // 파일 선택 시 미리보기
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const readers = files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target?.result as string);
            reader.readAsDataURL(file);
          })
      );
      Promise.all(readers).then((imgs) => setImages((prev) => [...prev, ...imgs]));
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // 이모지 삽입 (이미지로)
  const handleEmojiInsert = (emoji: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    // 커서가 div 안에 없으면 div의 끝에 커서 이동
    let selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) {
      editor.focus();
      selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false); // div 끝으로 이동
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    // 이미지 이모지 삽입
    const img = document.createElement("img");
    img.src = emoji;
    img.alt = "emoji";
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.verticalAlign = "middle";
    img.style.border = "1px solid #e0e0e0";
    img.style.borderRadius = "8px";

    if (selection) {
      const range = selection.getRangeAt(0);
      range.collapse(false);
      range.insertNode(img);

      // 줄바꿈 추가
      const br = document.createElement("br");
      range.setStartAfter(img);
      range.collapse(false);
      range.insertNode(br);

      // 커서 이동
      range.setStartAfter(br);
      range.setEndAfter(br);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    setShowEmojiPicker(false);
    editor.focus();
  };

  // 임시저장
  const handleTempSave = () => {
    const editor = editorRef.current;
    const description = editor?.innerHTML || "";
    localStorage.setItem(
      "fanUploadTemp",
      JSON.stringify({ description, hashtags, images })
    );
    alert("임시저장 되었습니다.");
    if (typeof onClose === "function") onClose(); // 팝업 닫기
  };
  useEffect(() => {
    const temp = localStorage.getItem("fanUploadTemp");
    if (temp) {
      try {
        const { description, hashtags: savedTags, images: savedImages } = JSON.parse(temp);
        if (editorRef.current && description) editorRef.current.innerHTML = description;
        if (Array.isArray(savedTags)) setHashtags(savedTags);
        if (Array.isArray(savedImages)) setImages(savedImages);
      } catch { }
    }
  }, []);

  // 업로드
  const handleUpload = () => {
    const editor = editorRef.current;
    const description = editor?.innerHTML || "";
    const newPost: FanPost = {
      id: "temp-id-" + Date.now(),
      user: {
        name: "me",
        profileImage: "/me.png",
        badgeType: "fan",
        badgeLevel: 1,
        userId: "me123",
      },
      date: dayjs().toISOString(), 
      description, // HTML로 저장
      hashtag: hashtags.map(tag => `#${tag}`).join(","),
      likes: 0,
      comment: 0,
      media: images.map((url) => ({ type: "image", url })),
    };
    onSubmit(newPost);
    // 내 게시물 리스트에 저장
    const myPosts = JSON.parse(localStorage.getItem("myFanPosts") || "[]");
    myPosts.push(newPost);
    localStorage.setItem("myFanPosts", JSON.stringify(myPosts));
    // 임시저장 데이터 삭제
    localStorage.removeItem("fanUploadTemp");
  };

  return (
    <div className={styles.uploadPopupWrapper}>
      <h2 className={styles.uploadPopupTitle}>새 게시물</h2>
      <div className={styles.uploadPopupTextareaBox}>
        <div
          ref={editorRef}
          className={styles.uploadPopupEditor}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="내용을 입력해주세요."
          style={{
            minHeight: 120,
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            padding: 30,
            fontSize: "1rem",
            marginBottom: 24,
            background: "#fafbfc",
            outline: "none",
          }}
        />
      </div>
      <div className={styles.uploadPopupHashtagBox}>
        {hashtags.map((tag, idx) => (
          <span className={styles.uploadPopupHashtag} key={tag}>
            #{tag}
            <button
              type="button"
              className={styles.uploadPopupHashtagRemove}
              onClick={() => handleRemoveHashtag(idx)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className={styles.uploadPopupInput}
          placeholder="# 태그를 입력해주세요."
          value={hashtagInput}
          onChange={handleHashtagInput}
          onKeyDown={handleHashtagKeyDown}
        />
      </div>
      <div className={styles.uploadPopupFileBox}>
        <button
          type="button"
          className={styles.uploadPopupFileBtn}
          onClick={() => fileInputRef.current?.click()}
        >
          파일 선택
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className={styles.uploadPopupImageList}>
        {images.map((img, idx) => (
          <div key={idx} className={styles.uploadPopupImageItem}>
            <img
              src={img}
              alt={`preview-${idx}`}
              className={styles.uploadPopupImage}
            />
            <button
              onClick={() => handleRemoveImage(idx)}
              className={styles.uploadPopupRemoveBtn}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className={styles.uploadPopupBtnBox}>
        <button
          type="button"
          className={styles.uploadPopupEmojiBtn}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          😀
        </button>
        {showEmojiPicker && (
          <div className={styles.uploadPopupEmojiPicker}>
            {Array.from({ length: Math.ceil(emojis.length / 3) }).map((_, rowIdx) => (
              <div className={styles.uploadPopupEmojiRow} key={rowIdx}>
                {emojis.slice(rowIdx * 3, rowIdx * 3 + 3).map((emoji, i) => (
                  <button
                    key={i}
                    type="button"
                    className={styles.uploadPopupEmoji}
                    onClick={() => handleEmojiInsert(emoji)}
                  >
                    <img src={emoji} alt={`emoji${rowIdx * 3 + i + 1}`} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleTempSave}
          className={styles.uploadPopupTempBtn}
          type="button"
        >
          임시저장
        </button>
        <button
          onClick={handleUpload}
          className={styles.uploadPopupSubmitBtn}
        >
          등록
        </button>
      </div>
    </div>
  );
};

const EditPopup = ({
  data,
  onClose,
  onSubmit,
}: {
  data: FanPost;
  onClose: () => void;
  onSubmit?: (data: FanPost) => void;
}) => {
  const [images, setImages] = useState<string[]>(data.media?.map((m) => m.url) || []);
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>(
    data.hashtag ? data.hashtag.split(",").map((tag) => tag.replace(/^#/, "")) : []
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && data.description) {
      editorRef.current.innerHTML = data.description;
    }
  }, [data.description]);

  const handleHashtagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtagInput(e.target.value);
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && hashtagInput.trim()) {
      const tag = hashtagInput.trim().replace(/^#/, "");
      if (tag && !hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setHashtagInput("");
      e.preventDefault();
    }
  };

  const handleRemoveHashtag = (idx: number) => {
    setHashtags(hashtags.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const readers = files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target?.result as string);
            reader.readAsDataURL(file);
          })
      );
      Promise.all(readers).then((imgs) => setImages((prev) => [...prev, ...imgs]));
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // 이모지 관련 (UploadPopup과 동일)
  const userLevel = data.user.badgeLevel || 1;
  const emojis = getAvailableEmojis(userLevel);

  const handleEmojiInsert = (emoji: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    let selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) {
      editor.focus();
      selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    const img = document.createElement("img");
    img.src = emoji;
    img.alt = "emoji";
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.verticalAlign = "middle";
    img.style.border = "1px solid #e0e0e0";
    img.style.borderRadius = "8px";
    if (selection) {
      const range = selection.getRangeAt(0);
      range.collapse(false);
      range.insertNode(img);
      const br = document.createElement("br");
      range.setStartAfter(img);
      range.collapse(false);
      range.insertNode(br);
      range.setStartAfter(br);
      range.setEndAfter(br);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    setShowEmojiPicker(false);
    editor.focus();
  };

  // 수정 완료
  const handleEdit = () => {
    const editor = editorRef.current;
    const description = editor?.innerHTML || "";
    const updatedPost: FanPost = {
      ...data,
      description,
      hashtag: hashtags.map(tag => `#${tag}`).join(","),
      media: images.map((url) => ({ type: "image", url })),
    };
    if (onSubmit) onSubmit(updatedPost);
    onClose();
  };

  return (
    <div className={styles.uploadPopupWrapper}>
      <h2 className={styles.uploadPopupTitle}>게시물 수정</h2>
      <div className={styles.uploadPopupTextareaBox}>
        <div
          ref={editorRef}
          className={styles.uploadPopupEditor}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="내용을 입력해주세요."
          style={{
            minHeight: 120,
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            padding: 30,
            fontSize: "1rem",
            marginBottom: 24,
            background: "#fafbfc",
            outline: "none",
          }}
        />
      </div>
      <div className={styles.uploadPopupHashtagBox}>
        {hashtags.map((tag, idx) => (
          <span className={styles.uploadPopupHashtag} key={tag}>
            #{tag}
            <button
              type="button"
              className={styles.uploadPopupHashtagRemove}
              onClick={() => handleRemoveHashtag(idx)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className={styles.uploadPopupInput}
          placeholder="# 태그를 입력해주세요."
          value={hashtagInput}
          onChange={handleHashtagInput}
          onKeyDown={handleHashtagKeyDown}
        />
      </div>
      <div className={styles.uploadPopupFileBox}>
        <button
          type="button"
          className={styles.uploadPopupFileBtn}
          onClick={() => document.getElementById("edit-file-input")?.click()}
        >
          파일 선택
        </button>
        <input
          id="edit-file-input"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className={styles.uploadPopupImageList}>
        {images.map((img, idx) => (
          <div key={idx} className={styles.uploadPopupImageItem}>
            <img
              src={img}
              alt={`preview-${idx}`}
              className={styles.uploadPopupImage}
            />
            <button
              onClick={() => handleRemoveImage(idx)}
              className={styles.uploadPopupRemoveBtn}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className={styles.uploadPopupBtnBox}>
        <button
          type="button"
          className={styles.uploadPopupEmojiBtn}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          😀
        </button>
        {showEmojiPicker && (
          <div className={styles.uploadPopupEmojiPicker}>
            {Array.from({ length: Math.ceil(emojis.length / 3) }).map((_, rowIdx) => (
              <div className={styles.uploadPopupEmojiRow} key={rowIdx}>
                {emojis.slice(rowIdx * 3, rowIdx * 3 + 3).map((emoji, i) => (
                  <button
                    key={i}
                    type="button"
                    className={styles.uploadPopupEmoji}
                    onClick={() => handleEmojiInsert(emoji)}
                  >
                    <img src={emoji} alt={`emoji${rowIdx * 3 + i + 1}`} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleEdit}
          className={styles.uploadPopupSubmitBtn}
        >
          수정 완료
        </button>
      </div>
    </div>
  );
};

const Popup = (props: PopupProps) => {
  const { type, onClose } = props;

  useEffect(() => {
    // 팝업이 열릴 때 body 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      // 팝업이 닫힐 때 원상복구
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={styles.popupWrapper}>
      <div className={styles.popupContent}>
        {type === 'artistFeed' && (
          <ArtistFeedPopup data={props.data} />
        )}
        {type === 'fanFeed' && (
          <FanFeedPopup data={props.data} onClose={onClose} onEdit={props.onEdit} />
        )}
        {type === 'upload' && <UploadPopup onSubmit={props.onSubmit} onClose={onClose} />}
        {type === 'edit' && <EditPopup data={props.data} onClose={onClose} onSubmit={props.onUpdate} />}
        <button onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default Popup;