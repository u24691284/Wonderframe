
import ProfilePreview from "./ProfilePreview";

function FriendList({ friends }) {
    return (
        <section className="font-body">

            {/* heading */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">
                    Friends
                </h2>

                <span className="rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600">
                    {friends.length} Friends
                </span>
            </div>

            {/* empty */}
            {friends.length === 0 ? (
                <div className="rounded-xl bg-slate-50 px-6 py-12 text-center">
                    <h3 className="text-lg font-semibold text-slate-700">
                        No friends yet
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Connect with other travellers on WonderFrame.
                    </p>
                </div>
            ) : (
                /* FRIENDS GRID */
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {friends.map((friend) => (
                        <div
                            key={friend._id}
                            className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-500 hover:shadow-md"
                        >
                            <ProfilePreview user={friend} />
                        </div>
                    ))}
                </div>
            )}

        </section>
    );
}

export default FriendList;
