function EditProfile() {
    return (
        <section>
            <h2>Edit Profile</h2>

            <form>
                <label htmlFor="name">Name</label><br />
                <input type="text" id="name" name="name" /><br />

                <label htmlFor="username">Username</label><br />
                <input type="text" id="username" name="username" /><br />

                <label htmlFor="pronouns">Pronouns</label><br />
                <input type="text" id="pronouns" name="pronouns" /><br />

                <label htmlFor="bio">Bio</label><br />
                <textarea id="bio" name="bio"></textarea><br />

                <label htmlFor="socialLink">Social Link</label><br />
                <input type="url" id="socialLink" name="socialLink" /><br />

                <label htmlFor="profileImage">Profile Image</label><br />
                <input type="file" id="profileImage" name="profileImage" accept="image/*" /><br />

                <button type="submit">Save Changes</button>
            </form>
        </section>
    );
}

export default EditProfile;