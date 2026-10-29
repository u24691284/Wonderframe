
import LoginForm from "../components/LoginForm";
import splashImage from "../assets/splash_page.jpg";

function LoginPage() {
    return (
        <main
            className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10"
            style={{ backgroundImage: `linear-gradient(rgba(0,30,40,0.35), rgba(0,30,40,0.45)), url(${splashImage})` }}
        >
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <LoginForm />
            </div>
        </main>
    );
}

export default LoginPage;
