import { Link } from "react-router-dom";

function LoginForm() {
    return (
        <section>
            <h2>Welcome Back!</h2>
            <p>Login to continue your adventure</p>

            <form>
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