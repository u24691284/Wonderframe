import PostPreview from "./PostPreview";

function Feed() {
    return (
        <section>
            <h2>Feed</h2>

            <div>
                <button type="button">Local Feed</button>
                <button type="button">Global Feed</button>
            </div>

            <p>Posts from you and your friends</p>

            <PostPreview />
            <PostPreview />
            <PostPreview />
        </section>
    );
}

export default Feed;