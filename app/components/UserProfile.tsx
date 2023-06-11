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
          <div className="w-14 h-14 bg-slate-500  " />
        )}
        <h3 className="text-3xl my-4">{following.profile.handle}</h3>
        <UserBalance address={following.profile.ownedBy} />
        <p className="text-xl">{following.profile.bio}</p>
      </div>
    </Link>
  );
}

function UserBalance({ address }: { address: string }) {
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
    <div className="flex flex-col">
      <div className="flex flex-col">
        <p className="text-xl">ETH: {balanceEth}</p>
        {loadingEth && <p>Loading...</p>}
        {errorEth && <p>Error: {errorEth}</p>}
      </div>
      <div className="flex flex-col">
        <p className="text-xl">OPTIMISM: {balanceOptimism}</p>
        {loadingOptimism && <p>Loading...</p>}
        {errorOptimism && <p>Error: {errorOptimism}</p>}
      </div>
      <div className="flex flex-col">
        <p className="text-xl">POLYGON: {balancePolygon}</p>
        {loadingPolygon && <p>Loading...</p>}
        {errorPolygon && <p>Error: {errorPolygon}</p>}
      </div>
      <div className="flex flex-col">
        <p className="text-xl">GNO: {balanceGnosis}</p>
        {loadingGnosis && <p>Loading...</p>}
        {errorGnosis && <p>Error: {errorGnosis}</p>}
      </div>
    </div>
  );
}

export default UserProfile;
