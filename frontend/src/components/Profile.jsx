import { Link } from "react-router-dom";
import profileImage from "../assets/profile.png";

function Profile() {
    return (
        <section>
            <img src={profileImage} alt="Profile" />

            <h2>Lisa Harrus</h2>
            <p>@username</p>
            <p>she/her</p>

            <p>This is my BIO.</p>

            <a href="#">links to other sites</a>

            <div>
                <p>234 Posts</p>
                <p>234 Albums</p>
                <p>234 Friends</p>
            </div>

            <Link to="/edit-profile">
                <button type="button">
                    Edit Profile
                </button>
            </Link>
        </section>
    );
}

export default Profile;