
import SignupForm from "../components/SignupForm";
import splashImage from "../assets/splash_page.jpg";

function SignupPage() {
    return (
        <main
            className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10"
            style={{ backgroundImage: `linear-gradient(rgba(0,30,40,0.35), rgba(0,30,40,0.45)), url(${splashImage})` }}
        >
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <SignupForm />
            </div>
        </main>
    );
}

export default SignupPage;
