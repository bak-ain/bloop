import { NavLink } from "react-router-dom"
import styles from './Header.module.css';
const Nav = () => {
    return (
        <nav className={styles.nav}>
            <ul className={styles.menu}>
                <li>
                    <NavLink to="/official" className={({ isActive }) => (isActive ? styles.active : '')}>
                        OFFICIAL
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/muse" className={({ isActive }) => (isActive ? styles.active : '')}>
                        MUSE
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/loop" className={({ isActive }) => (isActive ? styles.active : '')}>
                        LOOP
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mybox" className={({ isActive }) => (isActive ? styles.active : '')}>
                        MY BOX
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : '')}>
                        <div></div>
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Nav;