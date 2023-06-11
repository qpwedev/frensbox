"use client";
import {
  useExploreProfiles,
  useProfileFollowing,
} from "@lens-protocol/react-web";
import Link from "next/link";
import {
  useWalletLogin,
  useWalletLogout,
  useActiveProfile,
} from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import UserProfile from "./components/UserProfile";
import LensExploreProfiles from "./components/LensExploreProfiles";

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

      {/* Wallet connect component WalletConnect */}
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

      {/* Search component  LensProfileSearch*/}
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

      {/* Explore component LensExploreProfiles */}
      <LensExploreProfiles following={following || []} />
    </div>
  );
}
