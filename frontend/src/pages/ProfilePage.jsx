
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Navigation from "../components/Navigation";
import Profile from "../components/Profile";
import UserPosts from "../components/UserPosts";
import UserAlbums from "../components/UserAlbums";
import FriendList from "../components/FriendList";
import SearchInput from "../components/SearchInput";
import CreatePost from "../components/CreatePost";
import CreateAlbum from "../components/CreateAlbum";

const API = "http://localhost:3000";

function ProfilePage() {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const loggedInUser = JSON.parse(sessionStorage.getItem("user") || "null");
    const loggedInUserId = loggedInUser?.id;

    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [friendBusy, setFriendBusy] = useState(false);
    const [friendError, setFriendError] = useState("");

    // get the selected section from the url
    const tab = searchParams.get("tab");
    const selectedSection = ["posts", "albums", "friends"].includes(tab)
        ? tab
        : "posts";

    // change the selected section
    function changeSection(section) {
        if (section === "posts") {
            setSearchParams({});
        } else {
            setSearchParams({ tab: section });
        }
    }

    // load profile
    useEffect(() => {
        let active = true;
        setUser(null);
        setFriendError("");

        async function loadUser() {
            try {
                const response = await fetch(`${API}/users/${id}`);

                if (!response.ok) {
                    throw new Error("Failed to load user");
                }

                const data = await response.json();

                if (active) setUser(data);
            } catch (error) {
                console.error("Error loading user:", error);
            }
        }

        loadUser();

        return () => {
            active = false;
        };
    }, [id]);

    // load posts
    useEffect(() => {
        let active = true;

        async function loadPosts() {
            try {
                const response = await fetch(`${API}/posts`);

                if (!response.ok) {
                    throw new Error("Failed to load posts");
                }

                const data = await response.json();

                if (active) {
                    setPosts(
                        data.filter(
                            (post) => String(post.userId) === String(id)
                        )
                    );
                }
            } catch (error) {
                console.error("Error loading profile posts:", error);
            }
        }

        loadPosts();

        return () => {
            active = false;
        };
    }, [id]);

    // load the logged-in user
    useEffect(() => {
        if (!loggedInUserId) {
            setCurrentUser(null);
            return;
        }

        let active = true;

        async function loadCurrentUser() {
            try {
                const response = await fetch(
                    `${API}/users/${loggedInUserId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load current user");
                }

                const data = await response.json();

                if (active) setCurrentUser(data);
            } catch (error) {
                console.error("Error loading current user:", error);
            }
        }

        loadCurrentUser();

        return () => {
            active = false;
        };
    }, [loggedInUserId]);

    // load all users for friends and requests
    useEffect(() => {
        let active = true;

        async function loadAllUsers() {
            try {
                const response = await fetch(`${API}/users`);

                if (!response.ok) {
                    throw new Error("Failed to load users");
                }

                const data = await response.json();

                if (active) setAllUsers(data);
            } catch (error) {
                console.error("Error loading friends:", error);
            }
        }

        loadAllUsers();

        return () => {
            active = false;
        };
    }, []);

    // load albums
    async function loadAlbums() {
        try {
            const response = await fetch(`${API}/albums`);

            if (!response.ok) {
                throw new Error("Failed to load albums");
            }

            const data = await response.json();

            setAlbums(
                data.filter(
                    (album) => String(album.userId) === String(id)
                )
            );
        } catch (error) {
            console.error("Error loading albums:", error);
        }
    }

    useEffect(() => {
        loadAlbums();
    }, [id]);

    // refresh both user records after a friendship change
    async function refreshFriendship() {
        const [profileResponse, currentResponse] = await Promise.all([
            fetch(`${API}/users/${id}`),
            fetch(`${API}/users/${loggedInUserId}`)
        ]);

        if (!profileResponse.ok || !currentResponse.ok) {
            throw new Error("Failed to refresh friendship information");
        }

        const [profileData, currentData] = await Promise.all([
            profileResponse.json(),
            currentResponse.json()
        ]);

        setUser(profileData);
        setCurrentUser(currentData);
    }

    // send a friend request
    async function handleAddFriend() {
        if (!loggedInUserId || !user || friendBusy) return;

        setFriendBusy(true);
        setFriendError("");

        try {
            const response = await fetch(
                `${API}/users/${loggedInUserId}/friend-requests`,
                {
                    method: "POST",
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
                throw new Error(data.message || "Failed to send request");
            }

            await refreshFriendship();
        } catch (error) {
            setFriendError(error.message);
        } finally {
            setFriendBusy(false);
        }
    }

    // accept or reject a friend request
    async function handleRequest(senderId, accept) {
        if (!loggedInUserId || friendBusy) return;

        setFriendBusy(true);
        setFriendError("");

        try {
            const response = await fetch(
                `${API}/users/${loggedInUserId}/friend-requests/${senderId}`,
                {
                    method: accept ? "PUT" : "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Request failed");
            }

            await refreshFriendship();
        } catch (error) {
            setFriendError(error.message);
        } finally {
            setFriendBusy(false);
        }
    }

    // cancel a sent friend request
    async function handleCancelRequest() {
        if (!loggedInUserId || !user || friendBusy) return;

        setFriendBusy(true);
        setFriendError("");

        try {
            const response = await fetch(
                `${API}/users/${user._id}/friend-requests/${loggedInUserId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to cancel request");
            }

            await refreshFriendship();
        } catch (error) {
            setFriendError(error.message);
        } finally {
            setFriendBusy(false);
        }
    }

    // remove a friend
    async function handleUnfriend() {
        if (!loggedInUserId || !user || friendBusy) return;

        setFriendBusy(true);
        setFriendError("");

        try {
            const response = await fetch(
                `${API}/users/${loggedInUserId}/friends/${user._id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to remove friend");
            }

            await refreshFriendship();
        } catch (error) {
            setFriendError(error.message);
        } finally {
            setFriendBusy(false);
        }
    }

    // check profile ownership and friendship status
    const isOwnProfile =
        user &&
        String(loggedInUserId) === String(user._id);

    const isFriend = currentUser?.friends?.some(
        (friendId) => String(friendId) === String(user?._id)
    );

    const requestSent = user?.friendRequests?.some(
        (requestId) => String(requestId) === String(loggedInUserId)
    );

    const requestReceived = currentUser?.friendRequests?.some(
        (requestId) => String(requestId) === String(user?._id)
    );

    // find incoming requests for the logged-in user
    const incomingRequests = allUsers.filter((person) =>
        currentUser?.friendRequests?.some(
            (requestId) => String(requestId) === String(person._id)
        )
    );

    // find the friends of the viewed profile
    const friends = allUsers.filter((person) =>
        user?.friends?.some(
            (friendId) => String(friendId) === String(person._id)
        )
    );

    return (
        <div className="min-h-screen bg-slate-50 font-body">
            {/* navigation */}
            <Navigation />

            {/* main content */}
            <main className="min-w-0 px-4 py-8 md:ml-60 md:px-8">
                <div className="mx-auto w-full max-w-4xl space-y-6">

                    {/* search */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-3 text-lg font-semibold text-slate-800">
                            Explore WonderFrame
                        </h2>
                        <SearchInput />
                    </section>

                    {!user ? (
                        <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
                            Loading profile...
                        </div>
                    ) : (
                        <>
                            {/* profile header */}
                            <Profile
                                user={user}
                                isOwnProfile={isOwnProfile}
                            />

                            {/* friend request controls */}
                            {!isOwnProfile && currentUser && (
                                <div className="flex flex-wrap gap-3">
                                    {isFriend ? (
                                        <button
                                            type="button"
                                            onClick={handleUnfriend}
                                            disabled={friendBusy}
                                            className="rounded-lg border-2 border-brand-500 px-6 py-2 font-semibold text-brand-600 transition hover:bg-brand-100 disabled:opacity-50"
                                        >
                                            Unfriend
                                        </button>
                                    ) : requestReceived ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRequest(user._id, true)
                                                }
                                                disabled={friendBusy}
                                                className="rounded-lg bg-brand-500 px-6 py-2 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
                                            >
                                                Accept Request
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRequest(user._id, false)
                                                }
                                                disabled={friendBusy}
                                                className="rounded-lg border border-slate-200 px-6 py-2 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : requestSent ? (
                                        <button
                                            type="button"
                                            onClick={handleCancelRequest}
                                            disabled={friendBusy}
                                            className="rounded-lg border-2 border-brand-500 px-6 py-2 font-semibold text-brand-600 transition hover:bg-brand-100 disabled:opacity-50"
                                        >
                                            Request Pending — Cancel
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleAddFriend}
                                            disabled={friendBusy}
                                            className="rounded-lg bg-brand-500 px-6 py-2 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
                                        >
                                            Send Friend Request
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* friendship errors */}
                            {friendError && (
                                <p
                                    role="alert"
                                    className="text-sm font-medium text-red-600"
                                >
                                    {friendError}
                                </p>
                            )}

                            {/* create post */}
                            {isOwnProfile && selectedSection === "posts" && (
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <CreatePost />
                                </section>
                            )}

                            {/* profile tabs */}
                            <nav
                                id="profile-tabs"
                                className="flex gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
                            >
                                {["posts", "albums", "friends"].map(
                                    (section) => (
                                        <button
                                            key={section}
                                            type="button"
                                            onClick={() => changeSection(section)}
                                            className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold capitalize transition ${
                                                selectedSection === section
                                                    ? "bg-brand-500 text-white shadow-sm"
                                                    : "text-slate-600 hover:bg-brand-100 hover:text-brand-600"
                                            }`}
                                        >
                                            {section}
                                        </button>
                                    )
                                )}
                            </nav>

                            {/* posts */}
                            {selectedSection === "posts" && (
                                <section>
                                    <UserPosts posts={posts} />
                                </section>
                            )}

                            {/* albums */}
                            {selectedSection === "albums" && (
                                <section className="space-y-6">
                                    {isOwnProfile && (
                                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                            <CreateAlbum
                                                onAlbumCreated={loadAlbums}
                                            />
                                        </div>
                                    )}

                                    <UserAlbums
                                        albums={albums}
                                        isOwnProfile={isOwnProfile}
                                        onAlbumChanged={loadAlbums}
                                    />
                                </section>
                            )}

                            {/* friends and incoming requests */}
                            {selectedSection === "friends" && (
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                    {isOwnProfile && (
                                        <div className="mb-6 space-y-3">
                                            <h3 className="text-lg font-semibold text-slate-800">
                                                Friend Requests ({incomingRequests.length})
                                            </h3>

                                            {incomingRequests.length === 0 ? (
                                                <p className="text-sm text-slate-500">
                                                    No pending friend requests.
                                                </p>
                                            ) : (
                                                incomingRequests.map((person) => (
                                                    <div
                                                        key={person._id}
                                                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                                                    >
                                                        <div>
                                                            <p className="font-semibold text-slate-800">
                                                                {person.fullName}
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                @{person.username}
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRequest(person._id, true)
                                                                }
                                                                disabled={friendBusy}
                                                                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
                                                            >
                                                                Accept
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRequest(person._id, false)
                                                                }
                                                                disabled={friendBusy}
                                                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    <FriendList friends={friends} />
                                </section>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ProfilePage;
