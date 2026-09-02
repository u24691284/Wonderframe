import Navigation from "../components/Navigation";
import SearchInput from "../components/SearchInput";
import Post from "../components/Post";

function PostPage() {
    const post = {
        id: 1,
        name: "Tamima",
        username: "@tamima929",
        time: "2 hours ago",
        caption: "Sunset in Pretoria :)",
        hashtags: "#sunset #pretoria #photography",
        likes: 124,

        comments: [
            {
                id: 1,
                name: "Layla",
                text: "So pretty!"
            },
            {
                id: 2,
                name: "Kiara",
                text: "Love this!"
            }
        ]
    };

    return (
        <>
            <Navigation />
            <SearchInput />

            <main>
                <Post post={post} />
            </main>
        </>
    );
}

export default PostPage;