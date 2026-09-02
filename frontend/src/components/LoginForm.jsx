import { Link } from "react-router-dom";

function LoginForm() {
        const handleSubmit = async (event) => {
        event.preventDefault();
console.log("FORM SUBMITTED")
        const formData = new FormData(event.target);

        const loginData = {
            email: formData.get("email"),
            password: formData.get("password")
        };

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        console.log(data);
    };

    return (
        <section>
            <h2>Welcome Back!</h2>
            <p>Login to continue your adventure</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email Address</label><br />
                <input type="email" id="email" name="email" required /><br />

                <label htmlFor="password">Password</label><br />
                <input type="password" id="password" name="password" minLength="6" required /><br />

                <label>
                    <input type="checkbox" name="remember" />
                    Remember me
                </label>

                <button type="button">Forgot Password?</button><br />

                <button type="submit">Login</button>
            </form>

            <hr />

            <p>or</p>

            <Link to="/signup">Create Your Account</Link>
            <p>Join WonderFrame and start sharing!</p>
        </section>
    );
}

export default LoginForm;