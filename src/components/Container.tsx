import Header from "./Header";
import "../App.css";

const Container = ({children} : {children : React.ReactNode}) => {
    return (
        <div>
            <Header />
             <main>
                {children}
            </main>
        </div>
    )
}

export default Container;