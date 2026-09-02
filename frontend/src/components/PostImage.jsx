import postImage from "../assets/posts.png";

function PostImage() {
    return (
        <div>
            <img
                src={postImage}
                alt="Sunset in Pretoria"
            />
        </div>
    );
}

export default PostImage;