import { NavLink, useNavigate } from "react-router-dom";
import styles from './Header.module.css';
import { useUserContext } from "../context/UserContext ";

const TabBar = () => {
    const { user } = useUserContext();
    const isLogin = !!user;
    const navigate = useNavigate();

    const handleProtectedClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!isLogin) {
            e.preventDefault();
            alert('회원 이용 서비스 입니다.');
            navigate('/login');
        }
    };

    return (
        <nav className={`${styles.tabBar} tabBar inner`}>
            <NavLink to="/" className={`${styles.tabItem} ${styles.tabHome}`}>
                {({ isActive }) => (
                    <>
                        <img
                            src={isActive ? "/images/icon/home2.png" : "/images/icon/home.png"}
                            alt="HOME"
                        />
                        <span>HOME</span>
                    </>
                )}
            </NavLink>
            <NavLink to="/official" className={styles.tabItem}>
                {({ isActive }) => (
                    <>
                        <img
                            src={isActive ? "/images/icon/official2.png" : "/images/icon/official.png"}
                            alt="OFFICIAL"
                        />
                        <span>OFFICIAL</span>
                    </>
                )}
            </NavLink>
            <NavLink
                to="/muse"
                className={`${styles.tabItem} ${styles.tabMuse}`}
                onClick={handleProtectedClick}
            >
                {({ isActive }) => (
                    <>
                        <img
                            src={isActive ? "/images/icon/muse2.png" : "/images/icon/muse.png"}
                            alt="MUSE"
                        />
                        <span>MUSE</span>
                    </>
                )}
            </NavLink>
            <NavLink
                to="/loop"
                className={styles.tabItem}
                onClick={handleProtectedClick}
            >
                {({ isActive }) => (
                    <>
                        <img
                            src={isActive ? "/images/icon/loop2.png" : "/images/icon/loop.png"}
                            alt="LOOP"
                        />
                        <span>LOOP</span>
                    </>
                )}
            </NavLink>
            <NavLink
                to="/mybox"
                className={styles.tabItem}
                onClick={handleProtectedClick}
            >
                {({ isActive }) => (
                    <>
                        <img
                            src={isActive ? "/images/icon/mybox2.png" : "/images/icon/mybox.png"}
                            alt="MY BOX"
                        />
                        <span>MY BOX</span>
                    </>
                )}
            </NavLink>
        </nav>
    );
};

export default TabBar;