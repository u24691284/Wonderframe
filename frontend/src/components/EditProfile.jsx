import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {

    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    const [fullName, setFullName] = useState(loggedInUser?.fullName || "");
    const [username, setUsername] = useState(loggedInUser?.username || "");
    const [email, setEmail] = useState(loggedInUser?.email || "");

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:3000/users/${loggedInUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fullName,
                        username,
                        email
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            const updatedUser = {
                ...loggedInUser,
                fullName,
                username,
                email
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            alert("Profile updated successfully");

            navigate(`/profile/${loggedInUser.id}`);

        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    //delete button profile
    async function handleDelete() {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete your profile?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/users/${loggedInUser.id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            localStorage.removeItem("user");

            navigate("/");

        } catch (error) {
            console.error("Error deleting profile:", error);
        }
    }

    return (
        <section>
            <h2>Edit Profile</h2>

            <form onSubmit={handleSubmit}>

                <label htmlFor="name">Name</label><br />
                <input
                    type="text"
                    id="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                /><br />

                <label htmlFor="username">Username</label><br />
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                /><br />

                <label htmlFor="email">Email</label><br />
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                /><br />

                <button type="submit">
                    Save Changes
                </button>

                <br />

                <button type="button" onClick={handleDelete}>
                    Delete Profile
                </button>

            </form>
        </section>
    );
}

export default EditProfile;