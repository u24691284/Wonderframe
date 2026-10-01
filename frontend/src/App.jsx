import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import PostPage from "./pages/PostPage";
import SignupForm from "./components/SignupForm";
import EditProfile from "./components/EditProfile";
import CreatePost from "./components/CreatePost";
import LoginForm from "./components/LoginForm";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SplashPage />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/create-post" element={<CreatePost />} />
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;