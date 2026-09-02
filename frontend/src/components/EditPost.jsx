function EditPost() {
    return (
        <section>
            <h2>Edit Post</h2>

            <form>
                <label htmlFor="caption">Caption</label><br />
                <textarea id="caption" name="caption"></textarea><br />

                <label htmlFor="hashtags">Hashtags</label><br />
                <input type="text" id="hashtags" name="hashtags" /><br />

                <button type="submit">Save Changes</button>
            </form>
        </section>
    );
}

export default EditPost;