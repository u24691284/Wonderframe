import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditPost({ post }) {
    const navigate = useNavigate();

    const [description, setDescription] = useState(
        post.description || ""
    );

    const [hashtags, setHashtags] = useState(
        Array.isArray(post.hashtags)
            ? post.hashtags.join(" ")
            : post.hashtags || ""
    );

    const [message, setMessage] = useState("");


    // Save changes
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const hashtagArray = hashtags
                .split(/[\s,]+/)
                .filter((tag) => tag.trim() !== "")
                .map((tag) =>
                    tag.startsWith("#") ? tag : `#${tag}`
                );


            const response = await fetch(
                `http://localhost:3000/posts/${post._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        image: post.image,
                        description: description,
                        hashtags: hashtagArray
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {
                setMessage(data.message || "Failed to update post.");
                return;
            }


            setMessage("Post updated successfully!");

        } catch (error) {
            console.error("Error updating post:", error);
            setMessage("Something went wrong.");
        }
    }


    // Delete post
    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) {
            return;
        }


        try {
            const response = await fetch(
                `http://localhost:3000/posts/${post._id}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if (!response.ok) {
                setMessage(data.message || "Failed to delete post.");
                return;
            }


            navigate("/home");

        } catch (error) {
            console.error("Error deleting post:", error);
            setMessage("Something went wrong.");
        }
    }


    return (
        <section>

            <h2>Edit Post</h2>


            <form onSubmit={handleSubmit}>

                <label htmlFor="caption">
                    Caption
                </label>

                <br />

                <textarea
                    id="caption"
                    name="caption"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    required
                />

                <br />


                <label htmlFor="hashtags">
                    Hashtags
                </label>

                <br />

                <input
                    type="text"
                    id="hashtags"
                    name="hashtags"
                    value={hashtags}
                    onChange={(event) =>
                        setHashtags(event.target.value)
                    }
                />

                <br />


                <button type="submit">
                    Save Changes
                </button>

            </form>


            <button
                type="button"
                onClick={handleDelete}
            >
                Delete Post
            </button>


            {message && (
                <p>{message}</p>
            )}

        </section>
    );
}

export default EditPost;