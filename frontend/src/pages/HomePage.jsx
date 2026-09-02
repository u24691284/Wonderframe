import Navigation from "../components/Navigation";
import SearchInput from "../components/SearchInput";
import Feed from "../components/Feed";

function HomePage() {
    const posts = [
        {
            id: 1,
            name: "Tamima",
            username: "@tamima929",
            time: "2 hours ago",
            caption: "Sunset in Pretoria :)",
            hashtags: "#sunset #pretoria #photography"
        },
        {
            id: 2,
            name: "Layla",
            username: "@layla",
            time: "4 hours ago",
            caption: "Beautiful day!",
            hashtags: "#nature #photo"
        },
        {
            id: 3,
            name: "Kiara",
            username: "@kiara",
            time: "Yesterday",
            caption: "Weekend memories",
            hashtags: "#weekend #friends"
        }
    ];

    return (
        <>
            <Navigation />
            <SearchInput />

            <main>
                <Feed posts={posts} />
            </main>
        </>
    );
}

export default HomePage;