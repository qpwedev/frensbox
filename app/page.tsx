"use client";
import {
  Following,
  useExploreProfiles,
  useFollow,
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
import "./styles/MainScreen.css";

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

  // const {
  //   execute: follow,
  //   error,
  //   isPending,
  // } = useFollow({ followee, follower });

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

  if (!wallet) return <ConnectPage onLoginClick={onLoginClick} />;
  else return <MainScreen frens={following || []} />;
}

function ConnectPage({ onLoginClick }: { onLoginClick: () => Promise<void> }) {
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
              Meaningful connections
            </h3>
            <p className="connect-page-text-p-heading-text">
              Note the shared interests and get personalized AI reminders
            </p>
          </div>
        </div>
        <div className="connect-page-text">
          <div className="connect-page-text-img">
            <img src="nails.png" alt="" />
          </div>
          <div className="connect-page-text-p">
            <h3 className="connect-page-text-p-heading">
              Own our social graph
            </h3>
            <p className="connect-page-text-p-heading-text">
              All the connections stored on Lens Protocol on-chain
            </p>
          </div>
        </div>
        <div className="connect-page-text">
          <div className="connect-page-text-img">
            <img src="butterfly.svg" alt="" />
          </div>
          <div className="connect-page-text-p">
            <h3 className="connect-page-text-p-heading">
              True web3 dev native experience
            </h3>
            <p className="connect-page-text-p-heading-text">
              Do not leave Telegram. get a Friends tab right here
            </p>
          </div>
        </div>
      </div>
      <div className="connect-page-button-section">
        <button
          className="connect-page-button-section-button"
          onClick={onLoginClick}
        >
          Connect
        </button>
      </div>
    </div>
  );
}

function MainScreen({ frens }: { frens: Following[] }) {
  return (
    <div className="main-screen">
      <div className="main-screen-heading">
        <div className="main-screen-heading-upper-row">
          <div className="main-screen-heading-upper-row-left">
            <div className="main-screen-heading-upper-row-left-logo">
              <img src="box.svg" alt="a friend box" />
            </div>
            <div className="main-screen-heading-upper-row-left-title">
              FRENSBOX
            </div>
          </div>
          <div className="main-screen-heading-upper-row-right">
            <button>Log Out</button>
          </div>
        </div>
        <div className="main-screen-heading-frens">
          <p className="main-screen-heading-frens-number">230</p>
          <p className="main-screen-heading-frens-text">frens</p>
        </div>
        <div className="main-screen-heading-lower-row">
          <input
            className="main-screen-heading-lower-row-input"
            type="text"
            // onSubmit={handleFollowSubmit}
          />
          <button className="main-screen-heading-lower-row-button">
            add frens
          </button>
        </div>
      </div>
      <div className="main-screen-body">
        <div className="main-screen-body-frens">
          <FrensList list={frens} limit={30} />
        </div>
      </div>
    </div>
  );
}

function FrensList({ list, limit }: { list: Following[]; limit: number }) {
  const limitedList = list.slice(0, limit);
  console.log(limitedList);

  return (
    <div className="frens-list">
      {limitedList.map((fren: Following, index: number) => (
        <FrensListItem frenRaw={fren} key={index} />
      ))}
    </div>
  );
}

function FrensListItem({ frenRaw }: { frenRaw: Following }) {
  const fren = frenRaw.profile;
  return (
    <div className="frens-list-item">
      <div className="frens-list-item-img">
        <img src={fren.picture.original.url} alt="fren's picture" />
        <div className="frens-list-item-handle">
          {fren.handle ? fren.handle : "No handle"}
        </div>
      </div>
      <button className="frens-list-item-button">view</button>
    </div>
  );
}
