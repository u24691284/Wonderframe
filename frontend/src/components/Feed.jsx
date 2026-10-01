import { useState } from "react";
import PostPreview from "./PostPreview";

function Feed({ posts, currentUserId, friendIds = [] }) {
    const [feedType, setFeedType] = useState("local");

    const localPosts = posts.filter((post) => {
        const postUserId = String(post.userId);
        const loggedInUserId = String(currentUserId);

        const isMyPost =
            postUserId === loggedInUserId;

        const isFriendPost =
            friendIds.some(
                (friendId) =>
                    String(friendId) === postUserId
            );

        return isMyPost || isFriendPost;
    });

    const visiblePosts =
        feedType === "local"
            ? localPosts
            : posts;

    return (
        <section>

            <h2>
                {feedType === "local"
                    ? "Posts from you and your friends"
                    : "Global Posts"}
            </h2>

            <button
                type="button"
                onClick={() => setFeedType("local")}
            >
                Local
            </button>

            <button
                type="button"
                onClick={() => setFeedType("global")}
            >
                Global
            </button>

            {visiblePosts.length === 0 && (
                <p>No posts to show.</p>
            )}

            {visiblePosts.map((post) => (
                <PostPreview
                    key={post._id}
                    post={post}
                />
            ))}

        </section>
    );
}

export default Feed;