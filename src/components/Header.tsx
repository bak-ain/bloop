import Nav from "./Nav";
import { NavLink, useNavigate } from "react-router-dom"
import styles from './Header.module.css';
const Header = () => {
    return (
        <header className={`${styles.header} inner`}>

            <h1>
                <NavLink to="/" className={styles.logo}>
                    <img src="/images/logo.png" alt="Logo" />
                </NavLink>
            </h1>
            <Nav />
        </header>
    )
}

export default Header;