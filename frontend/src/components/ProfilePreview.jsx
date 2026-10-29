
import { Link } from "react-router-dom";
import profileImage from "../assets/profile.png";

function ProfilePreview({ user }) {
    return (
        <article className="flex items-center gap-4 font-body">

            {/* PROFILE PICTURE */}
            <Link
                to={`/profile/${user._id}`}
                className="shrink-0"
            >
                <img
                    src={profileImage}
                    alt={`${user.fullName}'s profile`}
                    className="h-16 w-16 rounded-full border-3 border-brand-100 object-cover shadow-sm"
                />
            </Link>

            {/* USER DETAILS */}
            <div className="min-w-0 flex-1">

                <Link to={`/profile/${user._id}`}>
                    <h3 className="truncate text-base font-bold text-slate-800 transition hover:text-brand-600">
                        {user.fullName}
                    </h3>
                </Link>

                <p className="mt-1 truncate text-sm text-brand-600">
                    @{user.username}
                </p>

                <Link
                    to={`/profile/${user._id}`}
                    className="mt-2 inline-block text-xs font-semibold text-slate-500 transition hover:text-brand-600 hover:underline"
                >
                    View Profile →
                </Link>

            </div>

        </article>
    );
}

export default ProfilePreview;
