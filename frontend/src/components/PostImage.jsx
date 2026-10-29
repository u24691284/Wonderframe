
function PostImage({ post }) {
    return (
        <div className="flex w-full items-center justify-center bg-slate-100">
            {post.image && (
                <img
                    src={post.image}
                    alt={post.description || "Travel photo"}
                    className="max-h-150 w-full object-contain"
                />
            )}
        </div>
    );
}

export default PostImage;
