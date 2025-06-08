import Header from "./Header";
import Footer from "./Footer";
import "../App.css";

const Container = ({children} : {children : React.ReactNode}) => {
    return (
        <div className="container">
            <Header />
             <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Container;