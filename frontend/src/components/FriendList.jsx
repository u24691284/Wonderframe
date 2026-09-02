import ProfilePreview from "./ProfilePreview";

function FriendList({ friends }) {
    return (
        <section>
            <h2>Friends</h2>

            {friends.map((friend) => (
                <ProfilePreview key={friend.id} user={friend} />
            ))}
        </section>
    );
}

export default FriendList;