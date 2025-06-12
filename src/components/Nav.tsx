import { NavLink, useNavigate } from "react-router-dom"
import styles from './Header.module.css';
import React from 'react';
import { useUserContext } from '../context/UserContext ';

const Nav = () => {
    const { user, setUser } = useUserContext();
    const isLogin = !!user;
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        alert('로그아웃 되었습니다');
        navigate('/');
    };

    // 비회원 보호 라우팅
    const handleProtectedClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!isLogin) {
            e.preventDefault();
            alert('회원 이용 서비스 입니다.');
            navigate('/login');
        }
    };

    return (
        <nav className={styles.nav}>
            <ul className={styles.menu}>
                <li>
                    <NavLink to="/official" className={({ isActive }) => (isActive ? styles.active : '')}>
                        OFFICIAL
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/muse"
                        className={({ isActive }) => (isActive ? styles.active : '')}
                        onClick={handleProtectedClick}
                    >
                        MUSE
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/loop"
                        className={({ isActive }) => (isActive ? styles.active : '')}
                        onClick={handleProtectedClick}
                    >
                        LOOP
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/mybox"
                        className={({ isActive }) => (isActive ? styles.active : '')}
                        onClick={handleProtectedClick}
                    >
                        MY BOX
                    </NavLink>
                </li>
                <li className={styles.login}>
                    {isLogin ? (
                        <button className={styles.loginBtn} onClick={handleLogout}>
                            <span className={styles.btnText}>LOGOUT</span>
                            <div className={`${styles.loginIcon} ${styles.logoutIcon}`}></div>
                        </button>
                    ) : (
                        <NavLink to="/login" className={styles.loginBtn}>
                            <div className={styles.loginIcon}></div>
                            <span className={styles.btnText}>LOGIN</span>
                        </NavLink>
                    )}
                </li>
            </ul>
        </nav>
    )
}

export default Nav;