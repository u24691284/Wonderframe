import { Link } from "react-router-dom";
import profileImage from "../assets/profile.png";

function Profile({ user }) {
    return (
        <section>
            <img src={profileImage} alt="Profile" />

            <h2>{user.name}</h2>
            <p>{user.username}</p>
            <p>{user.pronouns}</p>

            <p>{user.bio}</p>

            <a href="#">{user.socialLink}</a>

            <div>
                <p>{user.posts} Posts</p>
                <p>{user.albums} Albums</p>
                <p>{user.friends} Friends</p>
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