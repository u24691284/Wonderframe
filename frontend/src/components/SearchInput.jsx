function SearchInput() {
    return (
        <section>
            <form>
                <label htmlFor="search">Search WonderFrame</label><br />
                <input type="search" id="search" name="search" placeholder="Search..." />

                <button type="submit">Search</button>
            </form>
        </section>
    );
}

export default SearchInput;