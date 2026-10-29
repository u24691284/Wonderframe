
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
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Save changes
    async function handleSubmit(event) {
        event.preventDefault();
        setIsSaving(true);
        setMessage("");

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
            setIsEditing(false);

            // Refresh to display the updated post
            window.location.reload();

        } catch (error) {
            console.error("Error updating post:", error);
            setMessage("Something went wrong.");
        } finally {
            setIsSaving(false);
        }
    }

    // Delete post
    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) return;

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

    const inputStyle =
        "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

    const labelStyle =
        "mb-2 block text-sm font-semibold text-slate-700";

    return (
        <section className="font-body">

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3">

                <button
                    type="button"
                    onClick={() => {
                        setIsEditing(!isEditing);
                        setMessage("");
                    }}
                    className="rounded-xl border-2 border-brand-500 px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-100"
                >
                    {isEditing ? "Cancel Editing" : "Edit Post"}
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                    Delete Post
                </button>

            </div>

            {/* EDIT FORM */}
            {isEditing && (
                <form
                    onSubmit={handleSubmit}
                    className="mt-5 space-y-5 rounded-xl border border-slate-200 bg-white p-5"
                >

                    <h3 className="text-lg font-bold text-slate-800">
                        Edit Post Details
                    </h3>

                    {/* CAPTION */}
                    <div>
                        <label
                            htmlFor={`caption-${post._id}`}
                            className={labelStyle}
                        >
                            Caption
                        </label>

                        <textarea
                            id={`caption-${post._id}`}
                            name="caption"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            rows="4"
                            required
                            className={`${inputStyle} resize-none`}
                        />
                    </div>

                    {/* HASHTAGS */}
                    <div>
                        <label
                            htmlFor={`hashtags-${post._id}`}
                            className={labelStyle}
                        >
                            Hashtags
                        </label>

                        <input
                            type="text"
                            id={`hashtags-${post._id}`}
                            name="hashtags"
                            value={hashtags}
                            onChange={(event) =>
                                setHashtags(event.target.value)
                            }
                            placeholder="#travel #memories"
                            className={inputStyle}
                        />

                        <p className="mt-2 text-xs text-slate-400">
                            Separate hashtags with spaces or commas.
                        </p>
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>

                </form>
            )}

            {/* STATUS MESSAGE */}
            {message && (
                <p
                    role="status"
                    className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                        message === "Post updated successfully!"
                            ? "bg-brand-100 text-brand-600"
                            : "bg-red-50 text-red-600"
                    }`}
                >
                    {message}
                </p>
            )}

        </section>
    );
}

export default EditPost;
