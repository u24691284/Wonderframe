function Comments() {
    return (
        <section>
            <h3>Comments</h3>

            <article>
                <h4>Layla</h4>
                <p>So pretty!</p>
            </article>

            <article>
                <h4>Kiara</h4>
                <p>Love this!</p>
            </article>

            <form>
                <label htmlFor="comment">Write a comment</label><br />
                <textarea id="comment" name="comment"></textarea><br />

                <button type="submit">Post Comment</button>
            </form>
        </section>
    );
}

export default Comments;