
import { useEffect, useState } from "react";

function EditAlbum({ album, onAlbumChanged }) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    const [name, setName] = useState(album.name || "");
    const [description, setDescription] = useState(
        album.description || ""
    );
    const [hashtags, setHashtags] = useState(
        Array.isArray(album.hashtags)
            ? album.hashtags.join(" ")
            : album.hashtags || ""
    );

    const [message, setMessage] = useState("");
    const [userPosts, setUserPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Load user's posts
    useEffect(() => {
        async function loadUserPosts() {
            try {
                const response = await fetch(
                    "http://localhost:3000/posts"
                );

                if (!response.ok) {
                    throw new Error("Failed to load posts");
                }

                const data = await response.json();

                setUserPosts(
                    data.filter(
                        (post) =>
                            String(post.userId) ===
                            String(loggedInUser?.id)
                    )
                );
            } catch (error) {
                console.error("Error loading user posts:", error);
            }
        }

        loadUserPosts();
    }, []);

    // Add post to album
    async function handleAddPost() {
        if (!selectedPostId) {
            setMessage("Please select a post.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/albums/${album._id}/posts`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        postId: selectedPostId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to add post.");
                return;
            }

            setMessage("Post added to album!");
            setSelectedPostId("");
            await onAlbumChanged();

        } catch (error) {
            console.error("Error adding post to album:", error);
            setMessage("Something went wrong.");
        }
    }

    // Edit album
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
                `http://localhost:3000/albums/${album._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        hashtags: hashtagArray
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to update album.");
                return;
            }

            setMessage("Album updated successfully!");
            setIsEditing(false);
            await onAlbumChanged();

        } catch (error) {
            console.error("Error updating album:", error);
            setMessage("Something went wrong.");
        }
    }

    // Delete album
    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this album?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:3000/albums/${album._id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to delete album.");
                return;
            }

            await onAlbumChanged();

        } catch (error) {
            console.error("Error deleting album:", error);
            setMessage("Something went wrong.");
        }
    }

    const inputStyle =
        "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

    const labelStyle =
        "mb-2 block text-sm font-semibold text-slate-700";

    return (
        <section className="space-y-5 font-body">

            {/* ADD POST TO ALBUM */}
            <div>
                <h4 className="mb-3 text-base font-semibold text-slate-800">
                    Add Post to Album
                </h4>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                        value={selectedPostId}
                        onChange={(event) =>
                            setSelectedPostId(event.target.value)
                        }
                        className={`${inputStyle} min-w-0 flex-1`}
                    >
                        <option value="">
                            Select one of your posts
                        </option>

                        {userPosts.map((post) => (
                            <option
                                key={post._id}
                                value={post._id}
                            >
                                {post.description}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={handleAddPost}
                        className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                    >
                        + Add Post
                    </button>
                </div>
            </div>

            {/* ALBUM ACTIONS */}
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">

                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="rounded-lg border-2 border-brand-500 px-5 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-100"
                >
                    {isEditing ? "Cancel Editing" : "Edit Album"}
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-lg border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                    Delete Album
                </button>
            </div>

            {/* EDIT ALBUM FORM */}
            {isEditing && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-xl border border-slate-200 bg-white p-5"
                >
                    <h4 className="text-lg font-semibold text-slate-800">
                        Edit Album Details
                    </h4>

                    <div>
                        <label
                            htmlFor={`name-${album._id}`}
                            className={labelStyle}
                        >
                            Album Name
                        </label>

                        <input
                            id={`name-${album._id}`}
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                            className={inputStyle}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor={`description-${album._id}`}
                            className={labelStyle}
                        >
                            Description
                        </label>

                        <textarea
                            id={`description-${album._id}`}
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            rows="3"
                            className={`${inputStyle} resize-none`}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor={`hashtags-${album._id}`}
                            className={labelStyle}
                        >
                            Hashtags
                        </label>

                        <input
                            id={`hashtags-${album._id}`}
                            type="text"
                            value={hashtags}
                            onChange={(event) =>
                                setHashtags(event.target.value)
                            }
                            placeholder="#travel #memories"
                            className={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600"
                    >
                        Save Changes
                    </button>
                </form>
            )}

            {/* STATUS MESSAGE */}
            {message && (
                <p
                    role="status"
                    className={`rounded-lg px-4 py-3 text-sm font-medium ${
                        message === "Post added to album!" ||
                        message === "Album updated successfully!"
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

export default EditAlbum;
