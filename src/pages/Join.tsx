import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '../components/Container';
import styles from './Join.module.css';
import { useUserContext } from '../context/UserContext ';
import type { FanSignupInput, AgencySignupInput } from '../types';

const EMAIL_DOMAINS = [
  'gmail.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'hotmail.com',
  '직접입력',
];

const defaultFan: FanSignupInput = {
  userType: 'fan',
  id: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  name: '',
  email: '',
  phone: '',
  gender: 'female',
  profileImage: '/images/profile_img.png', // 기본 프로필 이미지
  birth: { year: '', month: '', day: '' },
  agree: { privacy: false, communityPolicy: false, marketing: false, over14: false }
};

const defaultAgency: AgencySignupInput = {
  userType: 'agency',
  company: '',
  artistName: '',
  id: '',
  password: '',
  confirmPassword: '',
  name: '',
  email: '',
  phone: '',
  agree: { privacy: false, uploadResponsibility: false, marketing: false, over14: false }
};

const parseEmail = (email: string) => {
  const [local, domain] = email.split('@');
  return { local: local || '', domain: domain || '' };
};

const Join = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialType = params.get('type') === 'agency' ? 'agency' : 'fan';
  const [userType, setUserType] = useState<'fan' | 'agency'>(initialType);
  const [fanInput, setFanInput] = useState<FanSignupInput>({ ...defaultFan });
  const [agencyInput, setAgencyInput] = useState<AgencySignupInput>({ ...defaultAgency });
  const [showDomainSelect, setShowDomainSelect] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { addUser } = useUserContext();
  const navigate = useNavigate();

  // 이메일 분리
  const { local: fanEmailLocal, domain: fanEmailDomain } = parseEmail(fanInput.email);
  const { local: agencyEmailLocal, domain: agencyEmailDomain } = parseEmail(agencyInput.email);

  // input 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (userType === 'fan') {
      if (name.startsWith('agree.')) {
        setFanInput(prev => ({
          ...prev,
          agree: { ...prev.agree, [name.split('.')[1]]: checked }
        }));
      } else if (name.startsWith('birth.')) {
        setFanInput(prev => ({
          ...prev,
          birth: { ...prev.birth, [name.split('.')[1]]: value }
        }));
      } else if (name === 'emailLocal') {
        setFanInput(prev => ({
          ...prev,
          email: value + '@' + fanEmailDomain
        }));
      } else if (name === 'emailDomain') {
        setFanInput(prev => ({
          ...prev,
          email: fanEmailLocal + '@' + value
        }));
      } else {
        setFanInput(prev => ({ ...prev, [name]: value }));
      }
    } else {
      if (name.startsWith('agree.')) {
        setAgencyInput(prev => ({
          ...prev,
          agree: { ...prev.agree, [name.split('.')[1]]: checked }
        }));
      } else if (name === 'emailLocal') {
        setAgencyInput(prev => ({
          ...prev,
          email: value + '@' + agencyEmailDomain
        }));
      } else if (name === 'emailDomain') {
        setAgencyInput(prev => ({
          ...prev,
          email: agencyEmailLocal + '@' + value
        }));
      } else {
        setAgencyInput(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  // 이메일 도메인 선택
  const handleDomainSelect = (domain: string) => {
    setShowDomainSelect(false);
    if (userType === 'fan') {
      if (domain === '직접입력') {
        setFanInput(prev => ({
          ...prev,
          email: fanEmailLocal + '@'
        }));
      } else {
        setFanInput(prev => ({
          ...prev,
          email: fanEmailLocal + '@' + domain
        }));
      }
    } else {
      if (domain === '직접입력') {
        setAgencyInput(prev => ({
          ...prev,
          email: agencyEmailLocal + '@'
        }));
      } else {
        setAgencyInput(prev => ({
          ...prev,
          email: agencyEmailLocal + '@' + domain
        }));
      }
    }
  };

  // 성별 라디오
  const handleGender = (gender: 'male' | 'female') => {
    setFanInput(prev => ({ ...prev, gender }));
  };

  // 생년월일 날짜 선택
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value; // yyyy-mm-dd
    const [year, month, day] = date.split('-');
    if (userType === 'fan') {
      setFanInput(prev => ({
        ...prev,
        birth: { year, month, day }
      }));
    }
    setShowDatePicker(false);
  };

  // 탭 전환
  const handleTab = (type: 'fan' | 'agency') => {
    setUserType(type);
    setShowDomainSelect(false);
    setShowDatePicker(false);
  };

  // 회원가입 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === 'fan') {
      if (fanInput.password !== fanInput.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      addUser({ ...fanInput });
      alert('회원가입이 완료되었습니다.');
      navigate('/login?type=fan');
    } else {
      if (agencyInput.password !== agencyInput.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      addUser({ ...agencyInput });
      alert('회원가입이 완료되었습니다.');
      navigate('/login?type=agency');
    }
  };

  return (
    <Container>
      <div className={styles.joinWrap}>
        <div className={styles.tabRow}>
          <button
            className={`${styles.tabBtn} ${userType === 'fan' ? styles.active : ''}`}
            type="button"
            onClick={() => handleTab('fan')}
          >
            Fan
          </button>
          <button
            className={`${styles.tabBtn} ${userType === 'agency' ? styles.active : ''}`}
            type="button"
            onClick={() => handleTab('agency')}
          >
            Agency
          </button>
        </div>
        <div className={`${styles.joinTitle} h3_tit`}>회원가입</div>
        <form className={styles.joinForm} onSubmit={handleSubmit}>
          {userType === 'fan' ? (
            <>
              <label className={`join_p`}>아이디<span className={styles.red_star}>*</span><input name="id" value={fanInput.id} onChange={handleChange} required placeholder="Enter your ID" /></label>
              <label className={`join_p`}>닉네임 <span className={styles.red_star}>*</span><input name="nickname" value={fanInput.nickname} onChange={handleChange} required placeholder="Enter your Nickname" /></label>
              <label className={`join_p`}>비밀번호 <span className={styles.red_star}>*</span><input name="password" type="password" value={fanInput.password} onChange={handleChange} required placeholder="Enter your password" /></label>
              <label className={`join_p`}>비밀번호확인 <span className={styles.red_star}>*</span><input name="confirmPassword" type="password" value={fanInput.confirmPassword} onChange={handleChange} required placeholder="Enter your password one more time." /></label>
              <label className={`join_p`}>이름 <span className={styles.red_star}>*</span><input name="name" value={fanInput.name} onChange={handleChange} required placeholder="Enter your name" /></label>
              <label className={`join_p`}>
                이메일 <span className={styles.red_star} >*</span>
                <div className={styles.emailInputWrap}>
                  <input
                    type="text"
                    name="emailLocal"
                    value={fanEmailLocal}
                    onChange={handleChange}
                    className={styles.emailInput}
                    style={{ width: 120 }}
                    required
                  />
                  <span>@</span>
                  <input
                    type="text"
                    name="emailDomain"
                    value={fanEmailDomain}
                    onChange={handleChange}
                    className={styles.emailInput}
                    style={{ width: 120 }}
                    required
                    readOnly={EMAIL_DOMAINS.includes(fanEmailDomain) && fanEmailDomain !== '직접입력'}
                  />
                  <button
                    type="button"
                    className={styles.emailSelectBtn}
                    onClick={() => setShowDomainSelect(v => !v)}
                  >
                    @ 선택하기
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
              </label>
              <label className={`join_p`}>휴대폰 <span className={styles.red_star}>*</span><input name="phone" value={fanInput.phone} onChange={handleChange} required placeholder="Enter your phone number" /></label>
              <div className={styles.row}>
                <span className={`join_p`}>성별</span>
                <label><input type="radio" checked={fanInput.gender === 'male'} onChange={() => handleGender('male')} /> 남성</label>
                <label><input type="radio" checked={fanInput.gender === 'female'} onChange={() => handleGender('female')} /> 여성</label>
              </div>
              <div className={styles.row}>
                <span className={`join_p`}>생년월일</span>
                <input
                  name="birth.year"
                  value={fanInput.birth.year}
                  onChange={handleChange}
                  placeholder="YYYY"
                  maxLength={4}
                  style={{ width: 60 }}
                />
                /
                <input
                  name="birth.month"
                  value={fanInput.birth.month}
                  onChange={handleChange}
                  placeholder="MM"
                  maxLength={2}
                  style={{ width: 40 }}
                />
                /
                <input
                  name="birth.day"
                  value={fanInput.birth.day}
                  onChange={handleChange}
                  placeholder="DD"
                  maxLength={2}
                  style={{ width: 40 }}
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
                    className={styles.birthDatePicker}
                    value={
                      fanInput.birth.year && fanInput.birth.month && fanInput.birth.day
                        ? `${fanInput.birth.year}-${fanInput.birth.month.padStart(2, '0')}-${fanInput.birth.day.padStart(2, '0')}`
                        : ''
                    }
                    onChange={handleDateChange}
                    onBlur={() => setShowDatePicker(false)}
                  />
                )}
              </div>
              <div className={styles.agreeBox}>
                <label className={`join_p`}><input type="checkbox" name="agree.privacy" checked={fanInput.agree.privacy} onChange={handleChange} required /> 개인정보 수집/이용 동의 (필수)</label>
                <label className={`join_p`}><input type="checkbox" name="agree.communityPolicy" checked={fanInput.agree.communityPolicy} onChange={handleChange} required /> 커뮤니티 운영 정책 동의 (필수)</label>
                <label className={`join_p`}><input type="checkbox" name="agree.marketing" checked={!!fanInput.agree.marketing} onChange={handleChange} /> 이벤트 관련 광고 및 정보 수신 동의 (선택)</label>
                <label className={`join_p`}><input type="checkbox" name="agree.over14" checked={fanInput.agree.over14} onChange={handleChange} required /> 본인은 만 14세 이상입니다 (필수)</label>
              </div>
            </>
          ) : (
            <>
              <label>회사명*<input name="company" value={agencyInput.company} onChange={handleChange} required placeholder="Enter your company" /></label>
              <label>아티스트명*<input name="artistName" value={agencyInput.artistName} onChange={handleChange} required placeholder="Enter your artist" /></label>
              <label>아이디*<input name="id" value={agencyInput.id} onChange={handleChange} required placeholder="Enter your ID" /></label>
              <label>비밀번호*<input name="password" type="password" value={agencyInput.password} onChange={handleChange} required placeholder="Enter your password" /></label>
              <label>비밀번호확인*<input name="confirmPassword" type="password" value={agencyInput.confirmPassword} onChange={handleChange} required placeholder="Enter your password one more time." /></label>
              <label>이름*<input name="name" value={agencyInput.name} onChange={handleChange} required placeholder="Enter your name" /></label>
              <label>
                이메일*
                <div className={styles.emailInputWrap}>
                  <input
                    type="text"
                    name="emailLocal"
                    value={agencyEmailLocal}
                    onChange={handleChange}
                    className={styles.emailInput}
                    style={{ width: 120 }}
                    required
                  />
                  <span>@</span>
                  <input
                    type="text"
                    name="emailDomain"
                    value={agencyEmailDomain}
                    onChange={handleChange}
                    className={styles.emailInput}
                    style={{ width: 120 }}
                    required
                    readOnly={EMAIL_DOMAINS.includes(agencyEmailDomain) && agencyEmailDomain !== '직접입력'}
                  />
                  <button
                    type="button"
                    className={styles.emailSelectBtn}
                    onClick={() => setShowDomainSelect(v => !v)}
                  >
                    @ 선택하기
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
              </label>
              <label>휴대폰*<input name="phone" value={agencyInput.phone} onChange={handleChange} required placeholder="Enter your phone number" /></label>
              <div className={styles.agreeBox}>
                <label><input type="checkbox" name="agree.privacy" checked={agencyInput.agree.privacy} onChange={handleChange} required /> 개인정보 수집/이용 동의 (필수)</label>
                <label><input type="checkbox" name="agree.uploadResponsibility" checked={agencyInput.agree.uploadResponsibility} onChange={handleChange} required /> 아티스트 컨텐츠 업로드 및 저작권 책임 동의 (필수)</label>
                <label><input type="checkbox" name="agree.marketing" checked={!!agencyInput.agree.marketing} onChange={handleChange} /> 이벤트 관련 광고 및 정보 수신 동의 (선택)</label>
                <label><input type="checkbox" name="agree.over14" checked={agencyInput.agree.over14} onChange={handleChange} required /> 본인은 만 14세 이상입니다 (필수)</label>
              </div>
            </>
          )}
          <button className={styles.joinBtn} type="submit">회원가입완료하기</button>
        </form>
      </div>
    </Container>
  );
};

export default Join;