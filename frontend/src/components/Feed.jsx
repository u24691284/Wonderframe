
import { useState } from "react";
import PostPreview from "./PostPreview";

function Feed({ posts, currentUserId, friendIds = [] }) {
    const [feedType, setFeedType] = useState("local");

    // filter posts from the current user and friends
    const localPosts = posts.filter((post) => {
        const postUserId = String(post.userId);
        const loggedInUserId = String(currentUserId);

        const isMyPost = postUserId === loggedInUserId;

        const isFriendPost = friendIds.some(
            (friendId) => String(friendId) === postUserId
        );

        return isMyPost || isFriendPost;
    });

    // choose which posts to display
    const visiblePosts =
        feedType === "local" ? localPosts : posts;

    return (
        <section className="space-y-6">

            {/* feed heading and tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4">

                <div>
                    <h2 className="font-display text-2xl font-bold text-slate-800">
                        {feedType === "local" ? "Your Feed" : "Explore Posts"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {feedType === "local"
                            ? "Posts from you and your friends"
                            : "Posts from the entire WonderFrame community"}
                    </p>
                </div>

                {/* feed selection */}
                <div className="flex rounded-xl border border-brand-100 bg-brand-100 p-1">

                    <button
                        type="button"
                        onClick={() => setFeedType("local")}
                        aria-pressed={feedType === "local"}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                            feedType === "local"
                                ? "bg-brand-500 text-white shadow-sm"
                                : "text-brand-600 hover:bg-white"
                        }`}
                    >
                        Local Feed
                    </button>

                    <button
                        type="button"
                        onClick={() => setFeedType("global")}
                        aria-pressed={feedType === "global"}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                            feedType === "global"
                                ? "bg-brand-500 text-white shadow-sm"
                                : "text-brand-600 hover:bg-white"
                        }`}
                    >
                        Global Feed
                    </button>

                </div>
            </div>

            {/* post count */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p className="text-sm font-medium text-slate-500">
                    {visiblePosts.length}{" "}
                    {visiblePosts.length === 1 ? "post" : "posts"}
                </p>
            </div>

            {/* posts */}
            {visiblePosts.length === 0 ? (

                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-brand-600"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                        </svg>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-slate-800">
                        No posts to show
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        {feedType === "local"
                            ? "Your feed is empty. Share a travel memory or connect with friends to see their posts here."
                            : "No travel memories have been shared yet. Be the first to post!"}
                    </p>

                </div>

            ) : (

                <div className="space-y-6">
                    {visiblePosts.map((post) => (
                        <PostPreview
                            key={post._id}
                            post={post}
                        />
                    ))}
                </div>

            )}

        </section>
    );
}

export default Feed;
