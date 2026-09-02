import { Link } from "react-router-dom";

function Navigation() {
    return (
        <nav>
            <Link to="/home">Home</Link><br />
            <Link to="/profile/1">Profile</Link><br />
            <Link to="/albums">Albums</Link><br />
            <Link to="/friends">Friends</Link><br />
            <Link to="/settings">Settings</Link><br />
            <Link to="/create-post">
                <button type="button">New Post</button>
            </Link>
        </nav>
    );
}

export default Navigation;