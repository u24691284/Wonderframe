function UserAlbums({ albums }) {
    return (
        <section>
            <h2>Albums</h2>

            {albums.map((album) => (
                <article key={album.id}>
                    <h3>{album.name}</h3>
                    <p>{album.photos} photos</p>
                </article>
            ))}
        </section>
    );
}

export default UserAlbums;