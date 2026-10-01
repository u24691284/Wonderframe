import { Link, useNavigate } from "react-router-dom";

function Navigation() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    async function handleLogout() {
        try {
            const response = await fetch(
                "http://localhost:3000/logout",
                {
                    method: "POST"
                }
            );

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            localStorage.removeItem("user");
            navigate("/");

        } catch (error) {
            console.error("Error logging out:", error);
        }
    }
    return (
        <nav>
            <Link to="/home">Home</Link><br />

            {user && (
                <Link to={`/profile/${user.id}`}>
                    Profile
                </Link>
            )}

            <br />

            <Link to="/create-post">
                <button type="button">New Post</button>
            </Link>

            <br />

            <button type="button" onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
}

export default Navigation;