
import { useEffect, useState } from "react";

import Navigation from "../components/Navigation";
import SearchInput from "../components/SearchInput";
import Feed from "../components/Feed";

function HomePage() {
    const loggedInUser = JSON.parse(
        sessionStorage.getItem("user")
    );

    const [posts, setPosts] = useState([]);
    const [friendIds, setFriendIds] = useState([]);

    // load all posts
    useEffect(() => {
        async function loadPosts() {
            try {
                const response = await fetch(
                    "http://localhost:3000/posts"
                );

                if (!response.ok) {
                    throw new Error("Failed to load posts");
                }

                const data = await response.json();
                setPosts(data);

            } catch (error) {
                console.error("Error loading posts:", error);
            }
        }

        loadPosts();
    }, []);

    // load current user's friends
    useEffect(() => {
        async function loadCurrentUser() {
            try {
                if (!loggedInUser?.id) return;

                const response = await fetch(
                    `http://localhost:3000/users/${loggedInUser.id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load current user");
                }

                const data = await response.json();
                setFriendIds(data.friends || []);

            } catch (error) {
                console.error("Error loading current user:", error);
            }
        }

        loadCurrentUser();
    }, [loggedInUser?.id]);

    return (
        <div className="min-h-screen bg-slate-50 font-body">

            {/* navigation */}
            <Navigation />

            {/* main content */}
            <main className="min-w-0 px-4 py-8 md:ml-60 md:px-8">

                <div className="mx-auto w-full max-w-4xl space-y-8">

                    {/* page heading */}
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-800">
                            Feed
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Discover and share travel memories.
                        </p>
                    </div>

                    {/* search section */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-slate-800">
                            Explore WonderFrame
                        </h2>

                        <SearchInput />

                    </section>

                    {/* feed */}
                    <section>
                        <Feed
                            posts={posts}
                            currentUserId={loggedInUser?.id}
                            friendIds={friendIds}
                        />
                    </section>

                </div>
            </main>
        </div>
    );
}

export default HomePage;
