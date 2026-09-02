//fix image

function CreatePost() {
    return (
        <section>
            <h2>Create Post</h2>

            <form>
                <label htmlFor="postImage">Post Image:</label>
                <br />
                <input type="file" id="postImage" name="postImage" accept="image/*"/>

                <br />

                <label htmlFor="caption">Caption:</label>
                <br />
                <textarea id="caption" name="caption"></textarea>

                <br />

                <label htmlFor="hashtag">Hashtags:</label>
                <br />
                <input type="text" id="hashtag" name="hashtag"/>

                <br />

                <input type="submit" value="Create Post" />
            </form>
        </section>
    );
}

export default CreatePost;