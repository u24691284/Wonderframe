import { Link } from "react-router-dom";
import profileImage from "../assets/profile.png";

function ProfilePreview({ user }) {
    return (
        <article>
            <img src={profileImage} alt="Profile" />

            <div>
                <Link to={`/profile/${user._id}`}>
                    <h3>{user.fullName}</h3>
                </Link>

                <p>@{user.username}</p>
            </div>
        </article>
    );
}

export default ProfilePreview;