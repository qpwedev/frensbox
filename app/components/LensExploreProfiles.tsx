import { Following } from "@lens-protocol/react-web";
import UserProfile from "./UserProfile";

export default function LensExploreProfiles({
  following,
}: {
  following: Following[];
}) {
  return (
    <div className="explore-profiles">
      <h1>My Lens Frens</h1>
      {following?.map((following, index) => (
        <UserProfile following={following} key={index} />
      ))}
    </div>
  );
}
