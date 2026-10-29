
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Logo.png";

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem("user"));

    // log out the current user
    async function handleLogout() {
        try {
            const response = await fetch(
                "http://localhost:3000/logout",
                { method: "POST" }
            );

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            sessionStorage.removeItem("user")
            navigate("/");

        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    const profilePath = user ? `/profile/${user.id}` : "/home";
    const albumsPath = `${profilePath}?tab=albums#profile-tabs`;
    const friendsPath = `${profilePath}?tab=friends#profile-tabs`;

    // check which navigation link is selected
    const isProfilePage = location.pathname === profilePath;
    const selectedTab = new URLSearchParams(location.search).get("tab");

    const linkStyle = (active) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            active
                ? "bg-brand-100 text-brand-600"
                : "text-slate-600 hover:bg-slate-100 hover:text-brand-600"
        }`;

    return (
        <>
            {/* top navigation */}
            <header className="sticky top-0 z-50 flex h-18 items-center justify-between bg-brand-600 px-5 shadow-md md:px-10">
                <Link
                    to="/home"
                    className="flex min-w-0 items-center gap-3"
                >
                    <img
                        src={logo}
                        alt="WonderFrame logo"
                        className="h-11 w-11 shrink-0 object-contain"
                    />

                    <span className="truncate font-display text-xl font-bold text-white sm:text-2xl md:text-3xl">
                        WonderFrame
                    </span>
                </Link>

                {/* current user */}
                {user && (
                    <Link
                        to={profilePath}
                        className="ml-3 max-w-32 truncate text-sm font-medium text-white transition hover:text-cyan-100 sm:max-w-none"
                    >
                        @{user.username}
                    </Link>
                )}
            </header>

            {/* desktop sidebar */}
            <aside className="fixed top-18 bottom-0 left-0 z-40 hidden w-60 flex-col border-r border-slate-200 bg-white px-4 py-8 shadow-sm md:flex">

                <nav className="space-y-2">

                    {/* home */}
                    <NavLink
                        to="/home"
                        className={({ isActive }) => linkStyle(isActive)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m3 10 9-7 9 7" />
                            <path d="M5 9v12h14V9" />
                        </svg>
                        Home
                    </NavLink>

                    {user && (
                        <>
                            {/* profile */}
                            <Link
                                to={profilePath}
                                className={linkStyle(isProfilePage && !selectedTab)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 21a8 8 0 0 1 16 0" />
                                </svg>
                                Profile
                            </Link>

                            {/* albums */}
                            <Link
                                to={albumsPath}
                                className={linkStyle(isProfilePage && selectedTab === "albums")}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="m21 15-5-5L5 21" />
                                </svg>
                                Albums
                            </Link>

                            {/* friends */}
                            <Link
                                to={friendsPath}
                                className={linkStyle(isProfilePage && selectedTab === "friends")}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Friends
                            </Link>
                        </>
                    )}

                    {/* create post */}
                    <NavLink
                        to="/create-post"
                        className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
                    >
                        <span className="text-xl leading-none">+</span>
                        New Post
                    </NavLink>
                </nav>

                {/* logout */}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-brand-600 transition hover:bg-brand-100"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <path d="m16 17 5-5-5-5" />
                        <path d="M21 12H9" />
                    </svg>
                    Logout
                </button>
            </aside>

            {/* mobile navigation */}
            <nav className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 text-sm md:hidden">

                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        `rounded-lg px-3 py-2 font-medium ${
                            isActive
                                ? "bg-brand-100 text-brand-600"
                                : "text-slate-600 hover:bg-slate-100"
                        }`
                    }
                >
                    Home
                </NavLink>

                {user && (
                    <>
                        <Link
                            to={profilePath}
                            className="rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-brand-100"
                        >
                            Profile
                        </Link>

                        <Link
                            to={albumsPath}
                            className="rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-brand-100"
                        >
                            Albums
                        </Link>

                        <Link
                            to={friendsPath}
                            className="rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-brand-100"
                        >
                            Friends
                        </Link>
                    </>
                )}

                <Link
                    to="/create-post"
                    className="rounded-lg bg-brand-500 px-3 py-2 font-semibold text-white hover:bg-brand-600"
                >
                    + New Post
                </Link>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="ml-auto rounded-lg px-3 py-2 font-medium text-brand-600 hover:bg-brand-100"
                >
                    Logout
                </button>
            </nav>
        </>
    );
}

export default Navigation;
