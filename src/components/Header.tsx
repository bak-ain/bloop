import Nav from "./Nav";
import styles from './Header.module.css';
const Header = () => {
    return (
        <header className={`${styles.header} inner`}>
            <h1>
                <a href="/" className={styles.logo}>
                    <img src="/logo.png" alt="Logo" />
                </a>
            </h1>
            <Nav />
        </header>
    )
}

export default Header;