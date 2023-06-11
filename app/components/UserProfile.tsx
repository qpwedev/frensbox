import { Following } from "@lens-protocol/react-web";
import Link from "next/link";
import useEVMBalance, { AvailableChains } from "../hooks/useEVMBalance";
import useGnoBalance from "../hooks/useGnoBalance";
import { formatPicture } from "@/utils";

function UserProfile({ following }: { following: Following }) {
  console.log();
  return (
    <Link href={`/profile/${following.profile.handle}`}>
      <div className="my-14">
        {following.profile.picture &&
        following.profile.picture.__typename === "MediaSet" ? (
          <img
            src={formatPicture(following.profile.picture)}
            width="120"
            height="120"
            alt={following.profile.handle}
          />
        ) : (
          <div className="w-14 h-14 bg-slate-500" />
        )}
        <h3 className="text-3xl my-4">{following.profile.handle}</h3>
        <p className="text-xl">{following.profile.bio}</p>
        <UserBalance address={following.profile.ownedBy} />
      </div>
    </Link>
  );
}

export function UserBalance({ address }: { address: string }) {
  const {
    balance: balanceEth,
    loading: loadingEth,
    error: errorEth,
  } = useEVMBalance(address, "ethereum" as AvailableChains);

  const {
    balance: balanceOptimism,
    loading: loadingOptimism,
    error: errorOptimism,
  } = useEVMBalance(address, "optimism" as AvailableChains);

  const {
    balance: balancePolygon,
    loading: loadingPolygon,
    error: errorPolygon,
  } = useEVMBalance(address, "polygon" as AvailableChains);

  const {
    balance: balanceGnosis,
    loading: loadingGnosis,
    error: errorGnosis,
  } = useGnoBalance(address);

  return (
    <div className="wallets-profile">
      <div className="colu">
        <p className="wallet-balance">
          ETH: {parseFloat(balanceEth).toFixed(2)}
        </p>
        {loadingEth && <p></p>}
        {errorEth && <p>Error: {errorEth}</p>}
      </div>
      <div className="colu">
        <p className="wallet-balance">
          OPTIMISM: {parseFloat(balanceOptimism).toFixed(2)}
        </p>
        {loadingOptimism && <p></p>}
        {errorOptimism && <p>Error: {errorOptimism}</p>}
      </div>
      <div className="colu">
        <p className="wallet-balance">
          POLYGON: {parseFloat(balancePolygon).toFixed(2)}
        </p>
        {loadingPolygon && <p></p>}
        {errorPolygon && <p>Error: {errorPolygon}</p>}
      </div>
      <div className="colu">
        <p className="wallet-balance">
          GNO: {parseFloat(balanceGnosis).toFixed(2)}
        </p>
        {loadingGnosis && <p></p>}
        {errorGnosis && <p>Error: {errorGnosis}</p>}
      </div>
    </div>
  );
}

export default UserProfile;
