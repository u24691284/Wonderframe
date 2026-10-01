function PostImage({ post }) {
    return (
        <div>
            {post.image && (
                <img
                    src={post.image}
                    alt={post.description}
                />
            )}
        </div>
    );
}

export default PostImage;