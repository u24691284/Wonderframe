import { useEffect, useState } from "react";

import Navigation from "../components/Navigation";
import SearchInput from "../components/SearchInput";
import Feed from "../components/Feed";

function HomePage() {
    const loggedInUser = JSON.parse(
        localStorage.getItem("user")
    );

    const [posts, setPosts] = useState([]);
    const [friendIds, setFriendIds] = useState([]);

    // Load all posts
    useEffect(() => {
        async function loadPosts() {
            try {
                const response = await fetch(
                    "http://localhost:3000/posts"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load posts"
                    );
                }

                const data = await response.json();

                setPosts(data);

            } catch (error) {
                console.error(
                    "Error loading posts:",
                    error
                );
            }
        }

        loadPosts();
    }, []);


    // Load logged-in user's current friend list
    useEffect(() => {
        async function loadCurrentUser() {
            try {
                if (!loggedInUser?.id) {
                    return;
                }

                const response = await fetch(
                    `http://localhost:3000/users/${loggedInUser.id}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load current user"
                    );
                }

                const data = await response.json();

                setFriendIds(data.friends || []);

            } catch (error) {
                console.error(
                    "Error loading current user:",
                    error
                );
            }
        }

        loadCurrentUser();
    }, []);


    return (
        <>
            <Navigation />
            <SearchInput />

            <main>
                <Feed
                    posts={posts}
                    currentUserId={loggedInUser?.id}
                    friendIds={friendIds}
                />
            </main>
        </>
    );
}

export default HomePage;