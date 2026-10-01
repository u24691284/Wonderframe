import { useState } from "react";
import { Link } from "react-router-dom";

function SearchInput() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    async function handleSearch(event) {
        event.preventDefault();

        if (!search.trim()) {
            setResults([]);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/users");

            if (!response.ok) {
                throw new Error("Failed to search users");
            }

            const users = await response.json();

            const filteredUsers = users.filter((user) =>
                user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                user.username.toLowerCase().includes(search.toLowerCase())
            );

            setResults(filteredUsers);

        } catch (error) {
            console.error("Error searching users:", error);
        }
    }

    return (
        <section>
            <form onSubmit={handleSearch}>
                <label htmlFor="search">Search WonderFrame</label><br />

                <input
                    type="search"
                    id="search"
                    name="search"
                    placeholder="Search..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <button type="submit">Search</button>
            </form>

            {results.map((user) => (
                <div key={user._id}>
                    <Link to={`/profile/${user._id}`}>
                        {user.fullName} (@{user.username})
                    </Link>
                </div>
            ))}
        </section>
    );
}

export default SearchInput;