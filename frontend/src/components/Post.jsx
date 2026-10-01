import { useState } from "react";

import PostImage from "./PostImage";
import Comments from "./Comments";
import EditPost from "./EditPost";

function Post({ post, user }) {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    const [showReport, setShowReport] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportMessage, setReportMessage] = useState("");

    const isOwnPost =
        String(loggedInUser?.id) === String(post.userId);


    async function handleReport(event) {
        event.preventDefault();

        if (!reportReason.trim()) {
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
        <article>

            <header>
                {user && (
                    <>
                        <h3>{user.fullName}</h3>
                        <p>@{user.username}</p>
                    </>
                )}

                <time>
                    {new Date(post.createdAt).toLocaleString()}
                </time>
            </header>


            <PostImage post={post} />


            <p>{post.description}</p>


            <p>
                {Array.isArray(post.hashtags)
                    ? post.hashtags.join(" ")
                    : post.hashtags}
            </p>


            <p>
                {post.likes?.length || 0} likes
            </p>


            <Comments
                comments={post.comments || []}
                postId={post._id}
            />


            {/* Edit/Delete only appears on your own post */}
            {isOwnPost && (
                <EditPost post={post} />
            )}


            {/* Report only appears on someone else's post */}
            {!isOwnPost && (
                <section>

                    <button
                        type="button"
                        onClick={() =>
                            setShowReport(!showReport)
                        }
                    >
                        Report Post
                    </button>


                    {showReport && (
                        <form onSubmit={handleReport}>

                            <label htmlFor="reportReason">
                                Reason for reporting:
                            </label>

                            <br />

                            <textarea
                                id="reportReason"
                                name="reportReason"
                                value={reportReason}
                                onChange={(event) =>
                                    setReportReason(
                                        event.target.value
                                    )
                                }
                                required
                            />

                            <br />

                            <button type="submit">
                                Submit Report
                            </button>

                        </form>
                    )}


                    {reportMessage && (
                        <p>{reportMessage}</p>
                    )}

                </section>
            )}

        </article>
    );
}

export default Post;