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
import LensExploreProfiles from "./components/LensExploreProfiles";
import LensProfileSearch from "./components/LensProfileSearch";
import WalletConnect from "./components/WalletConnect";

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

      <WalletConnect
        isLoginPending={isLoginPending}
        onLoginClick={onLoginClick}
        wallet={wallet}
        loading={loading}
        logout={logout}
      />

      <LensProfileSearch
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        searchInput={searchInput}
      />

      <LensExploreProfiles following={following || []} />
    </div>
  );
}
