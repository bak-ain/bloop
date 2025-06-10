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
                            {/* <div className={`${styles.pro}`}>
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
                            </div> */}
                        </div>
                    </div>

                </div>
                <div className={`${styles.top}`}>
                    <h2>Analysis</h2>
                    <div className={`${styles.con2}`}>
                        <div className={styles.chart_area}>

                            <div className={styles.chart_left}>
                                <div className={styles.stat_cards}>
                                    <div className={styles.card}>
                                        <div className={styles.card_top}>
                                            <p>방문자수</p>
                                            <i className="icon-user" />
                                        </div>
                                        <h3>1,423명</h3>
                                        <div className={styles.card_bottom}>
                                            <span className={styles.blue}>🔵 12%</span>
                                        </div>
                                    </div>

                                    <div className={styles.card}>
                                        <div className={styles.card_top}>
                                            <p>게시물 수</p>
                                            <i className="icon-post" />
                                        </div>
                                        <h3>408명</h3>
                                        <div className={styles.card_bottom}>
                                            <span className={styles.red}>🔴 8%</span>
                                        </div>
                                    </div>

                                    <div className={styles.card}>
                                        <div className={styles.card_top}>
                                            <p>댓글 수</p>
                                            <i className="icon-comment" />
                                        </div>
                                        <h3>3,761명</h3>
                                        <div className={styles.card_bottom}>
                                            <span className={styles.blue}>🔵 38%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.under}>
                                    <div className={styles.chart}>
                                        <p>시간/기간별 활동량</p>
                                        <div className={styles.tab_header}>
                                            <button className={`${styles.tab_btn} ${styles.active}`}>7 days</button>
                                            <button className={styles.tab_btn}>30 days</button>
                                        </div>
                                        <div className={styles.chart_img}>
                                            <img src="../images/dash/chart.png" alt="7일 활동량 그래프" />
                                        </div>
                                    </div>
                                    <div className={styles.chart_bottom}>
                                        <p>등급별 가입 분포</p>
                                        <img src="../images/dash/donut.jpg" alt="등급 가입 도넛 그래프" />
                                        <div className={styles.rank_stats}>
                                            <div>
                                                <strong>3,450명</strong>
                                                <span className={styles.up}>12% ↑</span>
                                            </div>
                                            <div>
                                                <strong>2,820명</strong>
                                                <span className={styles.up}>10% ↑</span>
                                            </div>
                                            <div>
                                                <strong>5,690명</strong>
                                                <span className={styles.down}>18% ↓</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className={styles.chart_right}>
                                <div className={styles.content_header}>
                                    <h3>인기 콘텐츠 분석</h3>
                                    <div className={styles.tabs}>
                                        <button className={`${styles.tab} ${styles.active}`}>좋아요순</button>
                                        <button className={styles.tab}>저장순</button>
                                        <button className={styles.tab}>댓글순</button>
                                    </div>
                                </div>

                                <table className={styles.rank_table}>
                                    <thead>
                                        <tr>
                                            <th>순위</th>
                                            <th>카테고리</th>
                                            <th>제목</th>
                                            <th>날짜</th>
                                            <th>좋아요</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { rank: "01", type: "기획사", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950" },
                                            { rank: "02", type: "아티스트", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950" },
                                            { rank: "03", type: "아티스트", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950" },
                                            { rank: "04", type: "기획사", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950" },
                                            { rank: "05", type: "기획사", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950" },
                                        ].map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.rank}</td>
                                                <td>
                                                    <span className={`${styles.badge} ${item.type === "기획사" ? styles.green : styles.red}`}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td>{item.title}</td>
                                                <td>{item.date}</td>
                                                <td className={styles.likes}>{item.like}개 ➤</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.mobile_rank_list}>
                                {[
                                    { rank: "01", type: "기획사", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950" },
                                    { rank: "02", type: "아티스트", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950" },
                                    { rank: "03", type: "아티스트", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950" },
                                    { rank: "04", type: "기획사", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950" },
                                    { rank: "05", type: "기획사", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950" },
                                ].map((item, idx) => (
                                    <div className={styles.mobile_row} key={idx}>
                                        <div className={styles.rank}>{item.rank}</div>
                                        <div className={styles.content}>
                                            <p className={styles.title}>
                                                <strong>[ARIN]</strong> 뮤직뱅크 직캠 영상
                                            </p>
                                            <div className={styles.sub_info}>
                                                <span className={styles.date}>{item.date}</span>
                                                <span className={styles.likes}>❤️ {item.like}개</span>
                                            </div>
                                        </div>
                                        <div className={styles.arrow}>➤</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.top}`}>
                    <div className={styles.con3}>
                        <h2>Schedule</h2>
                        <div className={styles.schedule_body}>
                            <div className={styles.calendar_wrap}>
                                <div className={styles.calendar_header}>
                                    <div className={styles.month_nav}>
                                        <button>{'<'}</button>
                                        <span>5월</span>
                                        <button>{'>'}</button>
                                    </div>
                                    <button className={styles.edit_btn}>편집</button>
                                </div>
                                <div className={styles.calendar_img}>
                                    <img src="../images/dash/cal.jpg" alt="5월 달력" />
                                </div>
                            </div>
                            <div className={styles.detail_panel}>
                                <p>날짜를 선택해주세요.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.top}`}>
                    <div className={styles.con4}>
                        <h2>Content</h2>
                        <div className={styles.content_header}>
                            <div className={styles.tab_menu}>
                                <button className={styles.active}>전체</button>
                                <button>기획사</button>
                                <button>아티스트</button>
                            </div>
                            <div className={styles.action_buttons}>
                                <button>+ 게시물</button>
                                <button>편집</button>
                            </div>
                        </div>

                        <table className={styles.content_table}>
                            <thead>
                                <tr>
                                    <th className={styles.colType}>카테고리</th>
                                    <th className={styles.colRank}>순번</th>
                                    <th>제목</th>
                                    <th>날짜</th>
                                    <th>좋아요</th>
                                    <th>댓글</th>
                                    <th>저장</th>
                                    <th>이미지</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { rank: "01", type: "기획사", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950", comment: "10,950", save: "10,950", image: "300GB" },
                                    { rank: "02", type: "아티스트", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950", comment: "10,950", save: "10,950", image: "300GB" },
                                    { rank: "03", type: "아티스트", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950", comment: "10,950", save: "10,950", image: "300GB" },
                                    { rank: "04", type: "기획사", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950", comment: "10,950", save: "10,950", image: "300GB" },
                                    { rank: "05", type: "기획사", title: "[ARIN] 뮤직뱅크 직캠 영상", date: "09/06/2023", like: "10,950", comment: "10,950", save: "10,950", image: "300GB" },
                                ].map((item, idx) => (
                                    <tr key={idx}>
                                        <td className={styles.colType}>
                                            <span className={`${styles.badge} ${item.type === "기획사" ? styles.green : styles.red}`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className={styles.colRank}>{item.rank}</td>
                                        <td>{item.title}</td>
                                        <td>{item.date}</td>
                                        <td className={styles.likes}>{item.like}</td>
                                        <td>{item.comment}</td>
                                        <td>{item.save}</td>
                                        <td>{item.image}</td>
                                        <td>
                                            <button className={styles.icon_btn}>
                                                <img src="/icons/upload.svg" alt="업로드" />
                                            </button>
                                        </td>
                                        <td>
                                            <button className={styles.icon_btn}>
                                                <img src="/icons/view.svg" alt="보기" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                        <div className={styles.mobile_content_list}>
                            {[
                                {
                                    title: "[ARIN] 뮤직뱅크 직캠 영상",
                                    date: "09/06/2023",
                                    like: "10,950",
                                    comment: "10,950",
                                    save: "10,950",
                                    image: "300GB",
                                },
                                {
                                    title: "[ARIN] 뮤직뱅크 직캠 영상",
                                    date: "09/06/2023",
                                    like: "10,950",
                                    comment: "10,950",
                                    save: "10,950",
                                    image: "300GB",
                                },
                                {
                                    title: "[ARIN] 뮤직뱅크 직캠 영상",
                                    date: "09/06/2023",
                                    like: "10,950",
                                    comment: "10,950",
                                    save: "10,950",
                                    image: "300GB",
                                },
                                {
                                    title: "[ARIN] 뮤직뱅크 직캠 영상",
                                    date: "09/06/2023",
                                    like: "10,950",
                                    comment: "10,950",
                                    save: "10,950",
                                    image: "300GB",
                                },
                                {
                                    title: "[ARIN] 뮤직뱅크 직캠 영상",
                                    date: "09/06/2023",
                                    like: "10,950",
                                    comment: "10,950",
                                    save: "10,950",
                                    image: "300GB",
                                },
                            ].map((item, idx) => (
                                <div className={styles.mobile_content_item} key={idx}>
                                    <div className={styles.title}>{item.title}</div>
                                    <div className={styles.sub_info}>
                                        <span>{item.date}</span>
                                        <span className={styles.likes}>❤️ {item.like}개</span>
                                        <span>💬 {item.comment}</span>
                                        <span>🔖 {item.save}</span>
                                        <span>{item.image}</span>
                                    </div>
                                    <div className={styles.actions}>
                                        <button><img src="/icons/upload.svg" alt="업로드" /></button>
                                        <button><img src="/icons/view.svg" alt="보기" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>



                        <div className={styles.pagination}>
                            <button className={styles.active}>1</button>
                            <button >2</button>
                            <button>3</button>
                        </div>
                    </div>

                </div>

            </div>


        </div>

    )
}

export default Admin;