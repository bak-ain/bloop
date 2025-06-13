import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import TabBar from "./TabBar";
import styles from './Header.module.css';
import "../App.css";

const Container = ({ children }: { children: React.ReactNode }) => {
    const [showBlur, setShowBlur] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            // 스크롤이 0보다 크면 blur 보이게
            setShowBlur(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div className="container">
            <div className={styles.blur} style={{ display: showBlur ? "block" : "none" }} />
            <Header />
            <main>
                {children}
            </main>
            <Footer />
            <TabBar />
        </div>
    )
}

export default Container;