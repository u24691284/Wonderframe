
import { Link } from "react-router-dom";

function SplashPage() {
    return (
        <main className="auth-background flex min-h-screen items-center justify-center bg-cover bg-center p-6">
            <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">

                {/* LEFT SIDE */}
                <section className="text-center text-white lg:text-left">

                    <h1 className="font-display text-5xl font-bold md:text-7xl">
                        WonderFrame
                    </h1>

                    <h2 className="mt-4 text-xl font-medium italic text-cyan-200">
                        Capture Every Journey. Share Every Story.
                    </h2>

                    <p className="mt-6 max-w-lg leading-8">
                        WonderFrame is a travel photography
                        community where explorers share travel
                        moments, create albums, discover
                        destinations, and connect with fellow
                        travellers.
                    </p>

                    <div className="mt-10 space-y-4 font-medium">
                        <p>📷 Share Your Moments</p>
                        <p>📍 Discover New Places</p>
                        <p>♡ Connect & Inspire</p>
                    </div>
                </section>

                {/* RIGHT SIDE */}
                <section className="rounded-2xl bg-white/95 p-8 text-center shadow-2xl md:p-12">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Your Adventure Starts Here
                    </h2>

                    <p className="mt-4 text-sm text-slate-500">
                        Join our community and start sharing
                        your favourite travel memories.
                    </p>

                    <Link
                        to="/login"
                        className="mt-8 block rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600"
                    >
                        Login
                    </Link>

                    <Link
                        to="/signup"
                        className="mt-4 block rounded-lg border-2 border-brand-500 px-6 py-3 font-semibold text-brand-500 transition hover:bg-brand-100"
                    >
                        Create Your Account
                    </Link>

                </section>
            </div>
        </main>
    );
}

export default SplashPage;
