import {
  FollowPolicy,
  FollowPolicyType,
  Profile,
} from "@lens-protocol/react-web";

type FollowButtonProps = {
  followee: Profile;
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

export function FollowButton({ followee }: FollowButtonProps) {
  console.log(followee);

  if (followee?.followStatus?.isFollowedByMe) {
    return <p>You are following {followee.handle}</p>;
  }

  return (
    <>
      {followee?.followStatus?.canFollow && (
        <button disabled={!followee?.followStatus?.canFollow}> Follow </button>
      )}
    </>
  );
}
