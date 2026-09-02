import Navigation from "../components/Navigation";
import Feed from "../components/Feed";
import SearchInput from "../components/SearchInput";


function HomePage() {
    return (
        <>
            <Navigation />
            <SearchInput />

            <main>
                <Feed />
            </main>
        </>
    );
}

export default HomePage;