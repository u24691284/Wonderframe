import { useEffect, useState } from "react";

function Comments({ comments, postId }) {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    const [commentList, setCommentList] = useState(comments || []);
    const [users, setUsers] = useState([]);
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");


    // Load users so we can display comment names
    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await fetch(
                    "http://localhost:3000/users"
                );

                if (!response.ok) {
                    throw new Error("Failed to load users");
                }

                const data = await response.json();

                setUsers(data);

            } catch (error) {
                console.error("Error loading comment users:", error);
            }
        }

        loadUsers();

    }, []);


    async function handleSubmit(event) {
        event.preventDefault();

        if (!text.trim()) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/posts/${postId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: loggedInUser.id,
                        text: text
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to add comment."
                );
                return;
            }

            setCommentList([
                ...commentList,
                data.comment
            ]);

            setText("");
            setMessage("");

        } catch (error) {
            console.error("Error adding comment:", error);
            setMessage("Something went wrong.");
        }
    }


    function getCommentUser(comment) {
        return users.find(
            (user) =>
                String(user._id) === String(comment.userId)
        );
    }


    return (
        <section>
            <h3>Comments</h3>


            {commentList.length === 0 && (
                <p>No comments yet.</p>
            )}


            {commentList.map((comment) => {
                const commentUser = getCommentUser(comment);

                return (
                    <article key={comment._id}>

                        <h4>
                            {commentUser
                                ? commentUser.fullName
                                : "User"}
                        </h4>

                        <p>{comment.text}</p>

                    </article>
                );
            })}


            <form onSubmit={handleSubmit}>

                <label htmlFor="comment">
                    Write a comment
                </label>

                <br />

                <textarea
                    id="comment"
                    name="comment"
                    value={text}
                    onChange={(event) =>
                        setText(event.target.value)
                    }
                    required
                />

                <br />

                <button type="submit">
                    Post Comment
                </button>

            </form>


            {message && (
                <p>{message}</p>
            )}

        </section>
    );
}

export default Comments;