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

    return (
        <>
            <Navigation />
            <SearchInput />

            <main>
                {editing ? (
                    <EditProfile />
                ) : (
                    <>
                        <Profile  />

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

                        {selectedSection === "posts" && <UserPosts />}
                        {selectedSection === "albums" && <UserAlbums />}
                        {selectedSection === "friends" && <FriendList />}
                    </>
                )}
            </main>
        </>
    );
}

export default ProfilePage;