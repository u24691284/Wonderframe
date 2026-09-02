import { Link } from "react-router-dom";
import profileImage from "../assets/profile.png";
import postImage from "../assets/posts.png";

function PostPreview() {
    return (
        <article>
            <header>
                <img src={profileImage} alt="Profile" />

                <div>
                    <h3>Tamima</h3>
                    <p>@tamima929</p>
                    <time>2 hours ago</time>
                </div>
            </header>

            <Link to="/post/1">
                <img src={postImage} alt="Sunset in Pretoria" />
            </Link>

            <p>Sunset in Pretoria :)</p>
            <p>#sunset #pretoria #photography</p>

            <section>
                <p>4 comments</p>
                <p>Layla: So pretty!</p>
                <p>Kiara: Love this!</p>
            </section>
        </article>
    );
}

export default PostPreview;