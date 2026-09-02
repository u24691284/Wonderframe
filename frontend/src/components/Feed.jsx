import PostPreview from "./PostPreview";

function Feed({ posts }) {
    return (
        <section>
            <h2>Posts from you and your friends</h2>

            <button type="button">Local</button>
            <button type="button">Global</button>

            {posts.map((post) => (
                <PostPreview key={post.id} post={post} />
            ))}
        </section>
    );
}

export default Feed;