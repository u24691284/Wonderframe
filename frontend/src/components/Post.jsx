import PostImage from "./PostImage";
import Comments from "./Comments";
import EditPost from "./EditPost";

function Post({ post }) {
    return (
        <article>
            <header>
                <h3>{post.name}</h3>
                <p>{post.username}</p>
                <time>{post.time}</time>
            </header>

            <PostImage post={post} />

            <p>{post.caption}</p>
            <p>{post.hashtags}</p>

            <p>{post.likes} likes</p>

            <Comments comments={post.comments} />

            {/*depending on if it is someone else post or yours, see if this should appear*/}
            <EditPost />
        </article>
    );
}

export default Post;