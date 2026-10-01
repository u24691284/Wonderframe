import { useState } from "react";

function CreateAlbum({ onAlbumCreated }) {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [message, setMessage] = useState("");

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
                "http://localhost:3000/albums",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: loggedInUser.id,
                        name: name,
                        description: description,
                        hashtags: hashtagArray
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to create album."
                );
                return;
            }

            setMessage("Album created successfully!");

            setName("");
            setDescription("");
            setHashtags("");

            if (onAlbumCreated) {
                onAlbumCreated();
            }

        } catch (error) {
            console.error("Error creating album:", error);
            setMessage("Something went wrong.");
        }
    }

    return (
        <section>
            <h2>Create Album</h2>

            <form onSubmit={handleSubmit}>

                <label htmlFor="albumName">
                    Album Name:
                </label>
                <br />

                <input
                    type="text"
                    id="albumName"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    required
                />

                <br />

                <label htmlFor="albumDescription">
                    Description:
                </label>
                <br />

                <textarea
                    id="albumDescription"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                />

                <br />

                <label htmlFor="albumHashtags">
                    Hashtags:
                </label>
                <br />

                <input
                    type="text"
                    id="albumHashtags"
                    value={hashtags}
                    onChange={(event) =>
                        setHashtags(event.target.value)
                    }
                    placeholder="#travel #pretoria"
                />

                <br />

                <button type="submit">
                    Create Album
                </button>

            </form>

            {message && <p>{message}</p>}
        </section>
    );
}

export default CreateAlbum;