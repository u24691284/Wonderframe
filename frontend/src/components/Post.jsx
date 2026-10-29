
import { useState } from "react";
import { Link } from "react-router-dom";

import PostImage from "./PostImage";
import Comments from "./Comments";
import EditPost from "./EditPost";
import profileImage from "../assets/profile.png";

function Post({ post, user }) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    const [showReport, setShowReport] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportMessage, setReportMessage] = useState("");

    const isOwnPost =
        String(loggedInUser?.id) === String(post.userId);

    async function handleReport(event) {
        event.preventDefault();

        if (!reportReason.trim()) return;

        if (!loggedInUser?.id) {
            setReportMessage("Please log in to report this post.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/posts/${post._id}/report`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: loggedInUser.id,
                        reason: reportReason
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setReportMessage(
                    data.message || "Failed to report post."
                );
                return;
            }

            setReportMessage("Post reported successfully.");
            setReportReason("");
            setShowReport(false);

        } catch (error) {
            console.error("Error reporting post:", error);
            setReportMessage("Something went wrong.");
        }
    }

    return (
        <article className="font-body">

            {/* POST AUTHOR */}
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">

                <div className="flex items-center gap-4">

                    <img
                        src={profileImage}
                        alt="Profile"
                        className="h-12 w-12 rounded-full border-2 border-brand-100 object-cover"
                    />

                    <div>
                        {user ? (
                            <Link to={`/profile/${user._id}`}>
                                <h3 className="font-bold text-slate-800 transition hover:text-brand-600">
                                    {user.fullName}
                                </h3>
                            </Link>
                        ) : (
                            <h3 className="font-semibold text-slate-500">
                                Traveller
                            </h3>
                        )}

                        {user && (
                            <p className="text-sm text-brand-600">
                                @{user.username}
                            </p>
                        )}
                    </div>
                </div>

                {post.createdAt && (
                    <time
                        dateTime={post.createdAt}
                        className="text-xs text-slate-400"
                    >
                        {new Date(post.createdAt).toLocaleString()}
                    </time>
                )}
            </header>

            {/* POST IMAGE */}
            <div className="overflow-hidden bg-slate-100">
                <PostImage post={post} />
            </div>

            {/* CAPTION AND HASHTAGS */}
            <div className="space-y-3 px-6 py-5">

                <p className="text-base leading-7 text-slate-700">
                    {post.description}
                </p>

                {post.hashtags?.length > 0 && (
                    <p className="text-sm font-medium text-brand-600">
                        {Array.isArray(post.hashtags)
                            ? post.hashtags.join(" ")
                            : post.hashtags}
                    </p>
                )}

                {/* LIKES */}
                <div className="flex items-center gap-2 pt-2 text-sm font-medium text-slate-600">
                    <span className="text-xl text-brand-500">
                        ♡
                    </span>

                    <span>
                        {post.likes?.length || 0} likes
                    </span>
                </div>
            </div>

            {/* COMMENTS */}
            <section className="border-t border-slate-100 px-6 py-6">
                <h3 className="mb-5 text-lg font-bold text-slate-800">
                    Comments
                </h3>

                <Comments
                    comments={post.comments || []}
                    postId={post._id}
                />
            </section>

            {/* EDIT / DELETE OWN POST */}
            {isOwnPost && (
                <section className="border-t border-slate-100 bg-slate-50 p-6">
                    <EditPost post={post} />
                </section>
            )}

            {/* REPORT ANOTHER USER'S POST */}
            {!isOwnPost && (
                <section className="border-t border-slate-100 px-6 py-5">

                    <button
                        type="button"
                        onClick={() => {
                            setShowReport(!showReport);
                            setReportMessage("");
                        }}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                        {showReport ? "Cancel Report" : "Report Post"}
                    </button>

                    {showReport && (
                        <form
                            onSubmit={handleReport}
                            className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5"
                        >
                            <div>
                                <label
                                    htmlFor={`reportReason-${post._id}`}
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Reason for reporting
                                </label>

                                <textarea
                                    id={`reportReason-${post._id}`}
                                    name="reportReason"
                                    value={reportReason}
                                    onChange={(event) =>
                                        setReportReason(event.target.value)
                                    }
                                    placeholder="Explain why you're reporting this post..."
                                    rows="3"
                                    required
                                    className="w-full resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                                />
                            </div>

                            <button
                                type="submit"
                                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Submit Report
                            </button>
                        </form>
                    )}

                    {reportMessage && (
                        <p
                            role="status"
                            className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                                reportMessage === "Post reported successfully."
                                    ? "bg-brand-100 text-brand-600"
                                    : "bg-red-50 text-red-600"
                            }`}
                        >
                            {reportMessage}
                        </p>
                    )}
                </section>
            )}

        </article>
    );
}

export default Post;
