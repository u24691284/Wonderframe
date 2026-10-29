
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
                setPost(null);
                setUser(null);

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
                if (!post?.userId) return;

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

    return (
        <div className="min-h-screen bg-slate-50 font-body">

            {/* NAVIGATION */}
            <Navigation />

            {/* MAIN CONTENT */}
            <main className="min-w-0 px-4 py-8 md:ml-60 md:px-8">

                <div className="mx-auto w-full max-w-4xl space-y-6">

                    {/* SEARCH */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-3 text-lg font-semibold text-slate-800">
                            Explore WonderFrame
                        </h2>

                        <SearchInput />
                    </section>

                    {/* PAGE HEADING */}
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-800">
                            Travel Memory
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Explore a shared moment on WonderFrame.
                        </p>
                    </div>

                    {/* POST */}
                    {post ? (
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <Post
                                post={post}
                                user={user}
                            />
                        </section>
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <p className="text-sm text-slate-500">
                                Loading post...
                            </p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default PostPage;
