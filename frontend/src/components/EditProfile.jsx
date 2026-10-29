
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navigation from "../components/Navigation";
import defaultProfileImage from "../assets/profile.png";

function EditProfile() {
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    const [fullName, setFullName] = useState(loggedInUser?.fullName || "");
    const [username, setUsername] = useState(loggedInUser?.username || "");
    const [email, setEmail] = useState(loggedInUser?.email || "");
    const [profileImage, setProfileImage] = useState(
        loggedInUser?.profileImage || ""
    );

    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // load the latest profile from mongodb
    useEffect(() => {
        if (!loggedInUser?.id) return;

        async function loadProfile() {
            try {
                const response = await fetch(
                    `http://localhost:3000/users/${loggedInUser.id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load profile");
                }

                const user = await response.json();

                setFullName(user.fullName || "");
                setUsername(user.username || "");
                setEmail(user.email || "");
                setProfileImage(user.profileImage || "");

            } catch (error) {
                console.error("Error loading profile:", error);
            }
        }

        loadProfile();
    }, [loggedInUser?.id]);

    // convert the selected image to base64
    function handleImageChange(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage("Please select an image smaller than 5 MB.");
            event.target.value = "";
            return;
        }

        setMessage("");

        const reader = new FileReader();

        reader.onload = () => {
            setProfileImage(reader.result);
        };

        reader.onerror = () => {
            setMessage("Failed to read the selected image.");
        };

        reader.readAsDataURL(file);
    }

    // update profile
    async function handleSubmit(event) {
        event.preventDefault();

        if (!loggedInUser?.id) {
            setMessage("Please log in again.");
            return;
        }

        setIsSaving(true);
        setMessage("");

        try {
            const response = await fetch(
                `http://localhost:3000/users/${loggedInUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fullName,
                        username,
                        email,
                        profileImage
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to update profile.");
                return;
            }

            // keep local storage small by storing only account details
            const updatedUser = {
                ...loggedInUser,
                fullName,
                username,
                email
            };

            delete updatedUser.profileImage;

            sessionStorage.setItem("user", JSON.stringify(updatedUser));

            navigate(`/profile/${loggedInUser.id}`);

        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Something went wrong.");
        } finally {
            setIsSaving(false);
        }
    }

    // delete profile
    async function handleDelete() {
        if (!loggedInUser?.id) return;

        const confirmDelete = window.confirm(
            "Are you sure you want to delete your profile? This action cannot be undone."
        );

        if (!confirmDelete) return;

        setIsDeleting(true);
        setMessage("");

        try {
            const response = await fetch(
                `http://localhost:3000/users/${loggedInUser.id}`,
                { method: "DELETE" }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to delete profile.");
                return;
            }

            sessionStorage.removeItem("user")
            navigate("/");

        } catch (error) {
            console.error("Error deleting profile:", error);
            setMessage("Something went wrong.");
        } finally {
            setIsDeleting(false);
        }
    }

    const inputStyle =
        "w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100";

    const labelStyle =
        "mb-2 block text-sm font-semibold text-slate-700";

    return (
        <div className="min-h-screen bg-slate-50 font-body">
            <Navigation />

            {/* main content */}
            <main className="min-w-0 px-4 py-8 md:ml-60 md:px-8">
                <div className="mx-auto w-full max-w-2xl space-y-6">

                    {/* page heading */}
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-800">
                            Edit Profile
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Manage your personal information on WonderFrame.
                        </p>
                    </div>

                    {/* profile card */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* profile header */}
                        <div className="flex flex-col items-center border-b border-slate-100 bg-brand-100/40 px-6 py-8">
                            <img
                                src={profileImage || defaultProfileImage}
                                alt="Profile preview"
                                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                            />

                            <h2 className="mt-4 text-xl font-bold text-slate-800">
                                {fullName || "Your Profile"}
                            </h2>

                            <p className="mt-1 text-sm text-brand-600">
                                @{username}
                            </p>
                        </div>

                        {/* edit form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6 md:p-8"
                        >

                            {/* profile image upload */}
                            <div>
                                <label
                                    htmlFor="profileImage"
                                    className={labelStyle}
                                >
                                    Profile Picture
                                </label>

                                <input
                                    type="file"
                                    id="profileImage"
                                    name="profileImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-brand-100 bg-slate-50 p-4 text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-100 file:px-4 file:py-2 file:font-semibold file:text-brand-600 hover:file:bg-brand-500 hover:file:text-white"
                                />

                                <p className="mt-2 text-xs text-slate-400">
                                    Choose a JPG, PNG or other image up to 5 MB.
                                </p>
                            </div>

                            {/* full name */}
                            <div>
                                <label htmlFor="name" className={labelStyle}>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    id="name"
                                    value={fullName}
                                    onChange={(event) =>
                                        setFullName(event.target.value)
                                    }
                                    required
                                    className={inputStyle}
                                />
                            </div>

                            {/* username */}
                            <div>
                                <label htmlFor="username" className={labelStyle}>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    required
                                    className={inputStyle}
                                />
                            </div>

                            {/* email */}
                            <div>
                                <label htmlFor="email" className={labelStyle}>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                    className={inputStyle}
                                />
                            </div>

                            {/* save button */}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>

                            {/* cancel button */}
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/profile/${loggedInUser.id}`)
                                }
                                className="w-full rounded-xl border-2 border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            {/* status message */}
                            {message && (
                                <p
                                    role="alert"
                                    className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                                >
                                    {message}
                                </p>
                            )}
                        </form>
                    </section>

                    {/* delete profile */}
                    <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800">
                            Delete Account
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Permanently delete your WonderFrame profile.
                            This action cannot be undone.
                        </p>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete Profile"}
                        </button>
                    </section>

                </div>
            </main>
        </div>
    );
}

export default EditProfile;
