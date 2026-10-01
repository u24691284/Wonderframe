import { Link } from "react-router-dom";

function PostPreview({ post }) {
    return (
        <article>

            <Link to={`/post/${post._id}`}>
                {post.image && (
                    <img
                        src={post.image}
                        alt={post.description}
                    />
                )}
            </Link>

            <p>{post.description}</p>

            <p>
                {Array.isArray(post.hashtags)
                    ? post.hashtags.join(" ")
                    : post.hashtags}
            </p>

            <p>{post.likes?.length || 0} likes</p>
            <p>{post.comments?.length || 0} comments</p>

        </article>
    );
}

export default PostPreview;