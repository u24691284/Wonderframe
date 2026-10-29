
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditAlbum from "./EditAlbum";

function UserAlbums({
    albums,
    isOwnProfile,
    onAlbumChanged
}) {
    const [allPosts, setAllPosts] = useState([]);

    // Load posts belonging to albums
    useEffect(() => {
        async function loadPosts() {
            try {
                const response = await fetch(
                    "http://localhost:3000/posts"
                );

                if (!response.ok) {
                    throw new Error("Failed to load posts");
                }

                const data = await response.json();
                setAllPosts(data);

            } catch (error) {
                console.error("Error loading album posts:", error);
            }
        }

        loadPosts();
    }, []);

    // Remove a post from an album
    async function handleRemovePost(albumId, postId) {
        try {
            const response = await fetch(
                `http://localhost:3000/albums/${albumId}/posts/${postId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to remove post.");
                return;
            }

            await onAlbumChanged();

        } catch (error) {
            console.error("Error removing post from album:", error);
        }
    }

    return (
        <section className="font-body">

            {/* HEADING */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">
                    Albums
                </h2>

                <span className="rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600">
                    {albums.length} Albums
                </span>
            </div>

            {/* EMPTY STATE */}
            {albums.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-700">
                        No albums yet
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Travel photo collections will appear here.
                    </p>
                </div>
            )}

            {/* ALBUM CARDS */}
            <div className="space-y-6">
                {albums.map((album) => {

                    const albumPosts = allPosts.filter(
                        (post) =>
                            album.posts?.some(
                                (postId) =>
                                    String(postId) === String(post._id)
                            )
                    );

                    return (
                        <article
                            key={album._id}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >

                            {/* ALBUM DETAILS */}
                            <div className="border-b border-slate-100 p-6">

                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">
                                            {album.name}
                                        </h3>

                                        {album.description && (
                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                {album.description}
                                            </p>
                                        )}
                                    </div>

                                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-600">
                                        {album.posts?.length || 0} Posts
                                    </span>
                                </div>

                                {/* HASHTAGS */}
                                {album.hashtags && (
                                    <p className="mt-3 text-sm font-medium text-brand-600">
                                        {Array.isArray(album.hashtags)
                                            ? album.hashtags.join(" ")
                                            : album.hashtags}
                                    </p>
                                )}
                            </div>

                            {/* ALBUM PHOTOS */}
                            <div className="p-6">

                                <h4 className="mb-4 text-sm font-semibold text-slate-700">
                                    Photos in this Album
                                </h4>

                                {albumPosts.length === 0 ? (
                                    <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                                        No photos in this album yet.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                        {albumPosts.map((post) => (
                                            <div
                                                key={post._id}
                                                className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white"
                                            >

                                                {/* PHOTO */}
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
                                                            No image
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* PHOTO DETAILS */}
                                                <div className="p-3">

                                                    <p className="line-clamp-2 text-sm text-slate-700">
                                                        {post.description}
                                                    </p>

                                                    {post.hashtags?.length > 0 && (
                                                        <p className="mt-2 line-clamp-2 text-xs font-medium text-brand-600">
                                                            {Array.isArray(post.hashtags)
                                                                ? post.hashtags.join(" ")
                                                                : post.hashtags}
                                                        </p>
                                                    )}

                                                    {isOwnProfile && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemovePost(
                                                                    album._id,
                                                                    post._id
                                                                )
                                                            }
                                                            className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            Remove Post
                                                        </button>
                                                    )}
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* EDIT / ADD / DELETE ALBUM */}
                            {isOwnProfile && (
                                <div className="border-t border-slate-100 bg-slate-50 p-5">
                                    <EditAlbum
                                        album={album}
                                        onAlbumChanged={onAlbumChanged}
                                    />
                                </div>
                            )}

                        </article>
                    );
                })}
            </div>

        </section>
    );
}

export default UserAlbums;
