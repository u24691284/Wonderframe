import { useEffect, useState } from "react";
import EditAlbum from "./EditAlbum";

function UserAlbums({
    albums,
    isOwnProfile,
    onAlbumChanged
}) {
    const [allPosts, setAllPosts] = useState([]);

    // Load all posts so we can display
    // the posts stored inside each album
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
                console.error(
                    "Error loading album posts:",
                    error
                );
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
                alert(
                    data.message ||
                    "Failed to remove post."
                );
                return;
            }

            // Reload albums immediately
            await onAlbumChanged();

        } catch (error) {
            console.error(
                "Error removing post from album:",
                error
            );
        }
    }


    return (
        <section>

            <h2>Albums</h2>

            {albums.length === 0 && (
                <p>No albums yet.</p>
            )}


            {albums.map((album) => {

                // Find the actual post objects
                // belonging to this album
                const albumPosts = allPosts.filter(
                    (post) =>
                        album.posts?.some(
                            (postId) =>
                                String(postId) ===
                                String(post._id)
                        )
                );


                return (
                    <article key={album._id}>

                        <h3>{album.name}</h3>

                        {album.description && (
                            <p>
                                {album.description}
                            </p>
                        )}

                        <p>
                            {album.posts?.length || 0} posts
                        </p>

                        <p>
                            {Array.isArray(album.hashtags)
                                ? album.hashtags.join(" ")
                                : album.hashtags}
                        </p>


                        {/* POSTS INSIDE THIS ALBUM */}
                        {albumPosts.length > 0 && (
                            <section>

                                <h4>Posts in this Album</h4>

                                {albumPosts.map((post) => (
                                    <article key={post._id}>

                                        {post.image && (
                                            <img
                                                src={post.image}
                                                alt={
                                                    post.description
                                                }
                                            />
                                        )}

                                        <p>
                                            {post.description}
                                        </p>

                                        <p>
                                            {Array.isArray(
                                                post.hashtags
                                            )
                                                ? post.hashtags.join(
                                                    " "
                                                )
                                                : post.hashtags}
                                        </p>


                                        {isOwnProfile && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemovePost(
                                                        album._id,
                                                        post._id
                                                    )
                                                }
                                            >
                                                Remove Post
                                            </button>
                                        )}

                                    </article>
                                ))}

                            </section>
                        )}


                        {/* EDIT / ADD / DELETE ALBUM */}
                        {isOwnProfile && (
                            <EditAlbum
                                album={album}
                                onAlbumChanged={
                                    onAlbumChanged
                                }
                            />
                        )}

                    </article>
                );
            })}

        </section>
    );
}

export default UserAlbums;