import { useState } from "react";
import { Link } from "react-router-dom";

function SignupForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordsMatch = password === confirmPassword;

    function handleSubmit(event) {
        if (!passwordsMatch) {
            event.preventDefault();
        }
    }

    return (
        <section>
            <h2>Create Your Account</h2>
            <p>Join WonderFrame and start sharing!</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Full Name</label><br />
                <input type="text" id="name" name="name" required /><br />

                <label htmlFor="username">Username</label><br />
                <input type="text" id="username" name="username" minLength="3" required /><br />

                <label htmlFor="email">Email Address</label><br />
                <input type="email" id="email" name="email" required /><br />

                <label htmlFor="password">Password</label><br />
                <input
                    type="password"
                    id="password"
                    name="password"
                    minLength="6"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                /><br />

                <label htmlFor="confirmPassword">Confirm Password</label><br />
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                /><br />

                {!passwordsMatch && (<p>Passwords do not match.</p>)}

                <button type="submit" disabled={!passwordsMatch}>
                    Create Account
                </button>
            </form>

            <hr />

            <p>Already have an account?</p>
            <Link to="/">Login</Link>
        </section>
    );
}

export default SignupForm;