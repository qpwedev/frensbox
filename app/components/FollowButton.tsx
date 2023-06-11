import {
  FollowPolicy,
  FollowPolicyType,
  FollowStatus,
  Profile,
  ProfileOwnedByMe,
  useFollow,
} from "@lens-protocol/react-web";

type FollowButtonProps = {
  followee: Profile;
  follower: ProfileOwnedByMe;
};

function formatButtonText(
  policy: FollowPolicy,
  followStatus: FollowStatus
): string {
  console.log(policy, followStatus);

  if (followStatus?.isFollowedByMe === true) {
    return "FOLLOWING";
  }

  switch (policy.type) {
    case FollowPolicyType.ONLY_PROFILE_OWNERS:
    case FollowPolicyType.ANYONE:
      return "FOLLOW";
    case FollowPolicyType.CHARGE:
      return `PAY ${policy.amount.toSignificantDigits(6)} ${
        policy.amount.asset.symbol
      } TO FOLLOW`;

    default:
      return `YOU CANNOT FOLLOW`;
  }
}

export function FollowButton({ followee, follower }: FollowButtonProps) {
  const {
    execute: follow,
    error,
    isPending,
  } = useFollow({ followee, follower });

  console.log(followee);
  console.log(followee?.followStatus?.canFollow);
  console.log(isPending);

  return (
    <>
      {!isPending && followee?.followStatus && (
        <button
          className="follow-button"
          onClick={follow}
          disabled={!followee?.followStatus?.canFollow}
        >
          {formatButtonText(followee.followPolicy, followee.followStatus!)}
        </button>
      )}

      {error && <small>{error.message}</small>}
    </>
  );
}
