
import { Link } from "react-router-dom";

function PostPreview({ post }) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

            {/* POST IMAGE */}
            <Link
                to={`/post/${post._id}`}
                className="block overflow-hidden bg-slate-100"
            >
                {post.image ? (
                    <img
                        src={post.image}
                        alt={post.description || "Travel photo"}
                        className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="flex aspect-square items-center justify-center text-sm text-slate-400">
                        No image available
                    </div>
                )}
            </Link>

            {/* POST DETAILS */}
            <div className="flex flex-1 flex-col p-4">

                {/* CAPTION */}
                <p className="line-clamp-2 text-sm leading-6 text-slate-700">
                    {post.description}
                </p>

                {/* HASHTAGS */}
                {post.hashtags?.length > 0 && (
                    <p className="mt-2 line-clamp-2 text-sm font-medium text-brand-600">
                        {Array.isArray(post.hashtags)
                            ? post.hashtags.join(" ")
                            : post.hashtags}
                    </p>
                )}

                {/* LIKES AND COMMENTS */}
                <div className="mt-auto flex items-center gap-5 border-b border-slate-100 py-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <span className="text-base text-brand-500">♡</span>
                        {post.likes?.length || 0} likes
                    </span>

                    <span className="flex items-center gap-1">
                        <span className="text-base text-brand-500">♧</span>
                        {post.comments?.length || 0} comments
                    </span>
                </div>

                {/* VIEW POST */}
                <Link
                    to={`/post/${post._id}`}
                    className="mt-3 inline-flex items-center justify-between text-sm font-semibold text-brand-600 transition hover:text-brand-500"
                >
                    View Post
                    <span>→</span>
                </Link>

            </div>
        </article>
    );
}

export default PostPreview;
