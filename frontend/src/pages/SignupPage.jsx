import SignupForm from "../components/SignupForm";

function SignupPage() {
    return (
        <main className="auth-background flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <SignupForm />
            </div>
        </main>
    );
}

export default SignupPage;
