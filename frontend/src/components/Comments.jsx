function Comments({ comments }) {
    return (
        <section>
            <h3>Comments</h3>

            {comments.map((comment) => (
                <article key={comment.id}>
                    <h4>{comment.name}</h4>
                    <p>{comment.text}</p>
                </article>
            ))}

            <form>
                <label htmlFor="comment">Write a comment</label><br />
                <textarea id="comment" name="comment"></textarea><br />

                <button type="submit">Post Comment</button>
            </form>
        </section>
    );
}

export default Comments;