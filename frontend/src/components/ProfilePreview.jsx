import profileImage from "../assets/profile.png";

function ProfilePreview() {
    return (
        <article>
            <img src={profileImage} alt="Profile" />

            <div>
                <h3>Tamima</h3>
                <p>@tamima929</p>
                <p>she/her</p>
            </div>
        </article>
    );
}

export default ProfilePreview;