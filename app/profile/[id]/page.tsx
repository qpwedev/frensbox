"use client";
import { usePathname } from "next/navigation";
import {
  useProfile,
  usePublications,
  Profile,
  useActiveProfile,
} from "@lens-protocol/react-web";
import { formatPicture } from "../../../utils";
import { FollowButton } from "../../components/FollowButton";
import "../../styles/ProfilePage.css";
import UserProfile, { UserBalance } from "@/app/components/UserProfile";

export default function Profile() {
  const pathName = usePathname();
  const handle = pathName?.split("/")[2];

  let { data: profile, loading: loadingProfile } = useProfile({ handle });
  const { data: activeProfile, loading: loadingActive } = useActiveProfile();

  if (loadingProfile || loadingActive)
    return <p className="p-14">Loading ...</p>;

  return (
    <div>
      <div className="profile-page">
        <div className="profile-info">
          <div className="profile-picture-name-bar">
            {profile?.picture?.__typename === "MediaSet" && (
              <img
                width="50"
                height="50"
                alt={profile.handle}
                className="profile-image"
                src={formatPicture(profile.picture)}
              />
            )}
            <h1 className="profile-handle">{profile?.handle}</h1>
          </div>
          {profile?.bio && <h3 className="profile-bio">{profile?.bio}</h3>}
        </div>

        <FollowButton followee={profile!} follower={activeProfile!} />

        <div className="profile-balances">
          {profile && profile.ownedBy && (
            <UserBalance address={profile.ownedBy.toString()} />
          )}
        </div>
        {profile && <Publications profile={profile} />}
      </div>
    </div>
  );
}

function Publications({ profile }: { profile: Profile }) {
  let { data: publications } = usePublications({
    profileId: profile.id,
    limit: 10,
  });
  publications = publications?.map((publication) => {
    if (publication.__typename === "Mirror") {
      return publication.mirrorOf;
    } else {
      return publication;
    }
  });

  return (
    <div className="publications">
      {publications?.map((pub: any, index: number) => (
        <div key={index} className="publication">
          <p>{pub.metadata.content}</p>
          {pub.metadata?.media[0]?.original &&
            ["image/jpeg", "image/png"].includes(
              pub.metadata?.media[0]?.original.mimeType
            ) && (
              <img
                width="400"
                height="400"
                alt={profile.handle}
                className="rounded-xl mt-6 mb-2"
                src={formatPicture(pub.metadata.media[0])}
              />
            )}
        </div>
      ))}
    </div>
  );
}
