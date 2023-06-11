"use client";
import {
  Following,
  Profile,
  useExploreProfiles,
  useProfileFollowing,
} from "@lens-protocol/react-web";
import Link from "next/link";
import { formatPicture } from "../utils";
import {
  useWalletLogin,
  useWalletLogout,
  useActiveProfile,
} from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import useEVMBalance, { AvailableChains } from "./hooks/useEVMBalance";
import useGnoBalance from "./hooks/useGnoBalance";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (event: any) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event: any) => {
    event.preventDefault();
  };

  const { execute: login, isPending: isLoginPending } = useWalletLogin();
  const { execute: logout } = useWalletLogout();
  const { data: wallet, loading } = useActiveProfile();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { data: profiles } = useExploreProfiles({
    limit: 25,
  });

  const {
    data: following,
    loading: loadingFollowing,
    hasMore,
    next,
  } = useProfileFollowing({
    walletAddress: wallet?.ownedBy || "",
    limit: 50,
  });

  const { connectAsync } = useConnect({
    connector: new WalletConnectConnector({
      options: {
        projectId: "32919b4dd70531b357d5510cb44dca37",
      },
    }),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();
    if (connector instanceof WalletConnectConnector) {
      const signer = await connector.getSigner();
      await login(signer);
    }
  };

  return (
    <div className="p-20">
      {loading && <p>Loading...</p>}
      {!wallet && !loading && (
        <button
          className="mt-2 px-6 py-1 bg-white text-black rounded"
          disabled={isLoginPending}
          onClick={onLoginClick}
        >
          Sign in
        </button>
      )}
      {wallet && !loading && (
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
      )}

      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search profiles"
          className="mt-2 px-4 py-2 bg-white text-black rounded"
        />
        {searchInput && (
          <Link href={`/profile/${searchInput}.lens`}>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-white text-black rounded"
            >
              Go
            </button>
          </Link>
        )}
      </form>

      <h1 className="text-5xl">My Lens Frens</h1>
      {following?.map((following, index) => (
        <UserProfile following={following} key={index} />
      ))}
    </div>
  );
}

function UserProfile({
  following,
  key,
}: {
  following: Following;
  key: number;
}) {
  console.log();
  return (
    <Link href={`/profile/${following.profile.handle}`} key={key}>
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
