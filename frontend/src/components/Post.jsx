import PostImage from "./PostImage";
import Comments from "./Comments";
import EditPost from "./EditPost";

function Post() {
    return (
        <article>
            <header>
                <h3>Tamima</h3>
                <p>@tamima929</p>
                <time>2 hours ago</time>
            </header>

            <PostImage />

            <p>Sunset in Pretoria :)</p>
            <p>#sunset #pretoria #photography</p>

            <p>124 likes</p>

            <Comments />

            {/*depending on if it is someone else post or yours, see if this shoudh appear*/}
            <EditPost />
        </article>
    );
}

export default Post;