import profileImage from "../assets/profile.png";

function ProfilePreview({ user }) {
    return (
        <article>
            <img src={profileImage} alt="Profile" />

            <div>
                <h3>{user.name}</h3>
                <p>{user.username}</p>
                <p>{user.pronouns}</p>
            </div>
        </article>
    );
}

export default ProfilePreview;