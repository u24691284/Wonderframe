import { useState } from "react";

function CreatePost() {
    const [message, setMessage] = useState("");

    const loggedInUser = JSON.parse(localStorage.getItem("user"));


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


            // Convert selected image into a string
            const image = await convertImageToBase64(imageFile);


            // Turn hashtags into an array
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

            // Clear the form
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


    return (
        <section>
            <h2>Create Post</h2>

            <form onSubmit={handleSubmit}>

                <label htmlFor="postImage">
                    Post Image:
                </label>

                <br />

                <input
                    type="file"
                    id="postImage"
                    name="postImage"
                    accept="image/*"
                    required
                />


                <br />


                <label htmlFor="caption">
                    Caption:
                </label>

                <br />

                <textarea
                    id="caption"
                    name="caption"
                    required
                ></textarea>


                <br />


                <label htmlFor="hashtag">
                    Hashtags:
                </label>

                <br />

                <input
                    type="text"
                    id="hashtag"
                    name="hashtag"
                    placeholder="#travel #pretoria"
                />


                <br />


                <input
                    type="submit"
                    value="Create Post"
                />

            </form>


            {message && (
                <p>{message}</p>
            )}

        </section>
    );
}

export default CreatePost;