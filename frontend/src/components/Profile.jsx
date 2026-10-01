import { Link } from "react-router-dom";
import profileImage from "../assets/profile.png";

function Profile({ user, isOwnProfile }) {
    return (
        <section>

            <img
                src={profileImage}
                alt="Profile"
            />

            <h2>{user.fullName}</h2>

            <p>@{user.username}</p>

            <p>
                {user.friends?.length || 0} Friends
            </p>


            {isOwnProfile && (
                <Link to="/edit-profile">
                    <button type="button">
                        Edit Profile
                    </button>
                </Link>
            )}

        </section>
    );
}

export default Profile;