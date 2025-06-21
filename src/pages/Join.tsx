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
  const fanEmailDomainInputRef = useRef<HTMLInputElement>(null);
  const agencyEmailDomainInputRef = useRef<HTMLInputElement>(null);
  // 이메일 도메인 선택
  const handleDomainSelect = (domain: string) => {
    setShowDomainSelect(false);
    if (userType === 'fan') {
      if (domain === '직접입력') {
        setFanInput(prev => ({
          ...prev,
          email: fanEmailLocal + '@'
        }));
        setTimeout(() => {
          fanEmailDomainInputRef.current?.focus();
        }, 0);
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
        setTimeout(() => {
          agencyEmailDomainInputRef.current?.focus();
        }, 0);
      } else {
        setAgencyInput(prev => ({
          ...prev,
          email: agencyEmailLocal + '@' + domain
        }));
      }
    }
  };


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
      <div className={`${styles.joinWrap}  inner`}>
        <div className={`${styles.joincon} all_p_t`}>
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
          <div className={styles.join_con}>
            <div className={`${styles.joinTitle} `}>
              <h1 className={`h3_tit`}>회원가입</h1>
              <p className={`${styles.joinP} `}> <span className={styles.red_star}>*</span> 필수입력사항</p>
            </div>
            <form className={styles.joinForm} onSubmit={handleSubmit}>
              {userType === 'fan' ? (
                <>

                  <label className={`join_p`}><div className={`${styles.joinTit}`}>아이디<span className={styles.red_star}>*</span></div> <input name="id" value={fanInput.id} onChange={handleChange} required placeholder="Enter your ID" /></label>
                  <label className={`join_p`}><div className={`${styles.joinTit}`}>닉네임<span className={styles.red_star}>*</span></div><input name="nickname" value={fanInput.nickname} onChange={handleChange} required placeholder="Enter your Nickname" /></label>
                  <label className={`join_p`}>
                    <div className={`${styles.joinTit}`}>비밀번호<span className={styles.red_star}>*</span></div>
                    <input name="password" type="password" value={fanInput.password} onChange={handleChange} required placeholder="Enter your password" />
                  </label>
                  <label className={`join_p`}><div className={`${styles.joinTit}`}>비밀번호 확인<span className={styles.red_star}>*</span></div><input name="confirmPassword" type="password" value={fanInput.confirmPassword} onChange={handleChange} required placeholder="Enter your password one more time." /></label>
                  <label className={`join_p`}><div className={`${styles.joinTit}`}>이름<span className={styles.red_star}>*</span></div><input name="name" value={fanInput.name} onChange={handleChange} required placeholder="Enter your name" /></label>
                  <div className={styles.em}>
                    <label className={`join_p`}>
                      <div className={styles.eTit}>
                        이메일<span className={styles.red_star}>*</span>
                      </div>
                      <div className={styles.emailInputTit}>
                        <input
                          type="text"
                          name="emailLocal"
                          value={fanEmailLocal}
                          onChange={handleChange}
                          className={styles.emailInput}
                          required
                        />
                        <span>@</span>
                        <span className={`${styles.emailInputDomain} ${fanEmailDomain === '직접입력' ? styles.noBorder : ''}`}>
                          <input
                            ref={fanEmailDomainInputRef}
                            type="text"
                            name="emailDomain"
                            value={
                              fanEmailDomain && fanEmailDomain !== '직접입력'
                                ? fanEmailDomain // ← @ 없이 도메인만
                                : fanEmailDomain === '직접입력'
                                  ? ''
                                  : fanEmailDomain
                            }
                            onChange={handleChange}
                            className={styles.emailInput}
                            required
                            readOnly={fanEmailDomain !== '직접입력' && EMAIL_DOMAINS.includes(fanEmailDomain)}
                            placeholder={fanEmailDomain === '직접입력' ? '도메인을 입력하세요' : ''}
                            style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent' }}
                          />
                          <button
                            type="button"
                            className={`${styles.emailSelectBtn} ${styles.joinBtn_txt}`}
                            onClick={() => setShowDomainSelect(v => !v)}
                            tabIndex={-1}
                          >
                            선택하기
                          </button>
                          {showDomainSelect && (
                            <ul className={styles.emailDomainList}>
                              {EMAIL_DOMAINS.map(domain => (
                                <li
                                  key={domain}
                                  className={styles.emailDomainItem}
                                  onClick={() => handleDomainSelect(domain)}
                                >
                                  @{domain}
                                </li>
                              ))}
                            </ul>
                          )}
                        </span>
                      </div>
                    </label>
                  </div>
                  <label className={`join_p`}><div className={`${styles.joinTit}`}>휴대폰<span className={styles.red_star}>*</span></div><input name="phone" value={fanInput.phone} onChange={handleChange} required placeholder="Enter your phone number" /></label>
                  <div className={styles.row}>
                    <span className={`join_p`}>성별</span>
                    <div className={styles.genderRadio}>
                      <label className={`${styles.genderLabel} ${fanInput.gender === 'male' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="gender"
                          checked={fanInput.gender === 'male'}
                          onChange={() => handleGender('male')}
                          className={styles.gen}
                        /> 남성
                      </label>
                      <label className={`${styles.genderLabel} ${fanInput.gender === 'female' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="gender"
                          checked={fanInput.gender === 'female'}
                          onChange={() => handleGender('female')}
                          className={styles.gen}
                        /> 여성
                      </label>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <span className={`join_p`}>생년월일</span>
                    <div className={styles.birthInput}>
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
                    </div>



                  </div>
                  <div className={styles.agreeSection}>
                    <div className={`${styles.agreeTitle} join_p`}>
                      이용약관동의<span className={styles.red_star}>*</span>
                    </div>
                    <div className={styles.agreeBox}>
                      {/* 전체동의 */}
                      <div className={styles.agreeAllRow}>
                        <label className={`${styles.circleLabel} ${styles.join_all}`}>

                          <input
                            type="checkbox"
                            checked={
                              fanInput.agree.privacy &&
                              fanInput.agree.communityPolicy &&
                              fanInput.agree.marketing &&
                              fanInput.agree.over14
                            }
                            onChange={e => {
                              const checked = e.target.checked;
                              setFanInput(prev => ({
                                ...prev,
                                agree: {
                                  privacy: checked,
                                  communityPolicy: checked,
                                  marketing: checked,
                                  over14: checked,
                                },
                              }));
                            }}
                            className={styles.circleRadio}
                          />
                          <span className={styles.agreeAllText}>전체동의합니다.</span>

                        </label>
                        <div className={`${styles.agreeSubDesc2} day_span`}>
                          선택항목에 동의하지 않은 경우도 회원가입이 가능합니다.
                        </div>
                      </div>

                      {/* 개인정보 수집/이용 동의 */}
                      <div className={styles.agreeRow}>
                        <label className={`${styles.circleLabel} join_p`}>
                          <input
                            type="checkbox"
                            checked={fanInput.agree.privacy}
                            onChange={e =>
                              setFanInput(prev => ({
                                ...prev,
                                agree: { ...prev.agree, privacy: e.target.checked },
                              }))
                            }
                            className={styles.circleRadio}
                            required
                          />
                          개인정보 수집/이용 동의 <span className={styles.red_star}>(필수)</span>
                        </label>
                      </div>

                      {/* 커뮤니티 운영 정책 동의 */}
                      <div className={styles.agreeRow}>
                        <label className={`${styles.circleLabel} join_p`}>
                          <input
                            type="checkbox"
                            checked={fanInput.agree.communityPolicy}
                            onChange={e =>
                              setFanInput(prev => ({
                                ...prev,
                                agree: { ...prev.agree, communityPolicy: e.target.checked },
                              }))
                            }
                            className={styles.circleRadio}
                            required
                          />
                          커뮤니티 운영 정책 동의 <span className={styles.red_star}>(필수)</span>
                        </label>
                        <div className={`${styles.agreeSubDesc} day_span`}>
                          게시글/댓글 작성 시 준수해야 할 커뮤니티 규칙에 동의합니다.
                        </div>
                      </div>

                      {/* 광고 및 정보 수신 동의 (선택) */}
                      <div className={styles.agreeRow}>
                        <label className={`${styles.circleLabel} join_p`}>
                          <input
                            type="checkbox"
                            checked={!!fanInput.agree.marketing}
                            onChange={e =>
                              setFanInput(prev => ({
                                ...prev,
                                agree: { ...prev.agree, marketing: e.target.checked },
                              }))
                            }
                            className={styles.circleRadio}
                          />
                          블루프 관련 광고 및 정보 수신 동의<span className={styles.red_star}>(선택)</span>
                        </label>
                        <div className={styles.agreeSubOptions}>
                          <label className={`${styles.circleLabel} day_span`}>
                            <input
                              type="checkbox"
                              checked={!!fanInput.agree}
                              onChange={e =>
                                setFanInput(prev => ({
                                  ...prev,
                                  agree: { ...prev.agree, sms: e.target.checked },
                                }))
                              }
                              className={styles.circleRadio1}
                              disabled={!fanInput.agree.marketing}
                            />
                            SMS
                          </label>
                          <label className={`${styles.circleLabel} day_span`}>
                            <input
                              type="checkbox"
                              checked={!!fanInput.agree}
                              onChange={e =>
                                setFanInput(prev => ({
                                  ...prev,
                                  agree: { ...prev.agree, email: e.target.checked },
                                }))
                              }
                              className={styles.circleRadio1}
                              disabled={!fanInput.agree.marketing}
                            />
                            이메일
                          </label>
                        </div>
                      </div>

                      {/* 만 14세 이상 동의 */}
                      <div className={styles.agreeRow}>
                        <label className={`${styles.circleLabel} join_p`}>
                          <input
                            type="checkbox"
                            checked={fanInput.agree.over14}
                            onChange={e =>
                              setFanInput(prev => ({
                                ...prev,
                                agree: { ...prev.agree, over14: e.target.checked },
                              }))
                            }
                            className={styles.circleRadio}
                            required
                          />
                          본인은 만 14세 이상입니다 <span className={styles.red_star}>(필수)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <label className={`join_p`}><div className={`${styles.joinTit}`}>회사명<span className={styles.red_star}>*</span></div><input name="company" value={agencyInput.company} onChange={handleChange} required placeholder="Enter your company" /></label>
                  <label className={`join_p`}><div className={`${styles.joinTit}`}>아티스트명<span className={styles.red_star}>*</span></div><input name="artistName" value={agencyInput.artistName} onChange={handleChange} required placeholder="Enter your artist" /></label>
                  <label className={`join_p`}><div className={`${styles.joinTit}`}>아이디<span className={styles.red_star}>*</span></div><input name="id" value={agencyInput.id} onChange={handleChange} required placeholder="Enter your ID" /></label>
                  <label className={`join_p`}><div className={`${styles.joinTit}`}>비밀번호<span className={styles.red_star}>*</span></div><input name="password" type="password" value={agencyInput.password} onChange={handleChange} required placeholder="Enter your password" /></label>
                  <label className={`join_p`}><div className={`${styles.joinTit}`}>비밀번호 확인<span className={styles.red_star}>*</span></div><input name="confirmPassword" type="password" value={agencyInput.confirmPassword} onChange={handleChange} required placeholder="Enter your password one more time." /></label>
                  <label className={`join_p`}><div className={`${styles.joinTit}`}>이름<span className={styles.red_star}>*</span></div><input name="name" value={agencyInput.name} onChange={handleChange} required placeholder="Enter your name" /></label>
                  <div className={styles.em}>
                    <label className={`join_p`}>
                      <div className={`${styles.joinTit}`}>이메일<span className={styles.red_star}>*</span></div>
                      <div className={styles.emailInputTit}>
                        <input
                          type="text"
                          name="emailLocal"
                          value={agencyEmailLocal}
                          onChange={handleChange}
                          className={styles.emailInput}
                          required
                        />
                        <span>@</span>
                        <span className={`${styles.emailInputDomain} ${agencyEmailDomain === '직접입력' ? styles.noBorder : ''}`}>
                          <input
                            ref={agencyEmailDomainInputRef}
                            type="text"
                            name="emailDomain"
                            value={
                              fanEmailDomain && fanEmailDomain !== '직접입력'
                                ? fanEmailDomain // ← @ 없이 도메인만
                                : fanEmailDomain === '직접입력'
                                  ? ''
                                  : fanEmailDomain
                            }
                            onChange={handleChange}
                            className={styles.emailInput}
                            required
                            readOnly={agencyEmailDomain !== '직접입력' && EMAIL_DOMAINS.includes(agencyEmailDomain)}
                            placeholder={agencyEmailDomain === '직접입력' ? '도메인을 입력하세요' : ''}
                            style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent' }}
                          />
                          <button
                            type="button"
                            className={`${styles.emailSelectBtn} ${styles.joinBtn_txt}`}
                            onClick={() => setShowDomainSelect(v => !v)}
                            tabIndex={-1}
                          >
                            선택하기
                          </button>
                          {showDomainSelect && (
                            <ul className={styles.emailDomainList}>
                              {EMAIL_DOMAINS.map(domain => (
                                <li
                                  key={domain}
                                  className={styles.emailDomainItem}
                                  onClick={() => handleDomainSelect(domain)}
                                >
                                  @{domain}
                                </li>
                              ))}
                            </ul>
                          )}
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className={styles.agreeSection}>
                    <div  className={`${styles.agreeTitle} join_p`}
                    >
                      이용약관동의<span className={styles.red_star}>*</span>
                    </div>
                    <div className={styles.agreeBox}>
                      {/* 전체동의 */}
                      <div className={styles.agreeAllRow}>
                        <label className={`${styles.circleLabel} ${styles.join_all}`}>

                          <input
                            type="checkbox"
                            checked={
                              fanInput.agree.privacy &&
                              fanInput.agree.communityPolicy &&
                              fanInput.agree.marketing &&
                              fanInput.agree.over14
                            }
                            onChange={e => {
                              const checked = e.target.checked;
                              setFanInput(prev => ({
                                ...prev,
                                agree: {
                                  privacy: checked,
                                  communityPolicy: checked,
                                  marketing: checked,
                                  over14: checked,
                                },
                              }));
                            }}
                            className={styles.circleRadio}
                          />
                          <span className={styles.agreeAllText}>전체동의합니다.</span>

                        </label>
                        <div className={`${styles.agreeSubDesc} day_span`} >
                          선택항목에 동의하지 않은 경우도 회원가입이 가능합니다.
                        </div>
                      </div>

                      {/* 개인정보 수집/이용 동의 */}
                      <div className={styles.agreeRow}>
                        <label className={styles.circleLabel}>
                          <input
                            type="checkbox"
                            checked={fanInput.agree.privacy}
                            onChange={e =>
                              setFanInput(prev => ({
                                ...prev,
                                agree: { ...prev.agree, privacy: e.target.checked },
                              }))
                            }
                            className={styles.circleRadio}
                            required
                          />
                          개인정보 수집/이용 동의 <span className={styles.red_star}>(필수)</span>
                        </label>
                      </div>

                      {/* 커뮤니티 운영 정책 동의 */}
                      <div className={styles.agreeRow}>
                        <label className={styles.circleLabel}>
                          <input
                            type="checkbox"
                            checked={fanInput.agree.communityPolicy}
                            onChange={e =>
                              setFanInput(prev => ({
                                ...prev,
                                agree: { ...prev.agree, communityPolicy: e.target.checked },
                              }))
                            }
                            className={styles.circleRadio}
                            required
                          />
                          {/* 아티스트 */} 콘텐츠 업로드 및 저작권 책임 동의 <span className={styles.red_star}>(필수)</span>
                        </label>
                        <div className={`${styles.agreeSubDesc} day_span`}
                       >
                          업로드하는 콘텐츠에 대한 저작권 및 운영 책임이 기획사에 있음을 확인하고 동의합니다.
                        </div>
                      </div>

                      {/* 광고 및 정보 수신 동의 (선택) */}
                      <div className={styles.agreeRow}>
                        <label className={styles.circleLabel}>
                          <input
                            type="checkbox"
                            checked={!!fanInput.agree.marketing}
                            onChange={e =>
                              setFanInput(prev => ({
                                ...prev,
                                agree: { ...prev.agree, marketing: e.target.checked },
                              }))
                            }
                            className={styles.circleRadio}
                          />
                          운영 리포트 수신 동의 <span className={styles.red_star}>(필수)</span>
                        </label>
                        <div className={`${styles.agreeSubDesc} day_span`}>
                          월간 팬 활동 리포트, 콘텐츠 조회수 통계 등을 이메일로 수신하겠습니다.
                        </div>
                      </div>

                      {/* 만 14세 이상 동의 */}
                      <div className={styles.agreeRow}>
                        <label className={styles.circleLabel}>
                          <input
                            type="checkbox"
                            checked={fanInput.agree.over14}
                            onChange={e =>
                              setFanInput(prev => ({
                                ...prev,
                                agree: { ...prev.agree, over14: e.target.checked },
                              }))
                            }
                            className={styles.circleRadio}
                            required
                          />
                          본인은 만 14세 이상입니다<span className={styles.red_star}>(필수)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </form>
            <button className={styles.joinBtn} type="submit">회원가입완료하기</button>
          </div>

        </div>

      </div>
    </Container>
  );
};

export default Join;