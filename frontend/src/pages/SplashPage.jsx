import LoginForm from "../components/LoginForm";

function SplashPage() {
    return (
        <main>
            <section>
                <h1>WonderFrame</h1>

                <h2>Capture Every Journey. Share Every Story.</h2>

                <p>
                    WanderFrame is a travel photography community where explorers share travel moments, create albums, discover destinations, and connect with fellow travellers.
                </p>

                <div>
                    <p>Share Your Moments</p>
                    <p>Discover New Places</p>
                    <p>Connect & Inspire</p>
                </div>

        
            </section>

            <LoginForm />
        </main>
    );
}

export default SplashPage;