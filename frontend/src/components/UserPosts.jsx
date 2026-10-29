
import PostPreview from "./PostPreview";

function UserPosts({ posts }) {
    return (
        <section className="font-body">

            {/* HEADING */}
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">
                    My Posts
                </h2>

                <span className="rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600">
                    {posts.length} Posts
                </span>
            </div>

            {/* EMPTY STATE */}
            {posts.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-700">
                        No posts yet
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Travel memories will appear here once shared.
                    </p>
                </div>
            ) : (
                /* POSTS GRID */
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <PostPreview post={post} />
                        </div>
                    ))}
                </div>
            )}

        </section>
    );
}

export default UserPosts;
