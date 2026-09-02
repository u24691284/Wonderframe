import { useState } from "react";

import Navigation from "../components/Navigation";
import Profile from "../components/Profile";
import EditProfile from "../components/EditProfile";
import UserPosts from "../components/UserPosts";
import UserAlbums from "../components/UserAlbums";
import FriendList from "../components/FriendList";
import SearchInput from "../components/SearchInput";
import CreatePost from "../components/CreatePost";

function ProfilePage() {
    const [selectedSection, setSelectedSection] = useState("posts");
    const [editing, setEditing] = useState(false);

    const user = {
        name: "Lisa Harrus",
        username: "@username",
        pronouns: "she/her",
        bio: "This is my BIO.",
        socialLink: "links to other sites",
        posts: 234,
        albums: 234,
        friends: 234
    };

    const posts = [
        {
            id: 1,
            name: "Tamima",
            username: "@tamima929",
            time: "2 hours ago",
            caption: "Sunset in Pretoria :)",
            hashtags: "#sunset #pretoria #photography"
        },
        {
            id: 2,
            name: "Tamima",
            username: "@tamima929",
            time: "Yesterday",
            caption: "Another post",
            hashtags: "#photo"
        },
        {
            id: 3,
            name: "Tamima",
            username: "@tamima929",
            time: "2 days ago",
            caption: "Weekend memories",
            hashtags: "#weekend"
        }
    ];

    const albums = [
        {
            id: 1,
            name: "Vacation 2026",
            photos: 12
        },
        {
            id: 2,
            name: "Cape Town",
            photos: 8
        },
        {
            id: 3,
            name: "My Favourites",
            photos: 15
        }
    ];

    const friends = [
        {
            id: 1,
            name: "Layla",
            username: "@layla",
            pronouns: "she/her"
        },
        {
            id: 2,
            name: "Kiara",
            username: "@kiara",
            pronouns: "she/her"
        },
        {
            id: 3,
            name: "Sarah",
            username: "@sarah",
            pronouns: "she/her"
        }
    ];

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
                            onEdit={() => setEditing(true)}
                        />

                        <CreatePost />

                        <nav>
                            <button
                                type="button"
                                onClick={() => setSelectedSection("posts")}
                            >
                                Posts
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedSection("albums")}
                            >
                                Albums
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedSection("friends")}
                            >
                                Friends
                            </button>
                        </nav>

                        {selectedSection === "posts" && (
                            <UserPosts posts={posts} />
                        )}

                        {selectedSection === "albums" && (
                            <UserAlbums albums={albums} />
                        )}

                        {selectedSection === "friends" && (
                            <FriendList friends={friends} />
                        )}
                    </>
                )}
            </main>
        </>
    );
}

export default ProfilePage;