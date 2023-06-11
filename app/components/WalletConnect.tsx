import Link from "next/link";

type WalletConnectProps = {
  wallet: any;
  loading: boolean;
  isLoginPending: boolean;
  onLoginClick: () => void;
  logout: () => void;
};

type ProfileSummaryProps = {
  wallet: any;
  logout: () => void;
};

type LoginButtonProps = { onLoginClick: () => void; isLoginPending: boolean };

export default function WalletConnect({
  wallet,
  loading,
  isLoginPending,
  onLoginClick,
  logout,
}: WalletConnectProps) {
  if (!wallet && !loading) {
    return (
      <ConnecPage onLoginClick={onLoginClick} isLoginPending={isLoginPending} />
    );
  } else if (wallet && !loading) {
    return <ProfileSummary wallet={wallet} logout={logout} />;
  }
  return <></>;
}

function ConnecPage({ onLoginClick, isLoginPending }: LoginButtonProps) {
  return <div></div>;
}

function ProfileSummary({ wallet, logout }: ProfileSummaryProps) {
  return (
    <div>
      <Link href={`/profile/${wallet.handle}`}>
        <h3 className="text-3xl">{wallet.handle}</h3>
      </Link>
      <p>{wallet.bio}</p>

      <button
        onClick={logout}
        className="mt-2 px-6 py-1 bg-white text-black rounded"
      >
        Sign out
      </button>
    </div>
  );
}
