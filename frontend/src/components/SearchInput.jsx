
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import profileImage from "../assets/profile.png";

function SearchInput() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState({
        users: [],
        posts: [],
        albums: []
    });
    const [hasSearched, setHasSearched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState("");
    const [, setSearchParams] = useSearchParams();

    // search users, posts and albums
    async function runSearch(searchText) {
        const term = searchText.trim().toLowerCase();

        if (!term) {
            setResults({ users: [], posts: [], albums: [] });
            setHasSearched(false);
            setError("");
            return;
        }

        setIsSearching(true);
        setHasSearched(false);
        setError("");

        try {
            const responses = await Promise.all([
                fetch("http://localhost:3000/users"),
                fetch("http://localhost:3000/posts"),
                fetch("http://localhost:3000/albums")
            ]);

            if (responses.some((response) => !response.ok)) {
                throw new Error("Search request failed");
            }

            const [users, posts, albums] = await Promise.all(
                responses.map((response) => response.json())
            );

            // match text without case sensitivity
            const matches = (value) =>
                String(value || "").toLowerCase().includes(term);

            const matchesHashtags = (hashtags) =>
                Array.isArray(hashtags) &&
                hashtags.some((tag) => matches(tag));

            setResults({
                users: users.filter((user) =>
                    matches(user.fullName) ||
                    matches(user.username) ||
                    matches(user.email)
                ),
                posts: posts.filter((post) =>
                    matches(post.description) ||
                    matchesHashtags(post.hashtags)
                ),
                albums: albums.filter((album) =>
                    matches(album.name) ||
                    matches(album.description) ||
                    matchesHashtags(album.hashtags)
                )
            });

            setHasSearched(true);

        } catch (error) {
            console.error("Error searching:", error);
            setResults({ users: [], posts: [], albums: [] });
            setError("Unable to search. Please try again.");
        } finally {
            setIsSearching(false);
        }
    }

    // submit search
    function handleSearch(event) {
        event.preventDefault();
        runSearch(search);
    }

    // search when a hashtag is clicked
    function handleHashtagClick(tag) {
        setSearch(tag);
        runSearch(tag);
    }

    const totalResults =
        results.users.length +
        results.posts.length +
        results.albums.length;

    return (
        <section className="w-full space-y-5">

            {/* search form */}
            <form
                onSubmit={handleSearch}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
                <div className="min-w-0 flex-1">
                    <label
                        htmlFor="search"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Search WonderFrame
                    </label>

                    <div className="relative">
                        {/* search icon */}
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
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>

                        <input
                            type="search"
                            id="search"
                            name="search"
                            placeholder="Search users, posts, albums or hashtags..."
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setHasSearched(false);
                                setError("");
                            }}
                            className="w-full min-w-0 rounded-xl border-2 border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                        />
                    </div>
                </div>

                {/* search button */}
                <button
                    type="submit"
                    disabled={isSearching}
                    className="rounded-xl bg-brand-500 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSearching ? "Searching..." : "Search"}
                </button>
            </form>

            {/* error message */}
            {error && (
                <p
                    role="alert"
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                    {error}
                </p>
            )}

            {/* search results */}
            {hasSearched && (
                <div className="space-y-6 border-t border-slate-100 pt-5">

                    <h3 className="text-sm font-semibold text-slate-700">
                        Search Results ({totalResults})
                    </h3>

                    {totalResults === 0 && (
                        <div className="rounded-xl bg-slate-50 px-5 py-8 text-center">
                            <p className="font-medium text-slate-700">
                                No results found
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Try another search term.
                            </p>
                        </div>
                    )}

                    {/* users */}
                    {results.users.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-slate-800">
                                Users ({results.users.length})
                            </h4>

                            {results.users.map((user) => (
                                <Link
                                    key={user._id}
                                    to={`/profile/${user._id}`}
                                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-brand-100 hover:bg-brand-100/40"
                                >
                                    <img
                                        src={user.profileImage || profileImage}
                                        alt=""
                                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {user.fullName}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            @{user.username}
                                        </p>
                                    </div>

                                    <span className="text-xs font-semibold text-brand-600">
                                        View Profile
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* posts */}
                    {results.posts.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-slate-800">
                                Posts ({results.posts.length})
                            </h4>

                            {results.posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                                >
                                    <Link
                                        to={`/post/${post._id}`}
                                        className="flex items-center gap-4 p-3 transition hover:bg-slate-50"
                                    >
                                        <img
                                            src={post.image}
                                            alt={post.description || "Travel photo"}
                                            className="h-20 w-20 shrink-0 rounded-lg object-cover"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-2 text-sm font-medium text-slate-800">
                                                {post.description}
                                            </p>
                                            <span className="mt-2 inline-block text-xs font-semibold text-brand-600">
                                                View Post
                                            </span>
                                        </div>
                                    </Link>

                                    {/* clickable hashtags */}
                                    {post.hashtags?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 px-3 pb-3">
                                            {post.hashtags.map((tag, index) => (
                                                <button
                                                    key={`${tag}-${index}`}
                                                    type="button"
                                                    onClick={() => handleHashtagClick(tag)}
                                                    className="rounded-lg bg-brand-100 px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-500 hover:text-white"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* albums */}
                    {results.albums.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-slate-800">
                                Albums ({results.albums.length})
                            </h4>

                            {results.albums.map((album) => (
                                <div
                                    key={album._id}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                >
                                    <Link
                                        to={`/profile/${album.userId}?tab=albums#profile-tabs`}
                                        className="block"
                                    >
                                        <p className="font-semibold text-slate-800 hover:text-brand-600">
                                            {album.name}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {album.description}
                                        </p>
                                        <span className="mt-2 inline-block text-xs font-semibold text-brand-600">
                                            View Album
                                        </span>
                                    </Link>

                                    {/* clickable hashtags */}
                                    {album.hashtags?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {album.hashtags.map((tag, index) => (
                                                <button
                                                    key={`${tag}-${index}`}
                                                    type="button"
                                                    onClick={() => handleHashtagClick(tag)}
                                                    className="rounded-lg bg-brand-100 px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-500 hover:text-white"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default SearchInput;
