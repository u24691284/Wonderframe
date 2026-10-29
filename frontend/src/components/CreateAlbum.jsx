
import { useState } from "react";

function CreateAlbum({ onAlbumCreated }) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

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
            setIsOpen(false);

            if (onAlbumCreated) {
                await onAlbumCreated();
            }

        } catch (error) {
            console.error("Error creating album:", error);
            setMessage("Something went wrong.");
        }
    }

    const inputStyle =
        "w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100";

    const labelStyle =
        "mb-2 block text-sm font-semibold text-slate-700";

    return (
        <section className="font-body">

            {/* HEADING AND CREATE BUTTON */}
            <div className="flex flex-wrap items-center justify-between gap-4">

                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Create Album
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Organise your favourite travel memories.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setMessage("");
                    }}
                    className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                    {isOpen ? "Cancel" : "+ New Album"}
                </button>
            </div>

            {/* CREATE ALBUM FORM */}
            {isOpen && (
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5 border-t border-slate-200 pt-6"
                >

                    {/* ALBUM NAME */}
                    <div>
                        <label
                            htmlFor="albumName"
                            className={labelStyle}
                        >
                            Album Name
                        </label>

                        <input
                            type="text"
                            id="albumName"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="e.g. Cape Town Adventures"
                            required
                            className={inputStyle}
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label
                            htmlFor="albumDescription"
                            className={labelStyle}
                        >
                            Description
                        </label>

                        <textarea
                            id="albumDescription"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Describe the memories in this album..."
                            rows="3"
                            className={`${inputStyle} resize-none`}
                        />
                    </div>

                    {/* HASHTAGS */}
                    <div>
                        <label
                            htmlFor="albumHashtags"
                            className={labelStyle}
                        >
                            Hashtags
                        </label>

                        <input
                            type="text"
                            id="albumHashtags"
                            value={hashtags}
                            onChange={(event) =>
                                setHashtags(event.target.value)
                            }
                            placeholder="#travel #pretoria #memories"
                            className={inputStyle}
                        />

                        <p className="mt-2 text-xs text-slate-400">
                            Separate hashtags with spaces or commas.
                        </p>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100"
                    >
                        Create Album
                    </button>

                </form>
            )}

            {/* STATUS MESSAGE */}
            {message && (
                <p
                    role="status"
                    className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
                        message === "Album created successfully!"
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

export default CreateAlbum;
