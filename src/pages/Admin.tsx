import styles from './Admin.module.css';

const Admin = () => {
    return (
        <div className={`${styles.wrap}`}>
            <header className={`${styles.ad_header}`}>
                <div>
                    <h1 >
                        <a href="/">
                            <img src="이미지주소.jpg" alt="설명 텍스트" className="logo" />
                        </a>
                    </h1>
                    <nav className={`${styles.gnb}`}>
                        <p>General</p>
                        <ul>
                            <li className={styles.on} ><a href="">대시보드</a></li>
                            <li><a href="">일정관리</a></li>
                            <li><a href="">컨텐츠관리</a></li>
                            <li><a href="">계정관리</a></li>
                        </ul>
                    </nav>
                </div>
                <h2>로그아웃</h2>
            </header>
            <div className={`${styles.contents}`}>
                <div className={`${styles.top}`}>
                    <h2>Setting</h2>
                    <div className={`${styles.con1}`}>

                        <div className={`${styles.box} ${styles.profile_box}`}>
                            <div className={`${styles.top}`}>
                                <h3>메인 비주얼</h3>
                                <button type="button"
                                    className={`${styles.edit_btn}`}>
                                    편집
                                </button>
                            </div>
                            <div className={`${styles.bottom}`}>

                                <ul className={styles.profileScroll}>
                                    <li>
                                        <p>프로필</p>
                                        <ul>
                                            <li><img src="../images/dash/doa.jpg" alt="도아" />
                                                <span>DOA(도아)</span></li>
                                            <li>
                                                <img src="../images/dash/arin.jpg" alt="아린" />
                                                <span>ARIN(아린)</span>
                                            </li>
                                            <li>
                                                <img src="../images/dash/sei.jpg" alt="세이" />
                                                <span>SEI(세이)</span>
                                            </li>
                                            <li>
                                                <img src="../images/dash/luha.jpg" alt="루하" />
                                                <span>LUHA(루하)</span>
                                            </li>
                                        </ul>

                                    </li>
                                    <li>
                                        <p>메인이미지</p>
                                        <img src="../images/dash/main.jpg" alt="메인이미지" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={`${styles.box} ${styles.color_box}`}>
                            <div className={`${styles.top}`}>
                                <h3>색상 및 로고</h3>
                                <button type="button"
                                    className={`${styles.edit_btn}`}>
                                    편집
                                </button>
                            </div>
                            <ul className={`${styles.bottom}`}>
                                <li>
                                    <p>로고</p>
                                    <img src="../images/dash/log.jpg" alt="logo" />
                                </li>
                                <li>
                                    <p>주요색상</p>
                                    <div className={`${styles.under}`}>
                                        <div className={`${styles.left}`}>

                                        </div>
                                        <div className={`${styles.right}`}>
                                            # CA2649
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <p>보조색상</p>
                                    <div className={`${styles.under}`}>
                                        <div className={`${styles.left}`}>

                                        </div>
                                        <div className={`${styles.right}`}>
                                            # 419DDF
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className={`${styles.box} ${styles.info_box}`}>
                            <div className={`${styles.pro}`}>
                                <div></div>
                                <h4>HIBIS</h4>
                                <p>NEONIVE엔터테인먼트</p>
                            </div>
                            <div className={`${styles.office}`}>
                                <ul>
                                    <li><p>관리자</p><span>정유찬</span></li>
                                    <li><p>아이디</p><span>NEONIVE</span></li>
                                    <li><p>이메일</p><span>NEONIVE@naver.com</span></li>
                                    <li><p>전화번호</p><span>010 0000 0000</span></li>
                                </ul>
                            </div>
                            <div className={`${styles.member}`}>
                                <ul>
                                    <li><p>아티스트</p><span>하이비스</span></li>
                                    <li><p>구성원</p><span>도아 / 아린 / 세이 / 루하</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.con2}`}></div>
                    <div className={`${styles.con3}`}></div>
                </div>

            </div>
        </div>
    )
}

export default Admin;