
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import PostPage from "./pages/PostPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

import Navigation from "./components/Navigation";
import EditProfile from "./components/EditProfile";
import CreatePost from "./components/CreatePost";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SplashPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />

                {/* create post page */}
                <Route
                    path="/create-post"
                    element={
                        <div className="min-h-screen bg-slate-50 font-body">
                            <Navigation />

                            <main className="min-w-0 px-4 py-8 md:ml-60 md:px-8">
                                <div className="mx-auto w-full max-w-2xl">
                                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                                        <CreatePost />
                                    </section>
                                </div>
                            </main>
                        </div>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
