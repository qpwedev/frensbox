import {
  FollowPolicy,
  FollowPolicyType,
  Profile,
  ProfileOwnedByMe,
  useFollow,
} from "@lens-protocol/react-web";

type FollowButtonProps = {
  followee: Profile;
  follower: ProfileOwnedByMe;
};

function formatButtonText(policy: FollowPolicy): string {
  switch (policy.type) {
    case FollowPolicyType.ONLY_PROFILE_OWNERS:
    case FollowPolicyType.ANYONE:
      return "Follow";
    case FollowPolicyType.CHARGE:
      return `Pay ${policy.amount.toSignificantDigits(6)} ${
        policy.amount.asset.symbol
      } to follow`;

    default:
      return `You cannot follow`;
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
      {!isPending && (
        <button onClick={follow} disabled={!followee?.followStatus?.canFollow}>
          {formatButtonText(followee.followPolicy)}
        </button>
      )}

      {error && <small>{error.message}</small>}
    </>
  );
}
