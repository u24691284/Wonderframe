
import { useState } from "react";
import { Link } from "react-router-dom";
import PostPreview from "./PostPreview";

function Feed({ posts = [], albums = [], currentUserId, friendIds = [] }) {
    const [feedType, setFeedType] = useState("local");
    const [revealedPosts, setRevealedPosts] = useState([]);

    // check if a user is the current user or a friend
    const isLocalUser = (userId) =>
        String(userId) === String(currentUserId) ||
        friendIds.some(
            (friendId) => String(friendId) === String(userId)
        );

    // filter posts and albums for the selected feed
    const visiblePosts = feedType === "local"
        ? posts.filter((post) => isLocalUser(post.userId))
        : posts;

    const visibleAlbums = feedType === "local"
        ? albums.filter((album) => isLocalUser(album.userId))
        : albums;

    //combine posts and album activities
    const activities = [
        ...visiblePosts.map((post) => ({
            type: "post",
            date: post.createdAt,
            post
        })),

        ...visibleAlbums.flatMap((album) => [
            {
                type: "album_created",
                date: album.createdAt,
                album
            },

            ...(album.activities || [])
                .filter((activity) => activity.type === "post_added")
                .map((activity) => ({
                    type: "post_added",
                    date: activity.createdAt,
                    album,
                    postId: activity.postId
                }))
        ])
    ].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    // hide posts after 3 reports
    function isHidden(post) {
        return (
            (post.reports?.length || 0) >= 3 &&
            !revealedPosts.includes(String(post._id))
        );
    }

    // allow users to reveal reported posts
    function revealPost(postId) {
        setRevealedPosts((previous) => [
            ...previous,
            String(postId)
        ]);
    }

    return (
        <section className="space-y-6">

            {/* feed headings + tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="font-display text-2xl font-bold text-slate-800">
                        {feedType === "local"
                            ? "Your Feed"
                            : "Explore Posts"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {feedType === "local"
                            ? "Activity from you and your friends"
                            : "Activity from the entire WonderFrame community"}
                    </p>
                </div>

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

            {/* ACTIVITY COUNT */}
            <div className="border-b border-slate-200 pb-3">
                <p className="text-sm font-medium text-slate-500">
                    {activities.length}{" "}
                    {activities.length === 1
                        ? "activity"
                        : "activities"}
                </p>
            </div>

            {/* FEED CONTENT */}
            {activities.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

                    <h3 className="text-lg font-semibold text-slate-800">
                        No activity to show
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        {feedType === "local"
                            ? "Share a travel memory or connect with friends."
                            : "No travel memories have been shared yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">

                    {activities.map((activity, index) => {

                        // regular posts
                        if (activity.type === "post") {
                            const post = activity.post;

                            return isHidden(post) ? (
                                <div
                                    key={`post-${post._id}`}
                                    className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
                                >
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Post Hidden
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500">
                                        This post has been reported more than twice.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => revealPost(post._id)}
                                        className="mt-5 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                                    >
                                        View Post Anyway
                                    </button>
                                </div>
                            ) : (
                                <PostPreview
                                    key={`post-${post._id}`}
                                    post={post}
                                />
                            );
                        }

                        // ALBUM ACTIVITIES
                        const album = activity.album;

                        return (
                            <article
                                key={`${activity.type}-${album._id}-${index}`}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <p className="text-xs text-slate-400">
                                    {activity.date
                                        ? new Date(activity.date).toLocaleString()
                                        : ""}
                                </p>

                                <h3 className="mt-2 text-lg font-bold text-slate-800">
                                    {activity.type === "album_created"
                                        ? "New Album Created"
                                        : "Post Added to Album"}
                                </h3>

                                <p className="mt-2 text-sm text-slate-600">
                                    {activity.type === "album_created"
                                        ? `Album: ${album.name}`
                                        : `A new photo was added to ${album.name}`}
                                </p>

                                {activity.type === "post_added" ? (
                                    <Link
                                        to={`/post/${activity.postId}`}
                                        className="mt-4 inline-block text-sm font-semibold text-brand-600 transition hover:text-brand-500"
                                    >
                                        View Added Post →
                                    </Link>
                                ) : (
                                    <Link
                                        to={`/profile/${album.userId}?tab=albums`}
                                        className="mt-4 inline-block text-sm font-semibold text-brand-600 transition hover:text-brand-500"
                                    >
                                        View Album →
                                    </Link>
                                )}
                            </article>
                        );
                    })}

                </div>
            )}
        </section>
    );
}

export default Feed;
