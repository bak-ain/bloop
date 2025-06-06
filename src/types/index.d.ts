//프로필
export interface UserPreview {
  name: string;                 // 닉네임 or 활동명
  profileImage: string;
  badgeType: 'fan' | 'artist';
  badgeLevel?: 1 | 2 | 3;
  userId?: string;              // @아이디 표기용 (옵셔널)
}

//게시물
export interface BasePost {
  id: string;
  name: string;
  date: string;
  description: string;
  likes: number;
  comment: number;
  profileImage: string;
  badgeType: 'artist' | 'fan';
  badgeLevel?: 1 | 2 | 3;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  hashtag?: string;
  emoji?: string;

  // 상태값
  isScrapped?: boolean;
  isLiked?: boolean;
}

export interface ArtistPost extends BasePost {
  badgeType: 'artist';
  badgeLevel?: never;
  isStory?: boolean;
}

export interface FanPost extends BasePost {
  badgeType: 'fan';
  badgeLevel: 1 | 2 | 3;
}
// export interface ArtistStoryCard {
//   id: string;
//   name: string;
//   profileImage: string;
//   imageUrls: string[];       
//   isScrapped?: boolean;
//   isLiked?: boolean;
// }



// 댓글용
export interface CommentPost {
  id: string;
  postId: string;              // 🔹 댓글이 달린 포스트 ID
  postType: "artist" | "fan";  // 🔹 포스트 타입 (아티스트 or 팬)
  user: UserPreview;
  content: string;
  emoji?: string;
  date: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  showReplies?: boolean;
  replies?: CommentPost[];
  editable?: boolean;
  replies?: CommentPost[]
}



export interface CommentInput {
  content: string;
  emoji?: string;
  parentPostId: string;
}

//기획사 공식 컨텐츠
export interface OfficialContent {
  id: string;
  type: 'default' | 'new' | 'imageOnly' | 'feature';
  title?: string;
  description?: string;
  descriptionDetail?: string;
  date?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  likes?: number;
  hashtag?: string;
  buttonText?: string;
  isScrapped?: boolean;
  isLiked?: boolean;
}

//스케줄
export interface ScheduleEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  type?: '공연' | '방송' | '팬미팅' | '기타';
}

export interface ScheduleDay {
  date: string;
  events: ScheduleEvent[];
}
export interface ScheduleDetail {
  id: string;
  title: string;               // 일정 제목
  imageUrl?: string;           // 관련 이미지 (선택)
  datetime: string;            // 날짜 + 시간 (예: "2025.06.22(토) 오후 3:00")
  location: string;            // 장소
  description?: string;        // 설명
}

//멤버프로필
export interface MemberCard {
  id: string;
  name: string;
  imageUrl: string;
}

//나의활동&스크랩
export interface UserContentBase {
  id: string;
  type: 'agency' | 'artist' | 'community';
  date: string;
  description: string;
  imageUrls?: string[];       // ✅ 배열로 변경
  likes: number;
  comments?: number;
  editable?: boolean;
}

export interface MyScrapPost extends UserContentBase {
  viewType: 'scrap';
  scrapCategory: 'agency' | 'artist' | 'community';
  isScrapped: true;
  author?: UserPreview;
}

export interface MyWrittenPost extends UserContentBase {
  viewType: 'written';
  editable: true;
}


export interface MyLikedPost extends UserContentBase {
  viewType: 'liked';
  isLiked: true;
  author?: UserPreview;
}
export interface MyCommentPost {
  id: string;
  viewType: 'comment';
  parentTitle: string;
  content: string;
  date: string;
  editable: true;
}

//팬성향
export interface FanMbti {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

//로그인
// 공통 로그인 필드
export interface BaseLoginInput {
  id: string;           // 아이디
  password: string;     // 비밀번호
  rememberMe?: boolean; // 아이디 저장 여부
}

// 팬 로그인
export interface FanLoginInput extends BaseLoginInput {
  userType: 'fan';
}

// 기획사 로그인
export interface AgencyLoginInput extends BaseLoginInput {
  userType: 'agency';
}

//회원가입
export interface FanSignupInput {
  userType: 'fan';
  id: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  birth: {
    year: string;
    month: string;
    day: string;
  };
  agree: {
    privacy: boolean;
    communityPolicy: boolean;
    marketing?: boolean;
    over14: boolean;
  };
}

export interface AgencySignupInput {
  userType: 'agency';
  company: string;
  artistName: string;
  id: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  phone: string;
  agree: {
    privacy: boolean;
    uploadResponsibility: boolean;
    marketing?: boolean;
    over14: boolean;
  };
}

//유저관리
export interface User {
  id: string;                // 로그인 ID
  nickname?: string;         // 팬 계정일 경우
  name: string;              // 본명 or 담당자명
  email: string;
  phone: string;
  userType: 'fan' | 'agency';

  // fan 전용
  gender?: 'male' | 'female';
  birth?: {
    year: string;
    month: string;
    day: string;
  };
  badgeLevel?: 1 | 2 | 3;
  profileImage?: string;

  // agency 전용
  company?: string;
  artistName?: string;

  // 설정 관련
  marketingAgreed?: boolean;
  over14Confirmed: boolean;
}

//회원정보 수정
export interface FanProfileEditable {
  id: string;                 // 수정 불가
  password?: string;          // 선택 입력
  confirmPassword?: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  birth: {
    year: string;
    month: string;
    day: string;
  };
  profileImage?: string;
}
export interface AgencyProfileEditable {
  id: string;
  password?: string;
  confirmPassword?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  artistName: string;
  profileImage?: string;
}

//회원등급
export interface UserLevelStatus {
  currentLevel: 'BEGINNER' | 'LOFAN' | 'PROFANSSOR';
  nextLevel?: 'LOFAN' | 'PROFANSSOR';
  progress: number;
  remaining: {
    posts: number;
    comments: number;
  };
  badgeIconUrl: string; // ✅ 미리 포함시키는 게 더 자연스러움
}

