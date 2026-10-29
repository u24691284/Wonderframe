
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profileImage from "../assets/profile.png";

function Comments({ comments, postId }) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    const [commentList, setCommentList] = useState(comments || []);
    const [users, setUsers] = useState([]);
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Keep comments updated when the post changes
    useEffect(() => {
        setCommentList(comments || []);
    }, [comments, postId]);

    // Load users to display comment authors
    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await fetch(
                    "http://localhost:3000/users"
                );

                if (!response.ok) {
                    throw new Error("Failed to load users");
                }

                const data = await response.json();
                setUsers(data);

            } catch (error) {
                console.error("Error loading comment users:", error);
            }
        }

        loadUsers();
    }, []);

    // Add a comment
    async function handleSubmit(event) {
        event.preventDefault();

        if (!text.trim() || isSubmitting) return;

        if (!loggedInUser?.id) {
            setMessage("Please log in to comment.");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const response = await fetch(
                `http://localhost:3000/posts/${postId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: loggedInUser.id,
                        text: text.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to add comment."
                );
                return;
            }

            setCommentList((previous) => [
                ...previous,
                data.comment
            ]);

            setText("");
            setMessage("");

        } catch (error) {
            console.error("Error adding comment:", error);
            setMessage("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function getCommentUser(comment) {
        return users.find(
            (user) =>
                String(user._id) === String(comment.userId)
        );
    }

    return (
        <section className="space-y-6 font-body">

            {/* COMMENT COUNT */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    Join the conversation
                </p>

                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-600">
                    {commentList.length} Comments
                </span>
            </div>

            {/* COMMENT LIST */}
            <div className="space-y-4">

                {commentList.length === 0 && (
                    <div className="rounded-xl bg-slate-50 px-5 py-8 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            No comments yet.
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Be the first to share your thoughts!
                        </p>
                    </div>
                )}

                {commentList.map((comment, index) => {
                    const commentUser = getCommentUser(comment);

                    return (
                        <article
                            key={comment._id || index}
                            className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                        >

                            {/* PROFILE PICTURE */}
                            {commentUser ? (
                                <Link
                                    to={`/profile/${commentUser._id}`}
                                    className="shrink-0"
                                >
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="h-10 w-10 rounded-full border-2 border-brand-100 object-cover"
                                    />
                                </Link>
                            ) : (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="h-10 w-10 shrink-0 rounded-full border-2 border-brand-100 object-cover"
                                />
                            )}

                            {/* COMMENT CONTENT */}
                            <div className="min-w-0 flex-1">

                                {commentUser ? (
                                    <Link
                                        to={`/profile/${commentUser._id}`}
                                        className="text-sm font-bold text-slate-800 transition hover:text-brand-600"
                                    >
                                        {commentUser.fullName}
                                    </Link>
                                ) : (
                                    <h4 className="text-sm font-bold text-slate-800">
                                        User
                                    </h4>
                                )}

                                {commentUser && (
                                    <p className="mt-0.5 text-xs text-brand-600">
                                        @{commentUser.username}
                                    </p>
                                )}

                                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                                    {comment.text}
                                </p>

                            </div>
                        </article>
                    );
                })}
            </div>

            {/* WRITE COMMENT */}
            <form
                onSubmit={handleSubmit}
                className="space-y-4 border-t border-slate-100 pt-6"
            >
                <label
                    htmlFor={`comment-${postId}`}
                    className="block text-sm font-semibold text-slate-700"
                >
                    Write a Comment
                </label>

                <textarea
                    id={`comment-${postId}`}
                    name="comment"
                    value={text}
                    onChange={(event) =>
                        setText(event.target.value)
                    }
                    placeholder="Share your thoughts about this travel memory..."
                    rows="3"
                    required
                    className="w-full resize-none rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />

                <button
                    type="submit"
                    disabled={isSubmitting || !text.trim()}
                    className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
            </form>

            {/* ERROR MESSAGE */}
            {message && (
                <p
                    role="status"
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                    {message}
                </p>
            )}

        </section>
    );
}

export default Comments;
