import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navigation from "../components/Navigation";
import Profile from "../components/Profile";
import EditProfile from "../components/EditProfile";
import UserPosts from "../components/UserPosts";
import UserAlbums from "../components/UserAlbums";
import FriendList from "../components/FriendList";
import SearchInput from "../components/SearchInput";
import CreatePost from "../components/CreatePost";
import CreateAlbum from "../components/CreateAlbum";


function ProfilePage() {
    const { id } = useParams();

    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [posts, setPosts] = useState([]);
    const [friends, setFriends] = useState([]);
    const [albums, setAlbums] = useState([]);

    const [selectedSection, setSelectedSection] = useState("posts");
    const [editing, setEditing] = useState(false);


    // Load the profile being viewed
    useEffect(() => {
        async function loadUser() {
            try {
                const response = await fetch(
                    `http://localhost:3000/users/${id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load user");
                }

                const data = await response.json();

                setUser(data);

            } catch (error) {
                console.error("Error loading user:", error);
            }
        }

        loadUser();

    }, [id]);


    // Load posts belonging to the profile being viewed
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

                const userPosts = data.filter(
                    (post) =>
                        String(post.userId) === String(id)
                );

                setPosts(userPosts);

            } catch (error) {
                console.error(
                    "Error loading profile posts:",
                    error
                );
            }
        }

        loadPosts();

    }, [id]);


    // Load the logged-in user
    useEffect(() => {
        async function loadCurrentUser() {
            try {
                if (!loggedInUser) {
                    return;
                }

                const response = await fetch(
                    `http://localhost:3000/users/${loggedInUser.id}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load current user"
                    );
                }

                const data = await response.json();

                setCurrentUser(data);

            } catch (error) {
                console.error(
                    "Error loading current user:",
                    error
                );
            }
        }

        loadCurrentUser();

    }, []);


    // Load friends belonging to the profile being viewed
    useEffect(() => {
        async function loadFriends() {
            try {
                const response = await fetch(
                    "http://localhost:3000/users"
                );

                if (!response.ok) {
                    throw new Error("Failed to load users");
                }

                const allUsers = await response.json();

                const friendIds = user?.friends || [];

                const userFriends = allUsers.filter(
                    (person) =>
                        friendIds.some(
                            (friendId) =>
                                String(friendId) ===
                                String(person._id)
                        )
                );

                setFriends(userFriends);

            } catch (error) {
                console.error(
                    "Error loading friends:",
                    error
                );
            }
        }

        if (user) {
            loadFriends();
        }

    }, [user]);


    // Load albums belonging to the profile being viewed
    // This is outside useEffect so we can call it again
    // after creating, editing or deleting an album.
    async function loadAlbums() {
        try {
            const response = await fetch(
                "http://localhost:3000/albums"
            );

            if (!response.ok) {
                throw new Error("Failed to load albums");
            }

            const data = await response.json();

            const userAlbums = data.filter(
                (album) =>
                    String(album.userId) === String(id)
            );

            setAlbums(userAlbums);

        } catch (error) {
            console.error(
                "Error loading albums:",
                error
            );
        }
    }


    useEffect(() => {
        loadAlbums();
    }, [id]);


    // Add friend
    async function handleAddFriend() {
        try {
            const response = await fetch(
                `http://localhost:3000/users/${loggedInUser.id}/friends`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        friendId: user._id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setCurrentUser({
                ...currentUser,
                friends: [
                    ...(currentUser.friends || []),
                    user._id
                ]
            });

        } catch (error) {
            console.error(
                "Error adding friend:",
                error
            );
        }
    }


    // Remove friend
    async function handleUnfriend() {
        try {
            const response = await fetch(
                `http://localhost:3000/users/${loggedInUser.id}/friends/${user._id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setCurrentUser({
                ...currentUser,
                friends: currentUser.friends.filter(
                    (friendId) =>
                        String(friendId) !==
                        String(user._id)
                )
            });

        } catch (error) {
            console.error(
                "Error removing friend:",
                error
            );
        }
    }


    // Wait until profile has loaded
    if (!user) {
        return <p>Loading profile...</p>;
    }


    const isOwnProfile =
        String(loggedInUser?.id) === String(user._id);


    const isFriend = currentUser?.friends?.some(
        (friendId) =>
            String(friendId) === String(user._id)
    );


    return (
        <>
            <Navigation />
            <SearchInput />

            <main>

                {editing ? (
                    <EditProfile />
                ) : (
                    <>

                        <Profile
                            user={user}
                            isOwnProfile={isOwnProfile}
                        />


                        {/* Friend / Unfriend */}
                        {!isOwnProfile && currentUser && (
                            isFriend ? (
                                <button
                                    type="button"
                                    onClick={handleUnfriend}
                                >
                                    Unfriend
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAddFriend}
                                >
                                    Add Friend
                                </button>
                            )
                        )}


                        {/* Create post only on your profile */}
                        {isOwnProfile && (
                            <CreatePost />
                        )}


                        <nav>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedSection("posts")
                                }
                            >
                                Posts
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedSection("albums")
                                }
                            >
                                Albums
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedSection("friends")
                                }
                            >
                                Friends
                            </button>

                        </nav>


                        {/* Posts */}
                        {selectedSection === "posts" && (
                            <UserPosts posts={posts} />
                        )}


                        {/* Albums */}
                        {selectedSection === "albums" && (
                            <>

                                {isOwnProfile && (
                                    <CreateAlbum
                                        onAlbumCreated={
                                            loadAlbums
                                        }
                                    />
                                )}

                                <UserAlbums
                                    albums={albums}
                                    isOwnProfile={
                                        isOwnProfile
                                    }
                                    onAlbumChanged={
                                        loadAlbums
                                    }
                                />

                            </>
                        )}


                        {/* Friends */}
                        {selectedSection === "friends" && (
                            <FriendList
                                friends={friends}
                            />
                        )}

                    </>
                )}

            </main>
        </>
    );
}

export default ProfilePage;