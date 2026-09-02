import { Link } from "react-router-dom";
import profileImage from "../assets/profile.png";
import postImage from "../assets/posts.png";

function PostPreview({ post }) {
    return (
        <article>
            <header>
                <img src={profileImage} alt="Profile" />

                <div>
                    <h3>{post.name}</h3>
                    <p>{post.username}</p>
                    <time>{post.time}</time>
                </div>
            </header>

            <Link to={`/post/${post.id}`}>
                <img src={postImage} alt={post.caption} />
            </Link>

            <p>{post.caption}</p>
            <p>{post.hashtags}</p>

            <section>
                <p>4 comments</p>
                <p>Layla: So pretty!</p>
                <p>Kiara: Love this!</p>
            </section>
        </article>
    );
}

export default PostPreview;