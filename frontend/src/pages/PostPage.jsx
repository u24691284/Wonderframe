import Navigation from "../components/Navigation";
import Post from "../components/Post";
import SearchInput from "../components/SearchInput";

function PostPage() {
    return (
        <>
            <Navigation />
            <SearchInput />

            <main>
                <Post />
            </main>
        </>
    );
}

export default PostPage;