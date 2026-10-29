import { useState } from "react";

function CreatePost() {
    const [message, setMessage] = useState("");

    const loggedInUser = JSON.parse();

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const form = event.target;

            const imageFile = form.postImage.files[0];
            const description = form.caption.value;
            const hashtagText = form.hashtag.value;

            if (!imageFile || !description) {
                setMessage("Please add an image and caption.");
                return;
            }

            // Convert image to Base64
            const image = await convertImageToBase64(imageFile);

            // Convert hashtags into an array
            const hashtags = hashtagText
                .split(/[\s,]+/)
                .filter((tag) => tag.trim() !== "")
                .map((tag) =>
                    tag.startsWith("#") ? tag : `#${tag}`
                );

            const response = await fetch(
                "http://localhost:3000/posts",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: loggedInUser.id,
                        image: image,
                        description: description,
                        hashtags: hashtags
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to create post.");
                return;
            }

            setMessage("Post created successfully!");
            form.reset();

        } catch (error) {
            console.error("Error creating post:", error);
            setMessage("Something went wrong.");
        }
    }

    function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = () => {
                reject(new Error("Failed to read image"));
            };

            reader.readAsDataURL(file);
        });
    }

    const inputStyle =
        "w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100";

    const labelStyle =
        "mb-2 block text-sm font-semibold text-slate-700";

    return (
        <section className="font-body">

            {/* HEADING */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                    Create Post
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Share a new travel memory with WonderFrame.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* IMAGE UPLOAD */}
                <div>
                    <label
                        htmlFor="postImage"
                        className={labelStyle}
                    >
                        Post Image
                    </label>

                    <div className="rounded-xl border-2 border-dashed border-brand-100 bg-slate-50 p-5 transition hover:border-brand-500">
                        <input
                            type="file"
                            id="postImage"
                            name="postImage"
                            accept="image/*"
                            required
                            className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-100 file:px-4 file:py-2 file:font-semibold file:text-brand-600 hover:file:bg-brand-500 hover:file:text-white"
                        />

                        <p className="mt-3 text-xs text-slate-400">
                            Choose a photo from your device.
                        </p>
                    </div>
                </div>

                {/* CAPTION */}
                <div>
                    <label
                        htmlFor="caption"
                        className={labelStyle}
                    >
                        Caption
                    </label>

                    <textarea
                        id="caption"
                        name="caption"
                        required
                        rows="4"
                        placeholder="Tell us about your travel experience..."
                        className={`${inputStyle} resize-none`}
                    />
                </div>

                {/* HASHTAGS */}
                <div>
                    <label
                        htmlFor="hashtag"
                        className={labelStyle}
                    >
                        Hashtags
                    </label>

                    <input
                        type="text"
                        id="hashtag"
                        name="hashtag"
                        placeholder="#travel #pretoria #memories"
                        className={inputStyle}
                    />

                    <p className="mt-2 text-xs text-slate-400">
                        Separate hashtags with spaces or commas.
                    </p>
                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    className="w-full rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100"
                >
                    + Create Post
                </button>

            </form>

            {/* STATUS MESSAGE */}
            {message && (
                <p
                    role="status"
                    className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                        message === "Post created successfully!"
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

export default CreatePost;
