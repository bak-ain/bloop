import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`${styles.wrap} inner`}>
                <div className={styles.fLogo}><img src="/images/fLogo.png" alt="BLOOP"/></div>
                <ul className={styles.use}>
                    {[
                        { label: "이용약관", href: "#" },
                        { label: "서비스운영정책", href: "#" },
                        { label: "아동 및 청소년 보호정책", href: "#" },
                        { label: "개인정보처리방침", href: "#" },
                        { label: "입점 신청", href: "#" },
                        { label: "고객센터", href: "#" },
                    ].map((item, idx, arr) => (
                        <li
                            key={item.label}>
                            {/* 추후 페이지가 생기면 href에 실제 경로로 변경 */}
                            <a
                                href={item.href}
                                style={{
                                    color: "#fff",
                                    textDecoration: "none",
                                    fontWeight: 400,
                                }}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className={styles.info}>
                <div className={styles.infoTop}>
                    <p>
                        (주)블루프
                    </p>
                    <p>
                        대표 : 팬해조
                    </p>
                    <p>
                        사업자등록번호 : 010-10-01234
                    </p>
                    <p>
                        전화번호 : 1004-1004 (10:00 ~ 18:00)
                    </p>
                </div>
                <div className={styles.infoBottom}>
                    <p >
                        서울특별시 강남구 팬해조로 1004길, 8282호
                    </p>
                    <p >
                        통신판매업 신고번호 제 1004-팬해조-1004호
                    </p>
                </div>
                </div>
                <div className={styles.copy} >
                   <p> ©copyright BLOOP all rights reserved. </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;