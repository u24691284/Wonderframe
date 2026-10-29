
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const loginData = {
            email: formData.get("email"),
            password: formData.get("password")
        };

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            sessionStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home");

        } catch (error) {
            console.error("Login error:", error);
            alert("Could not connect to the server.");
        }
    };

    return (
        <section className="font-body">

            <h2 className="text-center text-3xl font-bold text-slate-800">
                Welcome Back!
            </h2>

            <p className="mt-2 text-center text-sm text-slate-500">
                Login to continue your adventure
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Email Address
                    </label>

                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        minLength="6"
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">

                    <label className="flex items-center gap-2 text-slate-600">
                        <input
                            type="checkbox"
                            name="remember"
                            className="accent-brand-500"
                        />
                        Remember me
                    </label>

                    <button
                        type="button"
                        className="font-medium text-brand-500 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-brand-500 py-3 font-semibold text-white transition hover:bg-brand-600"
                >
                    Login
                </button>

            </form>

            <div className="my-7 flex items-center gap-4">
                <hr className="flex-1 border-gray-200" />
                <span className="text-sm text-gray-400">or</span>
                <hr className="flex-1 border-gray-200" />
            </div>

            <div className="text-center">
                <Link
                    to="/signup"
                    className="text-lg font-semibold text-slate-800 hover:text-brand-500"
                >
                    Create Your Account
                </Link>

                <p className="mt-2 text-sm text-slate-500">
                    Join WonderFrame and start sharing!
                </p>
            </div>

        </section>
    );
}

export default LoginForm;
