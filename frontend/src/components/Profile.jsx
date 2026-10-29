
import { Link } from "react-router-dom";
import profileImage from "../assets/profile.png";

function Profile({ user, isOwnProfile }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">

                {/* profile picture */}
                <img
                    src={user.profileImage || profileImage}
                    alt={`${user.fullName}'s profile`}
                    className="h-28 w-28 shrink-0 rounded-full border-4 border-brand-100 object-cover shadow-sm"
                />

                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-slate-800">
                        {user.fullName}
                    </h2>

                    <p className="mt-1 text-base text-brand-600">
                        @{user.username}
                    </p>

                    <p className="mt-4 text-sm font-medium text-slate-500">
                        {user.friends?.length || 0} Friends
                    </p>

                    {isOwnProfile && (
                        <Link
                            to="/edit-profile"
                            className="mt-5 inline-block rounded-lg border-2 border-brand-500 px-5 py-2 font-semibold text-brand-600 transition hover:bg-brand-100"
                        >
                            Edit Profile
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Profile;
