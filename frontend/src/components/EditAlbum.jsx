import { useEffect, useState } from "react";

function EditAlbum({ album, onAlbumChanged }) {
    const loggedInUser = JSON.parse(
        localStorage.getItem("user")
    );

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

    // Posts belonging to the logged-in user
    const [userPosts, setUserPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState("");


    // Load the logged-in user's posts
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

                const myPosts = data.filter(
                    (post) =>
                        String(post.userId) ===
                        String(loggedInUser?.id)
                );

                setUserPosts(myPosts);

            } catch (error) {
                console.error(
                    "Error loading user posts:",
                    error
                );
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
                setMessage(
                    data.message || "Failed to add post."
                );
                return;
            }

            setMessage("Post added to album!");
            setSelectedPostId("");

            // Update album immediately
            await onAlbumChanged();

        } catch (error) {
            console.error(
                "Error adding post to album:",
                error
            );

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
                    tag.startsWith("#")
                        ? tag
                        : `#${tag}`
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
                setMessage(
                    data.message ||
                    "Failed to update album."
                );
                return;
            }

            setMessage(
                "Album updated successfully!"
            );

            // Reload albums immediately
            await onAlbumChanged();

        } catch (error) {
            console.error(
                "Error updating album:",
                error
            );

            setMessage("Something went wrong.");
        }
    }


    // Delete album
    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this album?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/albums/${album._id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to delete album."
                );
                return;
            }

            // Reload albums immediately
            await onAlbumChanged();

        } catch (error) {
            console.error(
                "Error deleting album:",
                error
            );

            setMessage("Something went wrong.");
        }
    }


    return (
        <section>

            {/* ADD POST TO ALBUM */}
            <h4>Add Post to Album</h4>

            <select
                value={selectedPostId}
                onChange={(event) =>
                    setSelectedPostId(
                        event.target.value
                    )
                }
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
            >
                Add Post
            </button>


            {/* EDIT ALBUM */}
            <h4>Edit Album</h4>

            <form onSubmit={handleSubmit}>

                <label
                    htmlFor={`name-${album._id}`}
                >
                    Album Name:
                </label>

                <br />

                <input
                    id={`name-${album._id}`}
                    type="text"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    required
                />

                <br />

                <label
                    htmlFor={`description-${album._id}`}
                >
                    Description:
                </label>

                <br />

                <textarea
                    id={`description-${album._id}`}
                    value={description}
                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }
                />

                <br />

                <label
                    htmlFor={`hashtags-${album._id}`}
                >
                    Hashtags:
                </label>

                <br />

                <input
                    id={`hashtags-${album._id}`}
                    type="text"
                    value={hashtags}
                    onChange={(event) =>
                        setHashtags(
                            event.target.value
                        )
                    }
                />

                <br />

                <button type="submit">
                    Save Changes
                </button>

            </form>


            {/* DELETE ALBUM */}
            <button
                type="button"
                onClick={handleDelete}
            >
                Delete Album
            </button>


            {message && (
                <p>{message}</p>
            )}

        </section>
    );
}

export default EditAlbum;