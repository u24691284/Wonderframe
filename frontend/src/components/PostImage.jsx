import postImage from "../assets/posts.png";

function PostImage({ post }) {
    return (
        <div>
            <img src={postImage} alt={post.caption} />
        </div>
    );
}

export default PostImage;