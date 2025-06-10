import Container from "../components/Container";
import styles from "./Home.module.css"

const Home = () => {
    return (
        <div>
           <Container>
            <div className={styles.mainBanner} />
            <div className={styles.mainContent}>
                <h1>Welcome to Our Website</h1>
                <p>This is the home page where you can find the latest updates and information.</p> 
                </div>
           </Container>
        </div>
    )
}

export default Home;