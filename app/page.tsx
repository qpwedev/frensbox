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
import { useState, useEffect } from "react";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import LensExploreProfiles from "./components/LensExploreProfiles";
import LensProfileSearch from "./components/LensProfileSearch";
import WalletConnect from "./components/WalletConnect";
import Database from "better-sqlite3";

import "./styles/ConnectPage.css";

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
    <div>
      <ConnectPage />
      {/* <WalletConnect
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

      <LensExploreProfiles following={following || []} /> */}
    </div>
  );
}

function MainPage() {}

function ConnectPage() {
  return (
    <div className="connect-page">
      <div className="connect-page-heading-section">
        <h1 className="connect-page-heading-section-heading">
          CREATE YOUR FRENSBOX
        </h1>
        <img
          className="connect-page-heading-section-img"
          src="box.svg"
          alt="A box of friends"
        />
      </div>
      <div className="connect-page-text-section">
        <div className="connect-page-text">
          <div className="connect-page-text-img">
            <img src="heart.svg" alt="" />
          </div>
          <div className="connect-page-text-p">
            <h3 className="connect-page-text-p-heading">
              meaningful connections
            </h3>
            <p className="connect-page-text-p-heading-text">
              note the shared interests and get personalized AI reminders
            </p>
          </div>
        </div>
        <div className="connect-page-text">
          <div className="connect-page-text-img">
            <img src="nails.png" alt="" />
          </div>
          <div className="connect-page-text-p">
            <h3 className="connect-page-text-p-heading">
              own our social graph
            </h3>
            <p className="connect-page-text-p-heading-text">
              all the connections stored on Lens Protocol on-chain
            </p>
          </div>
        </div>
        <div className="connect-page-text">
          <div className="connect-page-text-img">
            <img src="butterfly.svg" alt="" />
          </div>
          <div className="connect-page-text-p">
            <h3 className="connect-page-text-p-heading">
              true web3 dev native experience
            </h3>
            <p className="connect-page-text-p-heading-text">
              do not leave Telegram. get a Friends tab right here
            </p>
          </div>
        </div>
      </div>
      <div className="connect-page-button-section">
        <button className="connect-page-button-section-button">connect</button>
      </div>
    </div>
  );
}
