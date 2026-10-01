import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navigation from "../components/Navigation";
import SearchInput from "../components/SearchInput";
import Post from "../components/Post";

function PostPage() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);


    // Load the post
    useEffect(() => {
        async function loadPost() {
            try {
                const response = await fetch(
                    `http://localhost:3000/posts/${id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load post");
                }

                const data = await response.json();

                setPost(data);

            } catch (error) {
                console.error("Error loading post:", error);
            }
        }

        loadPost();

    }, [id]);


    // Load the user who created the post
    useEffect(() => {
        async function loadUser() {
            try {
                if (!post?.userId) {
                    return;
                }

                const response = await fetch(
                    `http://localhost:3000/users/${post.userId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load post user");
                }

                const data = await response.json();

                setUser(data);

            } catch (error) {
                console.error("Error loading post user:", error);
            }
        }

        loadUser();

    }, [post]);


    if (!post) {
        return (
            <>
                <Navigation />
                <p>Loading post...</p>
            </>
        );
    }


    return (
        <>
            <Navigation />
            <SearchInput />

            <main>
                <Post
                    post={post}
                    user={user}
                />
            </main>
        </>
    );
}

export default PostPage;