
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupForm() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordsMatch = password === confirmPassword;

    async function handleSubmit(event) {
        event.preventDefault();

        if (!passwordsMatch) {
            return;
        }

        const formData = new FormData(event.target);

        const signupData = {
            fullName: formData.get("name"),
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password")
        };

        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(signupData)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            sessionStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home");

        } catch (error) {
            console.error("Signup error:", error);
            alert("Could not connect to the server.");
        }
    }

    const inputStyle =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

    const labelStyle =
        "mb-2 block text-sm font-medium text-slate-700";

    return (
        <section className="font-body">

            <h2 className="text-center text-3xl font-bold text-slate-800">
                Create Your Account
            </h2>

            <p className="mt-2 text-center text-sm text-slate-500">
                Join WonderFrame and start sharing!
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">

                <div>
                    <label htmlFor="name" className={labelStyle}>
                        Full Name
                    </label>

                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        className={inputStyle}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="username" className={labelStyle}>
                        Username
                    </label>

                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Choose a username"
                        minLength="3"
                        className={inputStyle}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className={labelStyle}>
                        Email Address
                    </label>

                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        className={inputStyle}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className={labelStyle}>
                        Password
                    </label>

                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Create a password"
                        minLength="6"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className={inputStyle}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className={labelStyle}>
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className={inputStyle}
                        required
                    />
                </div>

                {!passwordsMatch && (
                    <p className="text-sm text-red-500">
                        Passwords do not match.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!passwordsMatch}
                    className="w-full rounded-lg bg-brand-500 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Create Account
                </button>

            </form>

            <div className="my-6 border-t border-gray-200"></div>

            <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-brand-500 hover:underline"
                >
                    Login
                </Link>
            </p>

        </section>
    );
}

export default SignupForm;
