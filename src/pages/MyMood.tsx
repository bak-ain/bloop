import React, { useRef, useState } from 'react';
import Container from '../components/Container';
import styles from './Mymood.module.css';
import styles2 from './Myecho.module.css';
import { FanProfileEditable } from '../types';
import { getBadgeImage } from '../utils/badge';
import { useUserContext } from "../context/UserContext ";

const EMAIL_DOMAINS = [
  'gmail.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'hotmail.com',
  '직접입력',
];

const parseEmail = (email: string) => {
  const [local, domain] = email.split('@');
  return { local, domain };
};

const MyMood = () => {
  const { user, setUser } = useUserContext();
  const [editMode, setEditMode] = useState(false);


  // user를 FanProfileEditable로 간주
  const [profile, setProfile] = useState<FanProfileEditable>(user as FanProfileEditable);
  const [form, setForm] = useState<FanProfileEditable>(user as FanProfileEditable);
  const [showDomainSelect, setShowDomainSelect] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // user가 없으면 안내만 보여주기
  if (!user || !profile || !form) {
    return (
      <Container>
        <div className={styles.myeMoodWrap}>
          <div className={styles.notLoginMsg}>로그인 후 이용 가능합니다.</div>
        </div>
      </Container>
    );
  }
  // 이메일 분리
  const { local: emailLocal, domain: emailDomain } = parseEmail(form.email);

  // 프로필 사진 변경
  const handleProfileImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setForm(prev => ({
          ...prev,
          profileImage: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 입력값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (name === 'gender') {
      setForm(prev => ({
        ...prev,
        gender: value as 'male' | 'female',
      }));
    } else if (name === 'year' || name === 'month' || name === 'day') {
      setForm(prev => ({
        ...prev,
        birth: {
          ...prev.birth,
          [name]: value,
        },
      }));
    } else if (name === 'emailLocal') {
      setForm(prev => ({
        ...prev,
        email: value + '@' + emailDomain,
      }));
    } else if (name === 'emailDomain') {
      setForm(prev => ({
        ...prev,
        email: emailLocal + '@' + value,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 이메일 도메인 선택
  const handleDomainSelect = (domain: string) => {
    setShowDomainSelect(false);
    if (domain === '직접입력') {
      setForm(prev => ({
        ...prev,
        email: emailLocal + '@',
      }));
    } else {
      setForm(prev => ({
        ...prev,
        email: emailLocal + '@' + domain,
      }));
    }
  };

  // 날짜 선택
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value; // yyyy-mm-dd
    const [year, month, day] = date.split('-');
    setForm(prev => ({
      ...prev,
      birth: { year, month, day },
    }));
    setShowDatePicker(false);
  };

  // 저장
  const handleSave = () => {
    setProfile(form);
    setUser({ ...user, ...form }); // Context의 user도 업데이트
    setEditMode(false);
  };

  // 수정모드 진입
  const handleEdit = () => {
    setForm(profile);
    setEditMode(true);
  };

  return (
    <Container>
      <div className={`${styles2.myeMoodBg} ${styles2.myBg}`} />
      <div className={`${styles2.myWrap} inner`}>
        <h3 className={`${styles2.myTitle} h3_tit`}>MY MOOD</h3>
        {/* 프로필 영역 */}
        <div className={styles.myeMoodProfileTop}>
          <div className={styles.profileImgWrap}>
            <img
              src={editMode ? form.profileImage : profile.profileImage}
              alt="프로필"
              className={styles.myeMoodProfileImg}
            />
            {editMode && (
              <>
                <button
                  className={styles.cameraBtn}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <img src="/images/camera.png" alt="카메라" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfileImgChange}
                />
              </>
            )}
          </div>
          <div className={styles.profileNameRow}>
            <span className={styles.profileBadge}>
              <img
                src={getBadgeImage(
                  user.userType === "agency" ? "artist" : user.userType, // 팬이면 "fan", 에이전시면 "artist"
                  (user as any).badgeLevel || 1 // badgeLevel이 있으면 사용, 없으면 1
                )}
                alt="뱃지"
              />
            </span>
            <span className={styles.profileNickname}>{profile.nickname}</span>
          </div>
        </div>

        <div className={styles.infoBoxWrap}>
          {/* 로그인 정보 */}
          <div className={`${styles.infoBox} ${styles.infoBoxLogin}`}>
            <div className={styles.infoTab}>로그인 정보</div>
            <div className={styles.infoRow}>
              <span className={`${styles.infoLabel} card_p `}>아이디</span>
              <span className={`${styles.infoValue} card_p2`}>{profile.id}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={`${styles.infoLabel} card_p `}>비밀번호</span>
              {editMode ? (
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`${styles.infoInput} card_p2`}
                />
              ) : (
                <span className={`${styles.infoValue} card_p2`}>******</span>
              )}
            </div>
            {editMode && (
              <div className={styles.infoRow}>
                <span className={`${styles.infoLabel} card_p `}>비밀번호 확인</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`${styles.infoInput} card_p2`}
                />
              </div>
            )}
          </div>

          {/* 프로필 정보 */}
          <div className={`${styles.infoBox} ${styles.infoBoxProfile}`}>
            <div className={styles.infoTab}>프로필 정보</div>
            <div className={styles.infoRow}>
              <span className={`${styles.infoLabel} card_p `}>이름</span>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`${styles.infoInput} card_p2`}
                />
              ) : (
                <span className={`${styles.infoValue} card_p2`}>{profile.name}</span>
              )}
            </div>
            <div className={styles.infoRow}>
              <span className={`${styles.infoLabel} card_p `}>성별</span>
              {editMode ? (
                <>
                  <div className={`${styles.genderOptions} card_p2`}>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={form.gender === 'male'}
                        onChange={handleChange}
                      /> 남성
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={form.gender === 'female'}
                        onChange={handleChange}
                      /> 여성
                    </label>
                  </div>
                </>
              ) : (
                <span className={`${styles.infoValue} card_p2`}>{profile.gender === 'male' ? '남성' : '여성'}</span>
              )}
            </div>
            <div className={styles.infoRow}>
              <span className={`${styles.infoLabel} card_p `}>닉네임</span>
              {editMode ? (
                <input
                  type="text"
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                  className={`${styles.infoInput} card_p2`}
                />
              ) : (
                <span className={`${styles.infoValue} card_p2`}>{profile.nickname}</span>
              )}
            </div>
            <div className={styles.infoRow}>
              <span className={`${styles.infoLabel} card_p `}>이메일</span>
              {editMode ? (
                <div className={styles.emailInputWrap}>
                  <input
                    type="text"
                    name="emailLocal"
                    value={emailLocal}
                    onChange={handleChange}
                    className={`${styles.emailInput} card_p2`}
                  />
                  <span className='card_p2'> @ </span>
                  <input
                    type="text"
                    name="emailDomain"
                    value={emailDomain}
                    onChange={handleChange}
                    className={`${styles.emailInput} card_p2 ${styles.emailDomainInput}`}
                    readOnly={EMAIL_DOMAINS.includes(emailDomain) && emailDomain !== '직접입력'}
                  />
                  <button
                    type="button"
                    className={styles.emailSelectBtn}
                    onClick={() => setShowDomainSelect(v => !v)}
                  >
                    <span className={styles.btnTextPc}>선택하기</span>
                    <span className={styles.btnTextMobile}>선택</span>
                  </button>
                  {showDomainSelect && (
                    <ul className={styles.emailDomainList}>
                      {EMAIL_DOMAINS.map(domain => (
                        <li
                          key={domain}
                          className={styles.emailDomainItem}
                          onClick={() => handleDomainSelect(domain)}
                        >
                          {domain}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <span className={`${styles.infoValue} card_p2`}>{profile.email}</span>
              )}
            </div>
            <div className={styles.infoRow}>
              <span className={`${styles.infoLabel} card_p `}>생년월일</span>
              {editMode ? (
                <div className={` ${styles.birthInputWrap} card_p2`}>
                  <input
                    type="text"
                    name="year"
                    value={form.birth.year}
                    onChange={handleChange}
                    className={`${styles.birthInput} card_p2`}
                    maxLength={4}
                    placeholder="YYYY"
                    onFocus={() => setShowDatePicker(false)}
                  />
                  <span>/</span>
                  <input
                    type="text"
                    name="month"
                    value={form.birth.month}
                    onChange={handleChange}
                    className={`${styles.birthInput} card_p2`}
                    maxLength={2}
                    placeholder="MM"
                    onFocus={() => setShowDatePicker(false)}
                  />
                  <span>/</span>
                  <input
                    type="text"
                    name="day"
                    value={form.birth.day}
                    onChange={handleChange}
                    className={`${styles.birthInput} card_p2`}
                    maxLength={2}
                    placeholder="DD"
                    onFocus={() => setShowDatePicker(false)}
                  />
                  <button
                    type="button"
                    className={styles.birthSelectBtn}
                    onClick={() => setShowDatePicker(v => !v)}
                  >
                    📅
                  </button>
                  {showDatePicker && (
                    <input
                      type="date"
                      className={`${styles.birthDatePicker}`}
                      value={`${form.birth.year}-${form.birth.month}-${form.birth.day}`}
                      onChange={handleDateChange}
                      onBlur={() => setShowDatePicker(false)}
                    />
                  )}
                </div>
              ) : (
                <span className={`${styles.infoValue} card_p2`}>
                  {`${profile.birth.year} / ${profile.birth.month} / ${profile.birth.day}`}
                </span>
              )}
            </div>
            <div className={styles.infoRow}>
              <span className={`${styles.infoLabel} card_p `}>휴대폰</span>
              {editMode ? (
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`${styles.infoInput} card_p2`}
                />
              ) : (
                <span className={`${styles.infoValue} card_p2`}>{profile.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className={styles.btnWrap}>
          {editMode ? (
            <button className={`${styles.saveBtn} btnBlue`} onClick={handleSave}>저장하기</button>
          ) : (
            <button className={`${styles.editBtn} btnBlue`} onClick={handleEdit}>수정하기</button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default MyMood;