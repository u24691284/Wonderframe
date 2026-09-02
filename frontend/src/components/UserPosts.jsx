import PostPreview from "./PostPreview";

function UserPosts({ posts }) {
    return (
        <section>
            <h2>Posts</h2>

            {posts.map((post) => (
                <PostPreview key={post.id} post={post} />
            ))}
        </section>
    );
}

export default UserPosts;